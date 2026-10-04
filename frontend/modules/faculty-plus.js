// Faculty "plus" module: at-risk detection, weak-topic analysis, CO attainment, QR/code
// check-in, leave & substitution, re-evaluation review, teaching feedback, CSV import,
// rubric grading, weekly digest and a benchmark chart. Loaded after app.js and
// student-data.js on faculty.html; everything here is additive and does not touch the
// gradebook/attendance/remarks rendering already owned by setupFaculty() in app.js.

(function () {
  const session = protectPage("faculty");
  if (!session) return;

  const esc = escapeHtml;
  const getFacultyUser = () => readStore(KEYS.users, []).find(user => user.id === session.id && user.role === "faculty");
  const assignedSubjects = () => (getFacultyUser()?.subjects || []).filter(subject => SUBJECTS.includes(subject));
  const studentsForSubject = subject => assignedSubjects().includes(subject) ? getStudents().filter(student => student.enrolledSubjects?.includes(subject)) : [];
  const allMyStudents = () => [...new Map(assignedSubjects().flatMap(subject => studentsForSubject(subject)).map(student => [student.id, student])).values()];
  const fillSelect = (select, subjects, selected) => {
    if (!select) return;
    select.innerHTML = subjects.map(subject => `<option value="${esc(subject)}" ${subject === selected ? "selected" : ""}>${esc(subjectConfigFor(subject).shortName)}</option>`).join("");
  };
  // Uses the same term key the student portal uses for the current term, so question-wise
  // marks shown here are identical to what the student sees on their own Answer Scripts page.
  const currentTermForFaculty = () => {
    const term = currentAcademicTerm();
    return { ...term, isCurrent: true, key: `${term.academicYear}_${term.semester}`, yearOfStudy: 1, semesterNo: 1 };
  };

  /* ============================== At-Risk Students ============================== */

  const atRiskReasons = (student, subject) => {
    const reasons = [];
    const grade = student.grades?.[subject] || {};
    const internal = internalScoreFor(grade);
    const passMark = getGrading().d;
    if (internal < passMark) reasons.push(`Internals are ${internal.toFixed(0)}%, below the ${passMark}% pass mark`);
    if (Number(grade.mid1) && Number(grade.mid1) < passMark) reasons.push(`Mid 1 score of ${grade.mid1}% is below the pass mark`);
    if (Number(grade.mid2) && Number(grade.mid2) < passMark) reasons.push(`Mid 2 score of ${grade.mid2}% is below the pass mark`);
    const attendance = subjectAttendanceFor(student, subject);
    if (attendance < 75) reasons.push(`Attendance is ${attendance.toFixed(1)}%, below the 75% requirement`);
    else if (attendance < 80) reasons.push(`Attendance is ${attendance.toFixed(1)}%, close to the 75% limit`);
    const assignmentsPending = getAcademicRecords("assignments").filter(item => item.subject === subject && item.dueDate < todayIso() && !student.assignmentSubmissions?.[item.id]).length;
    if (assignmentsPending) reasons.push(`${assignmentsPending} assignment${assignmentsPending === 1 ? " is" : "s are"} overdue and not submitted`);
    return reasons;
  };

  const renderAtRisk = () => {
    const select = document.getElementById("atRiskSubject");
    if (!select) return;
    const subjects = assignedSubjects();
    const keep = subjects.includes(select.value) ? select.value : "all";
    select.innerHTML = `<option value="all">All my subjects</option>${subjects.map(subject => `<option value="${esc(subject)}" ${subject === keep ? "selected" : ""}>${esc(subjectConfigFor(subject).shortName)}</option>`).join("")}`;
    const targetSubjects = keep === "all" ? subjects : [keep];
    const flagged = [];
    targetSubjects.forEach(subject => studentsForSubject(subject).forEach(student => {
      const reasons = atRiskReasons(student, subject);
      if (reasons.length) flagged.push({ student, subject, reasons });
    }));
    const severe = flagged.filter(item => item.reasons.length >= 2).length;
    document.getElementById("atRiskStats").innerHTML = `<article class="stat-card"><span class="stat-icon amber">!</span><div><p>Flagged</p><strong>${flagged.length}</strong><small>Across ${targetSubjects.length} subject${targetSubjects.length === 1 ? "" : "s"}</small></div></article><article class="stat-card"><span class="stat-icon purple">!!</span><div><p>Multiple risk factors</p><strong>${severe}</strong><small>Two or more reasons</small></div></article>`;
    document.getElementById("atRiskList").innerHTML = flagged.length ? flagged.sort((a, b) => b.reasons.length - a.reasons.length).map(item => `<div class="flag-card ${item.reasons.length >= 2 ? "bad" : ""}"><div><strong>${esc(item.student.name)} \u00b7 ${esc(subjectConfigFor(item.subject).shortName)}</strong><p>${esc(item.student.universityId)}, ${esc(item.student.section || "")}</p><ul>${item.reasons.map(reason => `<li>${esc(reason)}</li>`).join("")}</ul></div></div>`).join("") : `<div class="empty-state">No students are currently at risk in this view.</div>`;
  };

  /* ============================== Mentees ============================== */

  const myMentees = () => {
    const sections = new Set(getFacultyUser()?.mentorSections || []);
    if (!sections.size) return [];
    return getStudents().filter(student => sections.has(student.section));
  };

  const renderMentees = () => {
    const statsEl = document.getElementById("menteeStats");
    const listEl = document.getElementById("menteeList");
    if (!listEl) return;
    const mentees = myMentees();
    if (!mentees.length) {
      statsEl.innerHTML = "";
      listEl.innerHTML = `<div class="empty-state">No mentor sections are assigned to you yet. Ask an administrator to assign one from your Faculty profile.</div>`;
      return;
    }
    const atRiskCount = mentees.filter(student => (student.enrolledSubjects || []).some(subject => atRiskReasons(student, subject).length)).length;
    const avgAttendance = mentees.reduce((sum, student) => sum + overallAttendanceFor(student), 0) / mentees.length;
    statsEl.innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Mentees</p><strong>${mentees.length}</strong><small>Across ${new Set(mentees.map(student => student.section)).size} section(s)</small></div></article><article class="stat-card"><span class="stat-icon amber">!</span><div><p>Need attention</p><strong>${atRiskCount}</strong><small>At risk in at least one subject</small></div></article><article class="stat-card"><span class="stat-icon purple">%</span><div><p>Avg attendance</p><strong>${avgAttendance.toFixed(1)}%</strong><small>Across all mentees</small></div></article>`;
    listEl.innerHTML = mentees.map(student => {
      const outcome = studentOutcome(student);
      const reasons = (student.enrolledSubjects || []).flatMap(subject => atRiskReasons(student, subject));
      return `<div class="queue-item">
        <div><strong>${esc(student.name)}</strong><span class="status-pill ${outcomeClass(outcome.status)}">${esc(outcome.status)}</span></div>
        <div class="queue-meta"><span>${esc(student.universityId)} \u00b7 ${esc(student.section || "")}</span><span>Attendance: ${overallAttendanceFor(student).toFixed(1)}%</span><span>Average: ${averageFor(student).toFixed(1)}%</span>${reasons.length ? `<span class="status-pill warn">${reasons.length} flag${reasons.length === 1 ? "" : "s"}</span>` : ""}</div>
        <label class="internal-note-entry"><span>Mentor note</span><textarea rows="2" maxlength="300" data-mentor-note="${student.id}" placeholder="Private mentor note, not shown to other faculty">${esc(student.mentorNotes || "")}</textarea></label>
      </div>`;
    }).join("");
  };

  const setupMentees = () => {
    document.getElementById("menteeNotesForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const students = getStudents();
      document.querySelectorAll("[data-mentor-note]").forEach(textarea => {
        const student = students.find(item => item.id === textarea.dataset.mentorNote);
        if (student) student.mentorNotes = textarea.value.trim();
      });
      writeStore(KEYS.students, students);
      logActivity("Updated mentor notes", session.name);
      const message = document.getElementById("menteeNotesMessage");
      message.textContent = "Mentor notes saved.";
      message.classList.add("success");
    });
  };

  /* ============================== Weak Topics ============================== */

  const renderWeakTopics = () => {
    const subjectSelect = document.getElementById("weakTopicSubject");
    const examSelect = document.getElementById("weakTopicExam");
    if (!subjectSelect || typeof EXAM_KINDS === "undefined") return;
    const subjects = assignedSubjects();
    const subjectKeep = subjects.includes(subjectSelect.value) ? subjectSelect.value : subjects[0];
    fillSelect(subjectSelect, subjects, subjectKeep);
    const examKeep = EXAM_KINDS.some(kind => kind.id === examSelect.value) ? examSelect.value : EXAM_KINDS[0].id;
    examSelect.innerHTML = EXAM_KINDS.map(kind => `<option value="${kind.id}" ${kind.id === examKeep ? "selected" : ""}>${esc(kind.label)}</option>`).join("");
    const container = document.getElementById("weakTopicSummary");
    if (!subjectKeep) { container.innerHTML = `<div class="empty-state">No teaching subjects assigned.</div>`; return; }
    const course = subjectConfigFor(subjectKeep);
    const kind = EXAM_KINDS.find(item => item.id === examKeep);
    const term = currentTermForFaculty();
    const students = studentsForSubject(subjectKeep);
    if (!students.length) { container.innerHTML = `<div class="empty-state">No enrolled students for this subject.</div>`; return; }
    const totals = new Map(kind.structure.map(([question]) => [question, { sum: 0, max: 0 }]));
    students.forEach(student => {
      examMarks(student, term, course, kind).questions.forEach(item => {
        const row = totals.get(item.question);
        row.sum += item.marks;
        row.max += item.max;
      });
    });
    const rows = [...totals.entries()].map(([question, { sum, max }]) => ({ question, percent: max ? sum / max * 100 : 0 })).sort((a, b) => a.percent - b.percent);
    const classAverage = rows.reduce((total, row) => total + row.percent, 0) / rows.length;
    container.innerHTML = `<p class="muted" style="margin-bottom:14px">Class average across all questions: <strong>${classAverage.toFixed(1)}%</strong>. Lowest-scoring questions are listed first.</p>` + rows.map(row => `<div class="metric-row"><span><strong>Q${esc(row.question)}</strong></span><div class="metric-track"><div class="metric-fill ${row.percent < 50 ? "bad" : row.percent < 70 ? "warn" : "good"}" style="width:${Math.max(2, row.percent)}%"></div></div><small>${row.percent.toFixed(0)}%</small></div>`).join("") +
      (rows[0]?.percent < 60 ? `<div class="flag-card info" style="margin-top:16px"><div><strong>Teaching suggestion</strong><p>Q${esc(rows[0].question)} is the weakest question at ${rows[0].percent.toFixed(0)}%. Consider a short revision session or an extra practice problem on that topic before the next exam.</p></div></div>` : "");
  };

  /* ============================== CO Attainment ============================== */

  const CO_LABELS = { CO1: "Explain core concepts", CO2: "Apply concepts to problems", CO3: "Analyse and choose a method", CO4: "Design and build a solution", CO5: "Communicate results (exams)" };

  const computeCoAttainment = subject => {
    const course = subjectConfigFor(subject);
    const term = currentTermForFaculty();
    const students = studentsForSubject(subject);
    if (!students.length) return null;
    const threshold = getGrading().c;
    const coPercents = { CO1: [], CO2: [], CO3: [], CO4: [], CO5: [] };
    students.forEach(student => {
      const internals = internalsFor(student, term, course);
      coPercents.CO1.push(internals.rows[0].marks / internals.rows[0].max * 100);
      coPercents.CO2.push(internals.rows[1].marks / internals.rows[1].max * 100);
      coPercents.CO3.push(internals.rows[2].marks / internals.rows[2].max * 100);
      coPercents.CO4.push(internals.rows[3].marks / internals.rows[3].max * 100);
      const examAvg = ["mid1", "mid2", "end"].map(id => examMarks(student, term, course, EXAM_KINDS.find(kind => kind.id === id)).percent).reduce((sum, value) => sum + value, 0) / 3;
      coPercents.CO5.push(examAvg);
    });
    const rows = Object.entries(coPercents).map(([co, values]) => {
      const meeting = values.filter(value => value >= threshold).length;
      const share = meeting / values.length * 100;
      const level = share >= 70 ? 3 : share >= 60 ? 2 : share >= 50 ? 1 : 0;
      return { co, share, level, average: values.reduce((sum, value) => sum + value, 0) / values.length };
    });
    return { course, rows, threshold };
  };

  const renderCoAttainment = () => {
    const select = document.getElementById("coSubject");
    if (!select) return;
    const subjects = assignedSubjects();
    const keep = subjects.includes(select.value) ? select.value : subjects[0];
    fillSelect(select, subjects, keep);
    const container = document.getElementById("coAttainment");
    if (!keep) { container.innerHTML = `<div class="empty-state">No teaching subjects assigned.</div>`; renderCoPoMatrix(null); return; }
    const data = computeCoAttainment(keep);
    if (!data) { container.innerHTML = `<div class="empty-state">No enrolled students for this subject.</div>`; renderCoPoMatrix(null); return; }
    const { rows, threshold } = data;
    container.innerHTML = `<p class="muted" style="margin-bottom:14px">Attainment = share of students scoring ${threshold}% or more on the mapped component. Level 3 needs 70% of students, Level 2 needs 60%, Level 1 needs 50%.</p>` +
      rows.map(row => `<div class="metric-row"><span><strong>${row.co}</strong><small>${esc(CO_LABELS[row.co])}</small></span><div class="metric-track"><div class="metric-fill ${row.level >= 2 ? "good" : row.level === 1 ? "warn" : "bad"}" style="width:${Math.max(2, row.share)}%"></div></div><small>${row.share.toFixed(0)}%</small></div>`).join("") +
      `<div class="tw"><table><thead><tr><th>CO</th><th>Average score</th><th>Students \u2265 ${threshold}%</th><th>Attainment level</th></tr></thead><tbody>${rows.map(row => `<tr><td><strong>${row.co}</strong></td><td>${row.average.toFixed(1)}%</td><td>${(row.share).toFixed(0)}%</td><td><span class="status-pill ${row.level >= 2 ? "good" : row.level === 1 ? "warn" : "bad"}">Level ${row.level}</span></td></tr>`).join("")}</tbody></table></div>`;
    renderCoPoMatrix(data);
  };

  /* ============================== CO-PO mapping matrix ============================== */

  const PO_LABELS = ["PO1 \u00b7 Engineering knowledge", "PO2 \u00b7 Problem analysis", "PO3 \u00b7 Design & development", "PO4 \u00b7 Modern tool usage", "PO5 \u00b7 Individual & team work", "PO6 \u00b7 Communication"];
  const DEFAULT_CO_PO = { CO1: [3, 1, 0, 0, 0, 0], CO2: [1, 3, 1, 0, 0, 0], CO3: [0, 1, 3, 2, 0, 0], CO4: [0, 0, 2, 3, 2, 0], CO5: [0, 0, 0, 0, 2, 3] };
  const coMatrixFor = course => readStore(KEYS.coMatrix, {})[course.code] || DEFAULT_CO_PO;

  const renderCoPoMatrix = data => {
    const matrixContainer = document.getElementById("coPoMatrix");
    const poContainer = document.getElementById("poAttainment");
    if (!matrixContainer) return;
    if (!data) { matrixContainer.innerHTML = ""; poContainer.innerHTML = ""; return; }
    const { course, rows } = data;
    const matrix = coMatrixFor(course);
    const cos = Object.keys(matrix);
    matrixContainer.innerHTML = `<table><thead><tr><th>CO</th>${PO_LABELS.map((label, index) => `<th title="${esc(label)}">PO${index + 1}</th>`).join("")}</tr></thead><tbody>${cos.map(co => `<tr><td><strong>${esc(co)}</strong></td>${matrix[co].map((value, index) => `<td><select data-co="${esc(co)}" data-po="${index}">${[0, 1, 2, 3].map(level => `<option value="${level}" ${value === level ? "selected" : ""}>${level === 0 ? "\u2013" : level}</option>`).join("")}</select></td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const levelByCo = Object.fromEntries(rows.map(row => [row.co, row.level]));
    const poResults = PO_LABELS.map((label, index) => {
      let weighted = 0;
      let weightSum = 0;
      cos.forEach(co => {
        const correlation = matrix[co][index];
        if (correlation > 0) { weighted += correlation * (levelByCo[co] || 0); weightSum += correlation; }
      });
      return { label, attainment: weightSum ? weighted / weightSum : null };
    });
    poContainer.innerHTML = `<h3 style="margin:16px 0 10px">PO attainment</h3>` + poResults.map(result => result.attainment === null
      ? `<div class="metric-row"><span>${esc(result.label)}</span><small class="muted">Not mapped</small></div>`
      : `<div class="metric-row"><span>${esc(result.label)}</span><div class="metric-track"><div class="metric-fill ${result.attainment >= 2 ? "good" : result.attainment >= 1 ? "warn" : "bad"}" style="width:${Math.max(2, result.attainment / 3 * 100)}%"></div></div><small>Level ${result.attainment.toFixed(1)} / 3</small></div>`).join("");
  };

  const setupCoPoMatrix = () => {
    document.getElementById("saveCoPoBtn")?.addEventListener("click", () => {
      const subject = document.getElementById("coSubject")?.value;
      if (!subject) return;
      const course = subjectConfigFor(subject);
      const matrix = {};
      document.querySelectorAll("#coPoMatrix select").forEach(select => {
        matrix[select.dataset.co] ||= [0, 0, 0, 0, 0, 0];
        matrix[select.dataset.co][Number(select.dataset.po)] = Number(select.value);
      });
      const all = readStore(KEYS.coMatrix, {});
      all[course.code] = matrix;
      writeStore(KEYS.coMatrix, all);
      logActivity(`Updated CO-PO mapping for ${course.shortName}`, session.name);
      const message = document.getElementById("coPoMessage");
      message.textContent = "Mapping saved.";
      message.classList.add("success");
      renderCoAttainment();
    });
  };

  /* ============================== Lesson coverage ============================== */

  const currentWeekNumber = () => {
    const start = termStartDate(currentTermForFaculty());
    const days = Math.floor((new Date(`${todayIso()}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);
    return Math.max(1, Math.floor(days / 7) + 1);
  };

  const renderCoverage = () => {
    const select = document.getElementById("coverageSubject");
    if (!select) return;
    const subjects = assignedSubjects();
    const keep = subjects.includes(select.value) ? select.value : subjects[0];
    fillSelect(select, subjects, keep);
    const statsEl = document.getElementById("coverageStats");
    const listEl = document.getElementById("coverageList");
    if (!keep) { statsEl.innerHTML = ""; listEl.innerHTML = `<div class="empty-state">No teaching subjects assigned.</div>`; return; }
    const week = currentWeekNumber();
    const topics = readStore(KEYS.lessonCoverage, []).filter(item => item.subject === keep).sort((a, b) => a.plannedWeek - b.plannedWeek);
    const covered = topics.filter(item => item.covered).length;
    const behind = topics.filter(item => !item.covered && item.plannedWeek < week).length;
    statsEl.innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Topics planned</p><strong>${topics.length}</strong><small>Current week ${week}</small></div></article><article class="stat-card"><span class="stat-icon green">\u2713</span><div><p>Covered</p><strong>${covered}</strong><small>${topics.length ? (covered / topics.length * 100).toFixed(0) : 0}% of plan</small></div></article><article class="stat-card"><span class="stat-icon amber">!</span><div><p>Behind schedule</p><strong>${behind}</strong><small>Planned week has passed</small></div></article>`;
    listEl.innerHTML = topics.length ? topics.map(item => `<div class="queue-item">
        <div><strong>${esc(item.title)}</strong><span class="status-pill ${item.covered ? "good" : item.plannedWeek < week ? "bad" : "warn"}">${item.covered ? `Covered${item.coveredOn ? ` on ${esc(formatAcademicDate(item.coveredOn))}` : ""}` : item.plannedWeek < week ? "Behind schedule" : "Planned"}</span></div>
        <div class="queue-meta"><span>Planned week ${item.plannedWeek}</span></div>
        <div class="queue-actions">${!item.covered ? `<button type="button" class="btn primary small" data-mark-covered="${item.id}">Mark covered</button>` : ""}<button type="button" class="btn danger small" data-remove-topic="${item.id}">Remove</button></div>
      </div>`).join("") : `<div class="empty-state">No topics added yet.</div>`;
  };

  const setupCoverage = () => {
    document.getElementById("coverageSubject")?.addEventListener("change", renderCoverage);
    document.getElementById("coverageAddForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const subject = document.getElementById("coverageSubject").value;
      if (!assignedSubjects().includes(subject)) return;
      const title = document.getElementById("coverageTitle").value.trim();
      const plannedWeek = Number(document.getElementById("coverageWeek").value);
      if (!title || !plannedWeek) return;
      const topics = readStore(KEYS.lessonCoverage, []);
      topics.push({ id: makeId("topic"), subject, title, plannedWeek, covered: false, facultyId: session.id });
      writeStore(KEYS.lessonCoverage, topics);
      document.getElementById("coverageAddForm").reset();
      const message = document.getElementById("coverageMessage");
      message.textContent = "Topic added.";
      message.classList.add("success");
      renderCoverage();
    });
    document.getElementById("coverageList")?.addEventListener("click", event => {
      const markId = event.target.dataset.markCovered;
      const removeId = event.target.dataset.removeTopic;
      if (!markId && !removeId) return;
      const topics = readStore(KEYS.lessonCoverage, []);
      if (markId) {
        const topic = topics.find(item => item.id === markId);
        if (topic) { topic.covered = true; topic.coveredOn = todayIso(); }
        writeStore(KEYS.lessonCoverage, topics);
      } else {
        writeStore(KEYS.lessonCoverage, topics.filter(item => item.id !== removeId));
      }
      renderCoverage();
    });
  };

  /* ============================== Co-curricular bonus marks ============================== */

  const renderBonusStudentSelect = () => {
    const subject = document.getElementById("bonusSubject")?.value;
    const select = document.getElementById("bonusStudent");
    if (!select) return;
    const students = subject ? studentsForSubject(subject) : [];
    select.innerHTML = students.map(student => `<option value="${student.id}">${esc(student.name)} (${esc(student.universityId)})</option>`).join("") || `<option value="">No students enrolled</option>`;
  };

  const renderBonusQueue = () => {
    const container = document.getElementById("facultyBonusQueue");
    if (!container) return;
    const requests = readStore(KEYS.bonusRequests, []).filter(item => item.facultyId === session.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = requests.length ? requests.map(request => `<div class="queue-item">
        <div>+${request.points} internal points for <strong>${esc(request.studentName)}</strong> \u00b7 ${esc(subjectConfigFor(request.subject)?.shortName || request.subject)}</div>
        <div class="queue-meta"><span>${esc(request.reason || "No reason given")}</span><span class="status-pill ${request.status === "Approved" ? "good" : request.status === "Rejected" ? "bad" : "warn"}">${esc(request.status)}</span></div>
      </div>`).join("") : `<div class="empty-state">No bonus requests submitted yet.</div>`;
  };

  const setupBonus = () => {
    const form = document.getElementById("bonusForm");
    if (!form) return;
    fillSelect(document.getElementById("bonusSubject"), assignedSubjects());
    renderBonusStudentSelect();
    document.getElementById("bonusSubject").addEventListener("change", renderBonusStudentSelect);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const subject = document.getElementById("bonusSubject").value;
      if (!assignedSubjects().includes(subject)) return;
      const student = studentsForSubject(subject).find(item => item.id === document.getElementById("bonusStudent").value);
      const message = document.getElementById("bonusMessage");
      if (!student) { message.textContent = "Choose a valid student."; return; }
      const points = Math.max(1, Math.min(10, Number(document.getElementById("bonusPoints").value) || 0));
      const requests = readStore(KEYS.bonusRequests, []);
      requests.push({ id: makeId("bonus"), facultyId: session.id, facultyName: session.name, subject, studentId: student.id, studentName: student.name, studentUniversityId: student.universityId, points, reason: document.getElementById("bonusReason").value.trim(), status: "Pending", createdAt: new Date().toISOString() });
      writeStore(KEYS.bonusRequests, requests);
      logActivity(`Requested a ${points}pt bonus for ${student.name} (${subjectConfigFor(subject)?.shortName || subject})`, session.name);
      form.reset();
      fillSelect(document.getElementById("bonusSubject"), assignedSubjects(), subject);
      renderBonusStudentSelect();
      message.textContent = "Request sent to the administrator.";
      message.classList.add("success");
      renderBonusQueue();
      enhancePendingTasks();
    });
  };

  /* ============================== Gradebook CSV import ============================== */

  const COLUMN_ALIASES = { assignment: ["assignment", "home assignment"], alm: ["alm"], quiz: ["quiz", "tutorial"], lab: ["lab"], mid1: ["mid1", "mid 1"], mid2: ["mid2", "mid 2"], semend: ["semend", "sem end", "semester end"] };
  const parseCsv = text => text.replace(/\r/g, "").split("\n").filter(line => line.trim()).map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")));

  const setupCsvImport = () => {
    const button = document.getElementById("gradebookCsvBtn");
    const input = document.getElementById("gradebookCsvInput");
    const message = document.getElementById("gradebookCsvMessage");
    const template = document.getElementById("gradebookCsvTemplate");
    if (!button) return;
    template.addEventListener("click", event => {
      event.preventDefault();
      const subject = document.getElementById("gradebookSubject").value;
      const rows = [["Student ID", "Assignment", "ALM", "Quiz", "Lab", "Mid 1", "Mid 2", "Sem End"], ...studentsForSubject(subject).map(student => [student.universityId, "", "", "", "", "", "", ""])];
      downloadFile("\uFEFF" + rows.map(row => row.join(",")).join("\r\n"), "gradebook-import-template.csv", "text/csv;charset=utf-8");
    });
    button.addEventListener("click", async () => {
      const subject = document.getElementById("gradebookSubject").value;
      const file = input.files[0];
      if (!assignedSubjects().includes(subject)) { message.textContent = "Pick one of your assigned subjects first."; return; }
      if (!file) { message.textContent = "Choose a CSV file first."; return; }
      const submission = readStore(KEYS.gradeSubmissions, []).find(item => item.facultyId === session.id && item.subject === subject && item.semester === (readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER));
      if (submission?.status === "submitted") { message.textContent = "This gradebook is locked. Ask an administrator to reopen it."; return; }
      const rows = parseCsv(await file.text());
      if (rows.length < 2) { message.textContent = "The file has no data rows."; return; }
      const header = rows[0].map(cell => cell.toLowerCase());
      const idIndex = header.findIndex(cell => cell.includes("id"));
      if (idIndex === -1) { message.textContent = "The CSV needs a Student ID column."; return; }
      const columnIndex = {};
      Object.entries(COLUMN_ALIASES).forEach(([key, aliases]) => {
        const index = header.findIndex(cell => aliases.includes(cell));
        if (index !== -1) columnIndex[key] = index;
      });
      if (!Object.keys(columnIndex).length) { message.textContent = "No recognised mark columns were found (Assignment, ALM, Quiz, Lab, Mid 1, Mid 2, Sem End)."; return; }
      const students = getStudents();
      let updated = 0;
      const skipped = [];
      rows.slice(1).forEach(row => {
        const id = row[idIndex];
        const student = students.find(item => item.universityId === id && item.enrolledSubjects?.includes(subject));
        if (!student) { skipped.push(id || "(blank)"); return; }
        student.grades ||= {};
        const grade = { ...(student.grades[subject] || {}) };
        let rowChanged = false;
        Object.entries(columnIndex).forEach(([key, index]) => {
          const raw = row[index];
          if (raw === undefined || raw === "") return;
          const value = Math.max(0, Math.min(100, Number(raw) || 0));
          grade[key === "semend" ? "semEnd" : key] = value;
          rowChanged = true;
        });
        if (rowChanged) { student.grades[subject] = grade; updated++; }
      });
      writeStore(KEYS.students, students);
      logActivity(`Imported gradebook marks for ${subjectConfigFor(subject)?.shortName || subject} from CSV (${updated} students)`, session.name);
      message.textContent = `${updated} student${updated === 1 ? "" : "s"} updated.${skipped.length ? ` ${skipped.length} row(s) skipped (not enrolled or unknown ID: ${skipped.slice(0, 5).join(", ")}${skipped.length > 5 ? "\u2026" : ""}).` : ""}`;
      input.value = "";
      document.getElementById("gradebookSubject").dispatchEvent(new Event("change"));
    });
  };

  /* ============================== Code check-in roll call ============================== */

  let checkinTimer = null;

  const closeExpiredCheckinSessions = () => {
    const sessions = readStore(KEYS.checkinSessions, []);
    const now = Date.now();
    let changed = false;
    sessions.forEach(item => { if (item.open && item.expiresAt < now) { item.open = false; item.autoExpired = true; changed = true; } });
    if (changed) writeStore(KEYS.checkinSessions, sessions);
    return sessions;
  };

  const myOpenCheckinSession = () => closeExpiredCheckinSessions().find(item => item.open && item.facultyId === session.id);

  const closeCheckinSession = (checkinSession, auto = false) => {
    // Re-read from storage: students may have checked in after this object was last rendered.
    const sessions = readStore(KEYS.checkinSessions, []);
    const fresh = sessions.find(item => item.id === checkinSession.id) || checkinSession;
    const subject = fresh.subject;
    const students = studentsForSubject(subject).filter(student => fresh.section === "all" || student.section === fresh.section);
    const entries = {};
    students.forEach(student => { entries[student.id] = fresh.checkins[student.id] ? "P" : "A"; });
    const log = readStore(KEYS.attendanceLog, []);
    log.push({ id: makeId("roll"), subject, date: fresh.date, period: fresh.period, component: fresh.component, facultyId: session.id, facultyName: session.name, entries, savedAt: new Date().toISOString(), source: "checkin" });
    writeStore(KEYS.attendanceLog, log);
    migrateStudentData();
    const freshStudents = getStudents();
    const absentStudents = students.filter(student => !fresh.checkins[student.id]);
    absentStudents.forEach(student => {
      const freshStudent = freshStudents.find(item => item.id === student.id);
      if (freshStudent) sendAbsenceAlerts(freshStudent, subject, fresh.date, fresh.period, session.name, subjectConfigFor(subject)[fresh.component]);
    });
    const stored = sessions.find(item => item.id === fresh.id);
    if (stored) { stored.open = false; stored.closedManually = !auto; }
    writeStore(KEYS.checkinSessions, sessions);
    logActivity(`Closed code check-in for ${subjectConfigFor(subject)?.shortName || subject} (${absentStudents.length} absent)`, session.name);
  };

  const renderCheckin = () => {
    const panel = document.getElementById("checkinPanel");
    if (!panel) return;
    const active = myOpenCheckinSession();
    if (active) {
      const checkedIn = Object.keys(active.checkins).length;
      const total = studentsForSubject(active.subject).filter(student => active.section === "all" || student.section === active.section).length;
      const remaining = Math.max(0, Math.round((active.expiresAt - Date.now()) / 1000));
      panel.innerHTML = `<div class="big-code-box"><small>${esc(subjectConfigFor(active.subject).shortName)} \u00b7 ${esc(subjectConfigFor(active.subject)[active.component])} \u00b7 closes in ${remaining}s</small><strong>${esc(active.code)}</strong><small>${checkedIn} of ${total} students checked in</small></div><div class="checkin-list">${Object.keys(active.checkins).map(id => { const student = getStudents().find(item => item.id === id); return student ? `<span class="checkin-chip">${esc(student.name)}</span>` : ""; }).join("") || "<span class=\"muted\">No check-ins yet.</span>"}</div><button type="button" class="btn danger" id="closeCheckinBtn">Close session now &amp; mark absentees</button>`;
      document.getElementById("closeCheckinBtn").onclick = () => { closeCheckinSession(active); renderCheckin(); renderSmsLogPlus(); enhancePendingTasks(); };
      clearInterval(checkinTimer);
      checkinTimer = setInterval(() => {
        if (Date.now() >= active.expiresAt) { closeCheckinSession(active, true); renderCheckin(); renderSmsLogPlus(); enhancePendingTasks(); clearInterval(checkinTimer); }
        else renderCheckin();
      }, 3000);
      return;
    }
    clearInterval(checkinTimer);
    const subjects = assignedSubjects();
    const sections = [...new Set(subjects.flatMap(subject => studentsForSubject(subject).map(student => student.section)))].sort();
    panel.innerHTML = `<div class="roll-controls"><label>Subject<select id="checkinSubject">${subjects.map(subject => `<option value="${esc(subject)}">${esc(subjectConfigFor(subject).shortName)}</option>`).join("")}</select></label><label>Class type<select id="checkinComponent"></select></label><label>Section<select id="checkinSection"><option value="all">All sections</option>${sections.map(section => `<option>${esc(section)}</option>`).join("")}</select></label><label>Period<select id="checkinPeriod">${PERIOD_TIMES.map((time, i) => `<option value="${i + 1}" ${i + 1 === currentDayAndPeriod().period ? "selected" : ""}>Period ${i + 1} (${time})</option>`).join("")}</select></label><label>Duration<select id="checkinDuration"><option value="60">1 minute</option><option value="120" selected>2 minutes</option><option value="300">5 minutes</option></select></label></div><button type="button" class="btn primary" id="startCheckinBtn">Start check-in session</button>`;
    const subjectSelect = document.getElementById("checkinSubject");
    const updateComponents = () => {
      const config = subjectConfigFor(subjectSelect.value);
      document.getElementById("checkinComponent").innerHTML = config ? ["primary", "secondary"].map(part => `<option value="${part}">${esc(config[part])}</option>`).join("") : "";
    };
    subjectSelect.addEventListener("change", updateComponents);
    updateComponents();
    document.getElementById("startCheckinBtn").addEventListener("click", () => {
      const subject = subjectSelect.value;
      const component = document.getElementById("checkinComponent").value;
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const duration = Number(document.getElementById("checkinDuration").value);
      const sessions = readStore(KEYS.checkinSessions, []);
      sessions.push({ id: makeId("checkin"), facultyId: session.id, subject, component, section: document.getElementById("checkinSection").value, date: todayIso(), period: Number(document.getElementById("checkinPeriod").value), code, open: true, startedAt: Date.now(), expiresAt: Date.now() + duration * 1000, checkins: {} });
      writeStore(KEYS.checkinSessions, sessions);
      renderCheckin();
      enhancePendingTasks();
    });
  };

  /* ============================== Weekly digest ============================== */

  const sendWeeklyDigest = () => {
    const subjects = assignedSubjects();
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const sinceIso = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, "0")}-${String(since.getDate()).padStart(2, "0")}`;
    const perStudent = new Map();
    readStore(KEYS.attendanceLog, []).filter(record => subjects.includes(record.subject) && record.date >= sinceIso).forEach(record => {
      Object.entries(record.entries).forEach(([studentId, status]) => {
        if (status !== "A") return;
        if (!perStudent.has(studentId)) perStudent.set(studentId, []);
        perStudent.get(studentId).push({ subject: record.subject, date: record.date, period: record.period });
      });
    });
    if (!perStudent.size) return 0;
    const students = getStudents();
    const outbox = readStore(KEYS.smsOutbox, []);
    perStudent.forEach((absences, studentId) => {
      const student = students.find(item => item.id === studentId);
      if (!student) return;
      const summary = absences.map(item => `${subjectConfigFor(item.subject)?.code || item.subject} on ${item.date}`).join("; ");
      const text = `KL University weekly digest: ${student.name} (${student.universityId}) was absent ${absences.length} time(s) this week \u2014 ${summary}. - ${session.name}`;
      const sentAt = new Date().toISOString();
      [["Parent", student.parentName, student.parentContact], ["Student", student.name, student.phone]].forEach(([recipientType, recipientName, to]) => {
        outbox.unshift({ id: makeId("sms"), studentId: student.id, recipientType, recipientName, to: to || "", message: text, sentAt, subject: "Weekly digest", date: todayIso(), status: to ? "Delivered (simulated)" : "Failed - no number on record", tag: "weekly_digest" });
      });
    });
    writeStore(KEYS.smsOutbox, outbox.slice(0, 300));
    return perStudent.size;
  };

  const renderSmsLogPlus = () => {
    const subjects = assignedSubjects();
    const messages = readStore(KEYS.smsOutbox, []).filter(item => subjects.includes(item.subject) || item.subject === "Weekly digest").slice(0, 12);
    const body = document.getElementById("smsLogBody");
    if (!body) return;
    body.innerHTML = messages.length ? messages.map(item => `<tr><td>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.sentAt))}</td><td><strong>${esc(item.recipientType)}</strong><small>${esc(item.recipientName)}</small></td><td>${esc(item.to || "\u2014")}</td><td><small>${esc(item.message)}</small></td><td><span class="status-pill ${item.to ? "good" : "bad"}">${esc(item.status)}</span></td></tr>`).join("") : `<tr><td colspan="5" class="empty-state">No absence messages have been sent yet.</td></tr>`;
  };

  /* ============================== Internal (faculty-only) notes ============================== */

  const renderInternalNotes = () => {
    const subject = document.getElementById("remarksSubject")?.value;
    const list = document.getElementById("internalNotesList");
    if (!list || !subject) return;
    list.innerHTML = studentsForSubject(subject).map(student => `<label class="internal-note-entry"><span><strong>${esc(student.name)}</strong><small>${esc(student.universityId)}</small></span><textarea rows="2" maxlength="300" data-note-student="${student.id}" placeholder="Private note for other faculty teaching this student">${esc(student.facultyInternalNotes?.[subject] || "")}</textarea></label>`).join("") || `<div class="empty-state">No students enrolled.</div>`;
  };

  const setupInternalNotes = () => {
    document.getElementById("remarksSubject")?.addEventListener("change", renderInternalNotes);
    document.getElementById("internalNotesForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const subject = document.getElementById("remarksSubject").value;
      if (!assignedSubjects().includes(subject)) return;
      const students = getStudents();
      document.querySelectorAll("[data-note-student]").forEach(textarea => {
        const student = students.find(item => item.id === textarea.dataset.noteStudent);
        if (!student) return;
        student.facultyInternalNotes ||= {};
        student.facultyInternalNotes[subject] = textarea.value.trim();
      });
      writeStore(KEYS.students, students);
      logActivity(`Updated internal notes for ${subjectConfigFor(subject)?.shortName || subject}`, session.name);
      const message = document.getElementById("internalNotesMessage");
      message.textContent = "Internal notes saved.";
      message.classList.add("success");
    });
  };

  /* ============================== Benchmark comparison + Class PDF ============================== */

  const historicalAverage = code => {
    let hash = 0;
    for (const char of `benchmark|${code}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return 55 + (hash % 1000) / 1000 * 30;
  };

  const renderComparison = () => {
    const container = document.getElementById("semesterComparison");
    const subject = document.getElementById("reportSubject")?.value;
    if (!container || !assignedSubjects().includes(subject)) return;
    const students = studentsForSubject(subject);
    const average = students.reduce((sum, student) => sum + finalScoreFor(student.grades?.[subject] || {}), 0) / (students.length || 1);
    const benchmark = historicalAverage(subjectConfigFor(subject).code);
    const diff = average - benchmark;
    container.innerHTML = `<div class="metric-row"><span>This offering</span><div class="metric-track"><div class="metric-fill good" style="width:${Math.max(2, average)}%"></div></div><small>${average.toFixed(1)}%</small></div><div class="metric-row"><span>Reference benchmark</span><div class="metric-track"><div class="metric-fill" style="width:${Math.max(2, benchmark)}%"></div></div><small>${benchmark.toFixed(1)}%</small></div><p class="muted" style="margin-top:10px">${diff >= 0 ? `This offering is running ${diff.toFixed(1)} points above the benchmark.` : `This offering is running ${Math.abs(diff).toFixed(1)} points below the benchmark.`}</p>`;
  };

  const downloadClassPdf = () => {
    const subject = document.getElementById("reportSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const students = studentsForSubject(subject);
    const scores = students.map(student => finalScoreFor(student.grades?.[subject] || {}));
    const average = scores.reduce((sum, value) => sum + value, 0) / (scores.length || 1);
    const passCount = scores.filter(score => score >= getGrading().d).length;
    const distribution = ["A+", "A", "B", "C", "D", "F"].map(grade => [grade, scores.filter(score => gradeFor(score) === grade).length]);
    const atRiskCount = students.filter(student => atRiskReasons(student, subject).length).length;
    const lines = [
      { text: readStore(KEYS.settings, {}).schoolName || "KL University", size: 18 },
      { text: "Class Performance Report", size: 12 },
      { text: `${subjectConfigFor(subject).code} ${subjectConfigFor(subject).name}`, size: 11 },
      { text: `Faculty: ${session.name}`, size: 10 },
      { text: "", size: 10 },
      { text: `Students: ${students.length}    Average: ${average.toFixed(1)}%    Pass rate: ${(passCount / (students.length || 1) * 100).toFixed(1)}%`, size: 10 },
      { text: `At-risk students: ${atRiskCount}`, size: 10 },
      { text: "", size: 10 },
      { text: "Grade distribution", size: 11 },
      ...distribution.map(([grade, count]) => ({ text: `  ${grade}: ${count}`, size: 10 })),
      { text: "", size: 10 },
      { text: `Generated: ${new Intl.DateTimeFormat("en-IN").format(new Date())}`, size: 9 }
    ];
    downloadFile(buildSimplePdf(lines), `${subjectConfigFor(subject).code}-class-performance.pdf`, "application/pdf");
  };

  /* ============================== Rubric-based assignment grading ============================== */

  const defaultRubric = maxMarks => [
    { label: "Correctness", max: Math.round(maxMarks * 0.5) },
    { label: "Quality / presentation", max: Math.round(maxMarks * 0.3) },
    { label: "Timeliness", max: maxMarks - Math.round(maxMarks * 0.5) - Math.round(maxMarks * 0.3) }
  ];

  const renderGradingPanel = () => {
    const select = document.getElementById("gradingAssignmentSelect");
    const panel = document.getElementById("gradingPanel");
    if (!select || !panel) return;
    const subjects = assignedSubjects();
    const assignments = getAcademicRecords("assignments").filter(item => subjects.includes(item.subject));
    const keep = assignments.some(item => item.id === select.value) ? select.value : assignments[0]?.id;
    select.innerHTML = assignments.map(item => `<option value="${esc(item.id)}" ${item.id === keep ? "selected" : ""}>${esc(subjectConfigFor(item.subject)?.shortName || item.subject)} \u2014 ${esc(item.title)}</option>`).join("");
    const assignment = assignments.find(item => item.id === keep);
    if (!assignment) { panel.innerHTML = `<div class="empty-state">No assignments to grade yet.</div>`; return; }
    const rubric = assignment.rubric || defaultRubric(assignment.maxMarks);
    const students = studentsForSubject(assignment.subject).filter(student => student.assignmentSubmissions?.[assignment.id]);
    if (!students.length) { panel.innerHTML = `<div class="empty-state">No students have submitted this assignment yet.</div>`; return; }
    panel.innerHTML = students.map(student => {
      const submission = student.assignmentSubmissions[assignment.id];
      const saved = submission.criteria || {};
      return `<div class="queue-item" data-grading-student="${student.id}">
        <div><strong>${esc(student.name)}</strong> <span class="status-pill ${submission.marks === undefined ? "warn" : "good"}">${submission.marks === undefined ? "Ungraded" : `${submission.marks} / ${assignment.maxMarks}`}</span></div>
        <div class="rubric-grid">${rubric.map((criterion, index) => `<div class="rubric-row"><span>${esc(criterion.label)} (max ${criterion.max})</span><input type="number" min="0" max="${criterion.max}" value="${Number(saved[index]) || 0}" data-criterion="${index}"></div>`).join("")}</div>
        <div class="queue-actions"><span class="rubric-total">Total: <span data-total-display>${Object.values(saved).reduce((sum, value) => sum + (Number(value) || 0), 0)}</span> / ${assignment.maxMarks}</span><button type="button" class="btn primary small" data-save-grade="${assignment.id}|${student.id}">Save grade</button></div>
      </div>`;
    }).join("");
  };

  const setupGrading = () => {
    document.getElementById("gradingAssignmentSelect")?.addEventListener("change", renderGradingPanel);
    const panel = document.getElementById("gradingPanel");
    panel?.addEventListener("input", event => {
      if (!event.target.matches("[data-criterion]")) return;
      const row = event.target.closest("[data-grading-student]");
      const total = [...row.querySelectorAll("[data-criterion]")].reduce((sum, input) => sum + (Number(input.value) || 0), 0);
      row.querySelector("[data-total-display]").textContent = total;
    });
    panel?.addEventListener("click", event => {
      const key = event.target.dataset.saveGrade;
      if (!key) return;
      const [assignmentId, studentId] = key.split("|");
      const assignment = getAcademicRecords("assignments").find(item => item.id === assignmentId);
      if (!assignment || !assignedSubjects().includes(assignment.subject)) return;
      const row = event.target.closest("[data-grading-student]");
      const criteria = {};
      let total = 0;
      [...row.querySelectorAll("[data-criterion]")].forEach(input => { const value = Math.max(0, Math.min(Number(input.max), Number(input.value) || 0)); criteria[input.dataset.criterion] = value; total += value; });
      const students = getStudents();
      const student = students.find(item => item.id === studentId);
      if (!student?.assignmentSubmissions?.[assignmentId]) return;
      student.assignmentSubmissions[assignmentId] = { ...student.assignmentSubmissions[assignmentId], marks: total, criteria, status: "Graded", gradedAt: new Date().toISOString() };
      writeStore(KEYS.students, students);
      logActivity(`Graded ${student.name} on ${assignment.title}`, session.name);
      renderGradingPanel();
    });
  };

  /* ============================== Leave & Substitution ============================== */

  const renderSubFreeList = () => {
    const container = document.getElementById("subFreeList");
    const date = document.getElementById("subDate")?.value;
    const period = Number(document.getElementById("subPeriod")?.value);
    if (!container || !date || !period) return;
    const day = dayNameFromDate(date);
    const free = freeFacultyAt(day, period, session.id);
    const rooms = emptyRoomsFor(day, period);
    container.innerHTML = `<p class="muted">${esc(day)}, period ${period}</p><div class="checkin-list">${free.length ? free.map(user => `<span class="checkin-chip">${esc(user.name)}</span>`).join("") : `<span class="muted">No free faculty found.</span>`}</div><p class="muted" style="margin-top:10px">${rooms.length} free room${rooms.length === 1 ? "" : "s"}: ${rooms.slice(0, 6).map(room => esc(room.id)).join(", ") || "none"}</p>`;
  };

  const renderSubQueue = () => {
    const container = document.getElementById("subQueue");
    if (!container) return;
    const requests = readStore(KEYS.substitutionRequests, []).filter(item => item.facultyId === session.id || item.substituteFacultyId === session.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = requests.length ? requests.map(request => {
      const mine = request.facultyId === session.id;
      const substitute = request.substituteFacultyId ? readStore(KEYS.users, []).find(user => user.id === request.substituteFacultyId) : null;
      return `<div class="queue-item"><div>${mine ? "You" : `${esc(readStore(KEYS.users, []).find(user => user.id === request.facultyId)?.name || "A colleague")} (you are the substitute)`} requested leave for <strong>${esc(subjectConfigFor(request.subject)?.shortName || request.subject)}</strong></div><div class="queue-meta"><span>${esc(formatAcademicDate(request.date))}, period ${request.period}</span><span class="status-pill ${request.status === "Approved" ? "good" : request.status === "Rejected" ? "bad" : "warn"}">${esc(request.status)}</span>${substitute ? `<span>Substitute: ${esc(substitute.name)}</span>` : ""}</div></div>`;
    }).join("") : `<div class="empty-state">No leave requests yet.</div>`;
  };

  const setupSubstitution = () => {
    const form = document.getElementById("substitutionForm");
    if (!form) return;
    fillSelect(document.getElementById("subSubject"), assignedSubjects());
    document.getElementById("subPeriod").innerHTML = PERIOD_TIMES.map((time, index) => `<option value="${index + 1}">Period ${index + 1} (${time})</option>`).join("");
    document.getElementById("subDate").min = todayIso();
    document.getElementById("subDate").value = todayIso();
    ["subDate", "subPeriod"].forEach(id => document.getElementById(id).addEventListener("change", renderSubFreeList));
    renderSubFreeList();
    form.addEventListener("submit", event => {
      event.preventDefault();
      const subject = document.getElementById("subSubject").value;
      if (!assignedSubjects().includes(subject)) return;
      const requests = readStore(KEYS.substitutionRequests, []);
      requests.push({ id: makeId("sub"), facultyId: session.id, facultyName: session.name, subject, date: document.getElementById("subDate").value, period: Number(document.getElementById("subPeriod").value), reason: document.getElementById("subReason").value.trim(), status: "Pending", createdAt: new Date().toISOString() });
      writeStore(KEYS.substitutionRequests, requests);
      logActivity(`Requested a substitute for ${subjectConfigFor(subject)?.shortName || subject}`, session.name);
      form.reset();
      document.getElementById("subDate").value = todayIso();
      const message = document.getElementById("subMessage");
      message.textContent = "Request sent to the administrator.";
      message.classList.add("success");
      renderSubQueue();
      enhancePendingTasks();
    });
  };

  /* ============================== Re-evaluation requests ============================== */

  const renderReevalQueue = () => {
    const container = document.getElementById("reevalQueue");
    if (!container) return;
    const subjects = assignedSubjects();
    const requests = readStore(KEYS.reevalRequests, []).filter(item => subjects.includes(item.subject)).sort((a, b) => (a.status === "Pending" ? -1 : 1) - (b.status === "Pending" ? -1 : 1) || b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = requests.length ? requests.map(request => `<div class="queue-item">
      <div><strong>${esc(request.studentName)}</strong> asked to recheck <strong>Q${esc(request.question)}</strong> in ${esc(subjectConfigFor(request.subject)?.shortName || request.subject)} (${esc(request.examLabel)})</div>
      <div class="queue-meta"><span>Current: ${request.currentMarks} / ${request.maxMarks}</span><span class="status-pill ${request.status === "Resolved" ? "good" : "warn"}">${esc(request.status)}</span></div>
      <p class="muted">${esc(request.reason || "No reason given")}</p>
      ${request.status === "Pending" ? `<div class="queue-actions"><input type="number" min="0" max="${request.maxMarks}" value="${request.currentMarks}" data-reeval-marks="${request.id}"> <input type="text" placeholder="Comment (optional)" data-reeval-comment="${request.id}" style="min-width:220px"> <button type="button" class="btn primary small" data-resolve-reeval="${request.id}">Save and resolve</button></div>` : `<p class="muted">Resolved${request.resolvedMarks !== undefined ? ` at ${request.resolvedMarks} / ${request.maxMarks}` : ""}${request.comment ? `: ${esc(request.comment)}` : ""}</p>`}
    </div>`).join("") : `<div class="empty-state">No re-evaluation requests.</div>`;
  };

  const setupReeval = () => {
    document.getElementById("reevalQueue")?.addEventListener("click", event => {
      const id = event.target.dataset.resolveReeval;
      if (!id) return;
      const requests = readStore(KEYS.reevalRequests, []);
      const request = requests.find(item => item.id === id);
      if (!request) return;
      const marks = Math.max(0, Math.min(request.maxMarks, Number(document.querySelector(`[data-reeval-marks="${id}"]`).value) || 0));
      const comment = document.querySelector(`[data-reeval-comment="${id}"]`).value.trim();
      request.status = "Resolved";
      request.resolvedMarks = marks;
      request.comment = comment;
      request.resolvedAt = new Date().toISOString();
      writeStore(KEYS.reevalRequests, requests);
      if (marks !== request.currentMarks) {
        const overrides = readStore(KEYS.qpOverrides, {});
        const key = `${request.studentId}|${request.courseCode}|${request.examKindId}`;
        overrides[key] = { ...(overrides[key] || {}), [request.question]: marks };
        writeStore(KEYS.qpOverrides, overrides);
      }
      logActivity(`Resolved a re-evaluation request from ${request.studentName}`, session.name);
      renderReevalQueue();
    });
  };

  /* ============================== Teaching feedback summary ============================== */

  const renderTeachingFeedback = () => {
    const select = document.getElementById("feedbackSubjectFilter");
    if (!select) return;
    const subjects = assignedSubjects();
    const keep = subjects.includes(select.value) || select.value === "all" ? select.value : "all";
    select.innerHTML = `<option value="all">All my subjects</option>${subjects.map(subject => `<option value="${esc(subject)}" ${subject === keep ? "selected" : ""}>${esc(subjectConfigFor(subject).shortName)}</option>`).join("")}`;
    const targetSubjects = keep === "all" ? subjects : [keep];
    const ratingSums = typeof FEEDBACK_QUESTIONS !== "undefined" ? FEEDBACK_QUESTIONS.map(() => ({ sum: 0, count: 0 })) : [];
    const comments = [];
    let responseCount = 0;
    targetSubjects.forEach(subject => {
      const course = subjectConfigFor(subject);
      studentsForSubject(subject).forEach(student => {
        ["primary", "secondary"].forEach(component => {
          const entry = student.feedbackGiven?.[`${course.code}:${component}`];
          if (!entry) return;
          responseCount++;
          entry.ratings.forEach((rating, index) => { if (ratingSums[index]) { ratingSums[index].sum += rating; ratingSums[index].count++; } });
          if (entry.comment) comments.push(entry.comment);
        });
      });
    });
    const container = document.getElementById("teachingFeedbackSummary");
    if (!responseCount) { container.innerHTML = `<div class="empty-state">No feedback has been submitted yet for this filter.</div>`; return; }
    const words = {};
    comments.join(" ").toLowerCase().split(/[^a-z']+/).filter(word => word.length > 4).forEach(word => { words[word] = (words[word] || 0) + 1; });
    const topWords = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 6).filter(([, count]) => count > 1);
    container.innerHTML = `<p class="muted" style="margin-bottom:14px">${responseCount} response${responseCount === 1 ? "" : "s"} received.</p>` +
      (typeof FEEDBACK_QUESTIONS !== "undefined" ? FEEDBACK_QUESTIONS.map((question, index) => { const row = ratingSums[index]; const average = row.count ? row.sum / row.count : 0; return `<div class="metric-row"><span>${esc(question)}</span><div class="metric-track"><div class="metric-fill ${average >= 4 ? "good" : average >= 3 ? "warn" : "bad"}" style="width:${Math.max(2, average / 5 * 100)}%"></div></div><small>${average.toFixed(1)} / 5</small></div>`; }).join("") : "") +
      (topWords.length ? `<div class="flag-card info" style="margin-top:16px"><div><strong>Common themes in comments</strong><p>${topWords.map(([word, count]) => `${esc(word)} (${count})`).join(", ")}</p></div></div>` : "") +
      (comments.length ? `<div class="data-block"><h3 style="margin-bottom:10px">Comments</h3>${comments.slice(0, 20).map(comment => `<p class="muted" style="margin-bottom:8px">\u201c${esc(comment)}\u201d</p>`).join("")}</div>` : "");
  };

  /* ============================== Smarter "today at a glance" ============================== */

  // Fully rebuilds the pending-tasks widget app.js renders once at startup, so it stays accurate
  // as new queue items (re-eval, leave, bonus, check-in) are created during the session.
  const enhancePendingTasks = () => {
    const container = document.getElementById("facultyPendingTasks");
    if (!container) return;
    const subjects = assignedSubjects();
    const semester = readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER;
    const pendingSubmissions = subjects.filter(subject => readStore(KEYS.gradeSubmissions, []).find(item => item.facultyId === session.id && item.subject === subject && item.semester === semester)?.status !== "submitted").length;
    const upcomingAssignments = getAcademicRecords("assignments").filter(item => subjects.includes(item.subject) && item.dueDate >= todayIso()).length;
    const lowAttendance = new Set(subjects.flatMap(subject => studentsForSubject(subject).filter(student => subjectAttendanceFor(student, subject) < 75).map(student => student.id))).size;
    const pendingReeval = readStore(KEYS.reevalRequests, []).filter(item => subjects.includes(item.subject) && item.status === "Pending").length;
    const pendingSub = readStore(KEYS.substitutionRequests, []).filter(item => item.facultyId === session.id && item.status === "Pending").length;
    const pendingBonus = readStore(KEYS.bonusRequests, []).filter(item => item.facultyId === session.id && item.status === "Pending").length;
    const items = [[pendingSubmissions, "gradebooks awaiting submission"], [upcomingAssignments, "upcoming assignment deadlines"], [lowAttendance, "students below 75% attendance"], [pendingReeval, "re-evaluation requests awaiting a decision"], [pendingSub, "leave requests awaiting admin approval"], [pendingBonus, "bonus-mark requests awaiting admin approval"]];
    if (myOpenCheckinSession()) items.push([1, "code check-in session is currently open"]);
    container.innerHTML = items.filter(([count]) => count).map(([count, label]) => `<div class="action-item"><strong>${count}</strong><span>${esc(label)}</span></div>`).join("") || `<div class="empty-state">Nothing pending. You're all caught up.</div>`;
  };

  /* ============================== Wire everything up ============================== */

  const renderAll = () => {
    renderAtRisk();
    renderMentees();
    renderWeakTopics();
    renderCoAttainment();
    renderCoverage();
    renderCheckin();
    renderGradingPanel();
    renderSubQueue();
    renderBonusQueue();
    renderReevalQueue();
    renderTeachingFeedback();
    renderComparison();
    renderInternalNotes();
    enhancePendingTasks();
  };

  document.getElementById("atRiskSubject")?.addEventListener("change", renderAtRisk);
  document.getElementById("weakTopicSubject")?.addEventListener("change", renderWeakTopics);
  document.getElementById("weakTopicExam")?.addEventListener("change", renderWeakTopics);
  document.getElementById("coSubject")?.addEventListener("change", renderCoAttainment);
  document.getElementById("coverageSubject")?.addEventListener("change", renderCoverage);
  document.getElementById("feedbackSubjectFilter")?.addEventListener("change", renderTeachingFeedback);
  document.getElementById("reportSubject")?.addEventListener("change", renderComparison);
  document.getElementById("downloadClassPdfBtn")?.addEventListener("click", downloadClassPdf);
  document.getElementById("sendDigestBtn")?.addEventListener("click", () => {
    const count = sendWeeklyDigest();
    const message = document.getElementById("digestMessage");
    message.textContent = count ? `Digest sent to ${count} student${count === 1 ? "" : "s"}.` : "No absences in the last 7 days for your subjects.";
    message.classList.toggle("success", Boolean(count));
    renderSmsLogPlus();
  });

  setupCsvImport();
  setupInternalNotes();
  setupGrading();
  setupSubstitution();
  setupReeval();
  setupMentees();
  setupCoverage();
  setupBonus();
  setupCoPoMatrix();
  renderAll();
})();
