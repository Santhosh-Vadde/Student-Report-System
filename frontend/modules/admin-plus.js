// Admin "plus" module: bulk student CSV import, multi-semester transcript PDF, attendance-shortage
// notices, and bonafide/transfer certificate generation. Loaded after app.js and student-data.js on
// admin.html; everything here is additive and does not touch setupAdmin()'s closures in app.js.

(function () {
  const session = protectPage("admin");
  if (!session) return;

  const esc = escapeHtml;
  const parseCsv = text => text.replace(/\r/g, "").split("\n").filter(line => line.trim()).map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")));

  /* ============================== Bulk student CSV import ============================== */

  const setupStudentCsvImport = () => {
    const button = document.getElementById("studentCsvBtn");
    const input = document.getElementById("studentCsvInput");
    const message = document.getElementById("studentCsvMessage");
    const template = document.getElementById("studentCsvTemplate");
    if (!button) return;
    template.addEventListener("click", event => {
      event.preventDefault();
      const rows = [["Student ID", "Name", "Email", "Department", "Batch", "Section", "Date of Birth", "Parent Name", "Parent Contact"], ["2500032999", "Jane Doe", "2500032999@kluniversity.in", "CSE", "2025-2029", "CSE-1", "", "", ""]];
      downloadFile("\uFEFF" + rows.map(row => row.join(",")).join("\r\n"), "student-import-template.csv", "text/csv;charset=utf-8");
    });
    button.addEventListener("click", async () => {
      const file = input.files[0];
      if (!file) { message.textContent = "Choose a CSV file first."; return; }
      const rows = parseCsv(await file.text());
      if (rows.length < 2) { message.textContent = "The file has no data rows."; return; }
      const header = rows[0].map(cell => cell.toLowerCase());
      const col = name => header.findIndex(cell => cell.includes(name));
      const idIndex = col("id");
      const nameIndex = col("name");
      const emailIndex = col("email");
      const deptIndex = col("department");
      const batchIndex = col("batch");
      const sectionIndex = col("section");
      const dobIndex = col("birth");
      const parentNameIndex = col("parent name");
      const parentContactIndex = col("parent contact");
      if (idIndex === -1 || nameIndex === -1 || emailIndex === -1) { message.textContent = "The CSV needs at least Student ID, Name and Email columns."; return; }
      const students = getStudents(true);
      const users = readStore(KEYS.users, []);
      let created = 0;
      let updated = 0;
      const skipped = [];
      rows.slice(1).forEach(row => {
        const universityId = (row[idIndex] || "").trim();
        const name = (row[nameIndex] || "").trim();
        const email = (row[emailIndex] || "").trim().toLowerCase();
        if (!universityId || !name || !email) { skipped.push(`${universityId || "(blank)"}: missing required field`); return; }
        if (!/^25000\d{5}@kluniversity\.in$/.test(email)) { skipped.push(`${universityId}: email must match 25000xxxxx@kluniversity.in`); return; }
        if (universityId !== email.split("@")[0]) { skipped.push(`${universityId}: student ID must match the email number`); return; }
        const department = deptIndex !== -1 && row[deptIndex] ? row[deptIndex].trim() : "CSE";
        const batch = batchIndex !== -1 && row[batchIndex] ? row[batchIndex].trim() : "2025-2029";
        const section = sectionIndex !== -1 && row[sectionIndex] ? row[sectionIndex].trim() : `${department}-1`;
        const dateOfBirth = dobIndex !== -1 ? row[dobIndex] || "" : "";
        const parentName = parentNameIndex !== -1 ? row[parentNameIndex] || "" : "";
        const parentContact = parentContactIndex !== -1 ? row[parentContactIndex] || "" : "";
        const existing = students.find(item => item.universityId === universityId || item.email.toLowerCase() === email);
        const conflict = students.find(item => item !== existing && (item.universityId === universityId || item.email.toLowerCase() === email));
        if (conflict) { skipped.push(`${universityId}: conflicts with another existing student's ID or email`); return; }
        if (existing) {
          Object.assign(existing, { name, email, universityId, department, batch, section, dateOfBirth: dateOfBirth || existing.dateOfBirth, parentName: parentName || existing.parentName, parentContact: parentContact || existing.parentContact });
          const user = users.find(item => item.studentId === existing.id);
          if (user) { user.name = name; user.email = email; }
          updated++;
        } else {
          const studentId = makeId("stu");
          students.push({ id: studentId, name, email, universityId, department, batch, section, dateOfBirth, parentName, parentContact, semester: readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER, enrolledSubjects: [...SUBJECTS], grades: {}, attendance: 0, marks: Object.fromEntries(SUBJECTS.map(subject => [subject, 0])), totalMarks: Object.fromEntries(SUBJECTS.map(subject => [subject, 100])), remarks: "Academic record has not been entered yet." });
          users.push({ id: makeId("usr"), name, email, password: universityId, role: "student", studentId });
          created++;
        }
      });
      writeStore(KEYS.students, students);
      writeStore(KEYS.users, users);
      logActivity(`Imported students from CSV (${created} created, ${updated} updated)`, session.name);
      message.textContent = `${created} student${created === 1 ? "" : "s"} created, ${updated} updated.${skipped.length ? ` ${skipped.length} row(s) skipped: ${skipped.slice(0, 4).join("; ")}${skipped.length > 4 ? "\u2026" : ""}` : ""}`;
      message.classList.add("success");
      input.value = "";
      setTimeout(() => window.location.reload(), 1400);
    });
  };

  /* ============================== Attendance shortage notices ============================== */

  const renderAttendanceShortage = () => {
    const container = document.getElementById("attendanceShortageList");
    if (!container) return;
    const students = getStudents().filter(student => Number(student.attendance) < 75).sort((a, b) => Number(a.attendance) - Number(b.attendance));
    container.innerHTML = students.length ? `<div class="table-wrap"><table><thead><tr><th>Student</th><th>Student ID</th><th>Department</th><th>Attendance</th><th>Action</th></tr></thead><tbody>${students.map(student => `<tr><td><strong>${esc(student.name)}</strong></td><td>${esc(student.universityId)}</td><td>${esc(student.department)}</td><td><span class="status-pill bad">${Number(student.attendance).toFixed(1)}%</span></td><td><button type="button" class="btn secondary small" data-shortage-letter="${student.id}">Download Notice</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">No students are currently below 75% attendance.</div>`;
  };

  const downloadShortageLetter = studentId => {
    const student = getStudents().find(item => item.id === studentId);
    if (!student) return;
    const settings = readStore(KEYS.settings, {});
    const lines = [
      { text: settings.schoolName || "KL University", size: 18 },
      { text: "ATTENDANCE SHORTAGE NOTICE", size: 14 },
      { text: "", size: 10 },
      { text: `Date: ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date())}`, size: 10 },
      { text: "", size: 10 },
      { text: "To,", size: 10 },
      { text: `Parent / Guardian of ${student.name}`, size: 10 },
      { text: `${student.parentName || "Not on record"}${student.parentContact ? `, ${student.parentContact}` : ""}`, size: 10 },
      { text: "", size: 10 },
      { text: `Subject: Shortage of attendance - ${student.name} (${student.universityId})`, size: 11 },
      { text: "", size: 10 },
      { text: `This is to inform you that ${student.name}, a student of ${student.department},`, size: 10 },
      { text: `Section ${student.section || "-"}, currently has an overall attendance of`, size: 10 },
      { text: `${Number(student.attendance).toFixed(1)}%, which is below the university's required`, size: 10 },
      { text: "minimum of 75%. Continued shortage may affect examination eligibility.", size: 10 },
      { text: "", size: 10 },
      { text: "Please ensure regular attendance going forward and contact the academic", size: 10 },
      { text: "office if you have any concerns.", size: 10 },
      { text: "", size: 10 },
      { text: `${settings.contact || "Academic Office"}`, size: 9 },
      { text: "Authorized Signature: Registrar", size: 9 }
    ];
    downloadFile(buildSimplePdf(lines), `attendance-notice-${student.universityId}.pdf`, "application/pdf");
    logActivity(`Downloaded an attendance shortage notice for ${student.name}`, session.name);
  };

  /* ============================== Academic Records: department & faculty overview ============================== */

  const renderRecordsOverview = () => {
    const deptSelect = document.getElementById("recordsFilterDepartment");
    const facultySelect = document.getElementById("recordsFilterFaculty");
    if (!deptSelect || !facultySelect) return;
    const students = getStudents();
    const departments = [...new Set(students.map(student => student.department).filter(Boolean))].sort();
    const allFaculty = readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived);
    const deptValue = deptSelect.value || "all";
    const facultyOptions = deptValue === "all" ? allFaculty : allFaculty.filter(user => facultyDepartments(user).includes(deptValue));
    const facultyValue = facultyOptions.some(user => user.id === facultySelect.value) ? facultySelect.value : "all";
    deptSelect.innerHTML = `<option value="all">All departments</option>${departments.map(department => `<option value="${esc(department)}" ${department === deptValue ? "selected" : ""}>${esc(department)}</option>`).join("")}`;
    facultySelect.innerHTML = `<option value="all">All faculty${deptValue === "all" ? "" : " in this department"}</option>${facultyOptions.map(user => `<option value="${esc(user.id)}" ${user.id === facultyValue ? "selected" : ""}>${esc(user.name)}</option>`).join("")}`;
    const selectedFaculty = facultyValue !== "all" ? facultyOptions.find(user => user.id === facultyValue) : null;
    const facultySubjects = selectedFaculty?.subjects || [];
    const filtered = students.filter(student =>
      (deptValue === "all" || student.department === deptValue) &&
      (facultyValue === "all" || student.enrolledSubjects?.some(subject => facultySubjects.includes(subject))));
    const outcomes = filtered.map(student => studentOutcome(student));
    const passed = outcomes.filter(item => item.status === "Passed").length;
    const failed = outcomes.filter(item => item.status === "Failed").length;
    const detained = outcomes.filter(item => item.status === "Detained").length;
    const percent = (part, whole) => whole ? (part / whole * 100).toFixed(1) : "0.0";
    document.getElementById("recordsOverviewStats").innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Students</p><strong>${filtered.length}</strong><small>In this filter</small></div></article><article class="stat-card"><span class="stat-icon green">%</span><div><p>Pass %</p><strong>${percent(passed, filtered.length)}%</strong><small>${passed} passed</small></div></article><article class="stat-card"><span class="stat-icon amber">%</span><div><p>Fail %</p><strong>${percent(failed, filtered.length)}%</strong><small>${failed} failed</small></div></article><article class="stat-card"><span class="stat-icon red">!</span><div><p>Detained</p><strong>${detained}</strong><small>Attendance below 75%</small></div></article>`;
    const subjectColumns = facultySubjects;
    document.getElementById("recordsOverviewTable").innerHTML = filtered.length ? `<div class="table-wrap"><table><thead><tr><th>Student</th><th>ID</th><th>Department</th>${subjectColumns.length ? subjectColumns.map(subject => `<th>${esc(subjectConfigFor(subject)?.shortName || subject)}</th>`).join("") : "<th>Average</th>"}<th>Status</th></tr></thead><tbody>${filtered.map(student => {
      const outcome = studentOutcome(student);
      const marksCells = subjectColumns.length ? subjectColumns.map(subject => `<td>${student.grades?.[subject] ? finalScoreFor(student.grades[subject]).toFixed(1) : "\u2014"}%</td>`).join("") : `<td>${outcome.average.toFixed(1)}%</td>`;
      return `<tr><td><strong>${esc(student.name)}</strong></td><td>${esc(student.universityId)}</td><td>${esc(student.department)}</td>${marksCells}<td><span class="status-pill ${outcomeClass(outcome.status)}">${outcome.status}</span></td></tr>`;
    }).join("")}</tbody></table></div>` : `<div class="empty-state">No students match this filter.</div>`;
  };

  /* ============================== Faculty attendance (classes actually conducted) ============================== */

  const renderFacultyAttendance = () => {
    const container = document.getElementById("facultyAttendanceList");
    if (!container) return;
    const faculty = readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived);
    const log = readStore(KEYS.attendanceLog, []);
    container.innerHTML = faculty.length ? `<div class="table-wrap"><table><thead><tr><th>Faculty</th><th>Subjects</th><th>Classes conducted</th><th>Last conducted</th></tr></thead><tbody>${faculty.map(user => {
      const records = log.filter(item => item.facultyId === user.id);
      const last = records.length ? records.reduce((latest, item) => item.date > latest ? item.date : latest, records[0].date) : null;
      return `<tr><td><strong>${esc(user.name)}</strong></td><td>${(user.subjects || []).map(subject => esc(subjectConfigFor(subject)?.shortName || subject)).join(", ") || "Not assigned"}</td><td>${records.length}</td><td>${last ? esc(formatAcademicDate(last)) : "\u2014"}</td></tr>`;
    }).join("")}</tbody></table></div>` : `<div class="empty-state">No faculty accounts yet.</div>`;
  };

  /* ============================== Classrooms: faculty locations ============================== */

  const renderFacultyLocations = () => {
    const container = document.getElementById("facultyLocationsList");
    const daySelect = document.getElementById("adminRoomsDay");
    const periodSelect = document.getElementById("adminRoomsPeriod");
    if (!container || !daySelect?.value || !periodSelect?.value) return;
    const day = daySelect.value;
    const period = Number(periodSelect.value);
    const faculty = readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived);
    const allotments = readStore(KEYS.roomAllotments, []).filter(item => item.day === day && Number(item.period) === period);
    container.innerHTML = faculty.length ? `<div class="table-wrap"><table><thead><tr><th>Faculty</th><th>Subject</th><th>Status</th></tr></thead><tbody>${faculty.map(user => {
      const codes = new Set((user.subjects || []).map(subject => subjectConfigFor(subject)?.code).filter(Boolean));
      const allotment = allotments.find(item => codes.has(item.courseCode));
      const courseLabel = allotment ? (SUBJECT_CONFIG.find(item => item.code === allotment.courseCode)?.shortName || allotment.courseCode) : ((user.subjects || []).map(subject => esc(subjectConfigFor(subject)?.shortName || subject)).join(", ") || "\u2014");
      return `<tr><td><strong>${esc(user.name)}</strong></td><td>${allotment ? esc(courseLabel) : courseLabel}</td><td>${allotment ? `<span class="status-pill warn">Teaching in ${esc(allotment.room)}</span>` : `<span class="status-pill good">Free</span>`}</td></tr>`;
    }).join("")}</tbody></table></div>` : `<div class="empty-state">No faculty accounts yet.</div>`;
  };

  /* ============================== Reports: department + ID search filter ============================== */

  const applyReportFilter = () => {
    const select = document.getElementById("reportStudentSelect");
    const deptSelect = document.getElementById("reportFilterDepartment");
    const searchInput = document.getElementById("reportIdSearch");
    if (!select || !deptSelect) return;
    const students = getStudents();
    const departments = [...new Set(students.map(student => student.department).filter(Boolean))].sort();
    const deptValue = deptSelect.value || "all";
    deptSelect.innerHTML = `<option value="all">All departments</option>${departments.map(department => `<option value="${esc(department)}" ${department === deptValue ? "selected" : ""}>${esc(department)}</option>`).join("")}`;
    const query = (searchInput?.value || "").trim().toLowerCase();
    const filtered = students.filter(student => (deptValue === "all" || student.department === deptValue) && (!query || student.universityId.toLowerCase().includes(query) || student.name.toLowerCase().includes(query)));
    const keepSelected = filtered.some(student => student.id === select.value) ? select.value : filtered[0]?.id;
    populateStudentSelect(select, filtered, keepSelected);
    document.getElementById("reportFilterCount").textContent = `${filtered.length} student${filtered.length === 1 ? "" : "s"}`;
    select.dispatchEvent(new Event("change"));
  };

  /* ============================== Official documents (transcript / bonafide / transfer) ============================== */

  const selectedReportStudent = () => getStudents().find(item => item.id === document.getElementById("reportStudentSelect")?.value);

  const showDocMessage = (text, ok = true) => {
    const message = document.getElementById("documentMessage");
    if (!message) return;
    message.textContent = text;
    message.classList.toggle("success", ok);
  };

  const downloadTranscript = () => {
    const student = selectedReportStudent();
    if (!student) { showDocMessage("Select a student first.", false); return; }
    if (typeof cumulativeResults !== "function") { showDocMessage("Transcript data is unavailable.", false); return; }
    const results = cumulativeResults(student);
    if (!results.length) { showDocMessage("No completed terms found for this student yet.", false); return; }
    const settings = readStore(KEYS.settings, {});
    const last = results[results.length - 1];
    const lines = [
      { text: settings.schoolName || "KL University", size: 18 },
      { text: "Official Academic Transcript", size: 12 },
      { text: "", size: 10 },
      { text: `Student: ${student.name}`, size: 11 },
      { text: `Student ID: ${student.universityId}`, size: 10 },
      { text: `Department: ${student.department || "Not provided"}   Section: ${student.section || "Not provided"}`, size: 10 },
      { text: `Batch: ${student.batch || "Not provided"}`, size: 10 },
      { text: "", size: 10 },
      { text: "Academic Year        Semester         Credits   SGPA", size: 10 },
      ...results.map(result => ({ text: `${result.term.academicYear.padEnd(21)}${result.term.semester.padEnd(17)}${String(result.credits).padStart(7)}   ${result.sgpa.toFixed(2)}`, size: 9 })),
      { text: "", size: 10 },
      { text: `Total credits earned: ${last.cumulativeCredits}`, size: 11 },
      { text: `Cumulative CGPA: ${last.cgpa.toFixed(2)}`, size: 11 },
      { text: "", size: 10 },
      { text: `Issued: ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date())}`, size: 9 },
      { text: `${settings.contact || "Academic Office"}  \u00b7  Authorized Signature: Registrar`, size: 9 }
    ];
    downloadFile(buildSimplePdf(lines), `transcript-${student.universityId}.pdf`, "application/pdf");
    logActivity(`Downloaded a transcript for ${student.name}`, session.name);
    showDocMessage("Transcript downloaded.");
  };

  const downloadBonafide = () => {
    const student = selectedReportStudent();
    if (!student) { showDocMessage("Select a student first.", false); return; }
    const settings = readStore(KEYS.settings, {});
    const purpose = document.getElementById("bonafidePurpose").value.trim() || "General purpose";
    const lines = [
      { text: settings.schoolName || "KL University", size: 18 },
      { text: "BONAFIDE CERTIFICATE", size: 14 },
      { text: "", size: 10 },
      { text: `This is to certify that ${student.name}, bearing University ID`, size: 11 },
      { text: `${student.universityId}, is a bonafide student of this University,`, size: 11 },
      { text: `pursuing ${student.department || "Not provided"}, Section ${student.section || "-"}, Batch`, size: 11 },
      { text: `${student.batch || "Not provided"}, during the academic year ${settings.academicYear || "2026-2027"},`, size: 11 },
      { text: `${settings.semesterName || CURRENT_SEMESTER}.`, size: 11 },
      { text: "", size: 10 },
      { text: `This certificate is issued for the purpose of: ${purpose}.`, size: 11 },
      { text: "", size: 10 },
      { text: `Date: ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date())}`, size: 10 },
      { text: "", size: 10 },
      { text: `${settings.contact || "Academic Office"}`, size: 9 },
      { text: "Authorized Signature: Registrar", size: 9 }
    ];
    downloadFile(buildSimplePdf(lines), `bonafide-certificate-${student.universityId}.pdf`, "application/pdf");
    logActivity(`Downloaded a bonafide certificate for ${student.name}`, session.name);
    showDocMessage("Bonafide certificate downloaded.");
  };

  const downloadTransfer = () => {
    const student = selectedReportStudent();
    if (!student) { showDocMessage("Select a student first.", false); return; }
    const settings = readStore(KEYS.settings, {});
    const reason = document.getElementById("transferReason").value.trim() || "Course completed";
    const lines = [
      { text: settings.schoolName || "KL University", size: 18 },
      { text: "TRANSFER CERTIFICATE", size: 14 },
      { text: "", size: 10 },
      { text: `Student Name: ${student.name}`, size: 11 },
      { text: `University ID: ${student.universityId}`, size: 10 },
      { text: `Department: ${student.department || "Not provided"}   Section: ${student.section || "-"}`, size: 10 },
      { text: `Batch: ${student.batch || "Not provided"}`, size: 10 },
      { text: "", size: 10 },
      { text: `Date of issue: ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date())}`, size: 10 },
      { text: `Reason for leaving: ${reason}`, size: 10 },
      { text: "Conduct: Good", size: 10 },
      { text: "", size: 10 },
      { text: "This is to certify that the above-named student was a bonafide student", size: 10 },
      { text: "of this University and bears good conduct and character.", size: 10 },
      { text: "", size: 10 },
      { text: `${settings.contact || "Academic Office"}`, size: 9 },
      { text: "Authorized Signature: Registrar", size: 9 }
    ];
    downloadFile(buildSimplePdf(lines), `transfer-certificate-${student.universityId}.pdf`, "application/pdf");
    logActivity(`Downloaded a transfer certificate for ${student.name}`, session.name);
    showDocMessage("Transfer certificate downloaded.");
  };

  /* ============================== Wire everything up ============================== */

  setupStudentCsvImport();
  renderAttendanceShortage();
  renderFacultyAttendance();
  document.querySelector('[data-section="attendance"]')?.addEventListener("click", () => { renderAttendanceShortage(); renderFacultyAttendance(); });
  document.getElementById("attendanceShortageList")?.addEventListener("click", event => {
    const id = event.target.dataset.shortageLetter;
    if (id) downloadShortageLetter(id);
  });
  renderRecordsOverview();
  document.getElementById("recordsFilterDepartment")?.addEventListener("change", renderRecordsOverview);
  document.getElementById("recordsFilterFaculty")?.addEventListener("change", renderRecordsOverview);
  document.querySelector('[data-section="records"]')?.addEventListener("click", renderRecordsOverview);
  renderFacultyLocations();
  document.getElementById("adminRoomsDay")?.addEventListener("change", renderFacultyLocations);
  document.getElementById("adminRoomsPeriod")?.addEventListener("change", renderFacultyLocations);
  document.querySelector('[data-section="classrooms"]')?.addEventListener("click", renderFacultyLocations);
  applyReportFilter();
  document.getElementById("reportFilterDepartment")?.addEventListener("change", applyReportFilter);
  document.getElementById("reportIdSearch")?.addEventListener("input", applyReportFilter);
  document.getElementById("downloadTranscriptBtn")?.addEventListener("click", downloadTranscript);
  document.getElementById("downloadBonafideBtn")?.addEventListener("click", downloadBonafide);
  document.getElementById("downloadTransferBtn")?.addEventListener("click", downloadTransfer);
})();
