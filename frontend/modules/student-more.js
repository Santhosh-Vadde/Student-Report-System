// Student portal: examinations, planning, campus pages and start-up.

/* ---------- Internals ---------- */

Portal.internalsTable = (term, rows) => `<table class="tbl"><thead><tr><th>Course</th><th>Home assignment</th><th>ALM</th><th>Tutorial or quiz</th><th>Lab internal</th><th>Lab external</th><th class="r">Internals total</th><th class="r">Weightage earned</th></tr></thead><tbody>
  ${rows.map(({ course, data }) => `<tr><td><strong>${esc(course.code)}</strong><small>${esc(course.shortName)}</small></td>
    ${data.rows.map(row => `<td>${row.marks} / ${row.max}<small>${row.earned.toFixed(1)} of ${row.weight}%${row.key === "lab" && !courseHasLab(course) ? " (continuous evaluation)" : ""}</small></td>`).join("")}
    <td>${data.external ? `${data.external.marks} / ${data.external.max}<small>Counted in semester end</small>` : "\u2014"}</td>
    <td class="r"><strong>${data.total.toFixed(1)} / ${data.weight}</strong></td><td class="r">${pill(pct(data.percent), data.percent >= 75 ? "ok" : data.percent >= 60 ? "warn" : "bad")}</td></tr>`).join("")}
  </tbody></table>`;

Portal.termSection("myInternals", {
  title: "Internals",
  subtitle: "Home assignment, ALM, tutorial and lab marks for every course, and the weightage you earned.",
  actions: () => `<button class="btn" type="button" data-act="printInternals">Print</button>`,
  body: (term, el) => {
    const rows = termCourses(Portal.student, term).map(course => ({ course, data: internalsFor(Portal.student, term, course) }));
    const average = rows.reduce((sum, row) => sum + row.data.percent, 0) / rows.length;
    el.innerHTML = `<div class="chips"><div class="chip key">Average internals weightage<strong>${average.toFixed(1)}%</strong></div><div class="chip">Each component carries<strong>10% of the course</strong></div><div class="chip">Internals total<strong>40%</strong></div></div>
      <div class="panel"><div class="tw">${Portal.internalsTable(term, rows)}</div><p class="note">Mid exam 1 and 2 carry 15% each and the semester end exam 30%. Their marks are on the Answer scripts page. Lab external marks are part of the semester end practical, so they are not in the 40% above.</p></div>`;
  }
});
Portal.actions.printInternals = () => {
  const pick = Portal.termPick.myInternals || currentAcademicTerm();
  const term = Portal.terms().find(item => item.academicYear === pick.academicYear && item.semester === pick.semester) || Portal.currentTerm();
  const rows = termCourses(Portal.student, term).map(course => ({ course, data: internalsFor(Portal.student, term, course) }));
  Portal.printDocument(Portal.sheet({ title: "Internal marks statement", meta: Portal.studentMeta(term), body: Portal.internalsTable(term, rows), signatures: ["Class advisor", "Head of department"] }));
};

/* ---------- Answer scripts ---------- */

Portal.ui.scriptExam = "mid1";
Portal.examKind = id => EXAM_KINDS.find(kind => kind.id === id) || EXAM_KINDS[0];
Portal.examWeight = kind => (kind.id === "end" ? 30 : 15);

Portal.termSection("answerScripts", {
  title: "Answer scripts",
  subtitle: "Marks and evaluated booklets for each exam, course by course.",
  body: (term, el) => {
    const kind = Portal.examKind(Portal.ui.scriptExam);
    const rows = termCourses(Portal.student, term).map(course => ({ course, marks: examMarks(Portal.student, term, course, kind) }));
    const earned = rows.reduce((sum, row) => sum + row.marks.percent / 100 * Portal.examWeight(kind), 0);
    el.innerHTML = `<div class="filters"><div class="seg" role="group" aria-label="Exam">${EXAM_KINDS.map(item => `<button type="button" class="${item.id === kind.id ? "on" : ""}" data-act="scriptExam" data-arg="${item.id}">${item.label}</button>`).join("")}</div></div>
      <div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Course</th><th class="r">Maximum</th><th class="r">Marks</th><th class="r">Percentage</th><th class="r">Weightage earned</th><th>Evaluation</th><th></th></tr></thead><tbody>
      ${rows.map(({ course, marks }) => `<tr><td><strong>${esc(course.code)}</strong><small>${esc(course.name)}</small></td><td class="r">${kind.max}</td><td class="r"><strong>${marks.scored}</strong></td><td class="r">${pill(pct(marks.percent), marks.percent >= 75 ? "ok" : marks.percent >= 50 ? "warn" : "bad")}</td><td class="r">${(marks.percent / 100 * Portal.examWeight(kind)).toFixed(1)} of ${Portal.examWeight(kind)}</td><td>${pill("Evaluated", "info")}${marks.hasAdjustment ? ` ${pill("Adjusted", "ok")}` : ""}</td><td class="actions"><button class="btn sm" type="button" data-act="booklet" data-arg="${course.code}|${kind.id}|${term.key}">View booklet</button><button class="btn sm" type="button" data-act="questionMarks" data-arg="${course.code}|${kind.id}|${term.key}">Question-wise marks</button></td></tr>`).join("")}
      </tbody><tfoot><tr><td>Weightage earned in ${esc(kind.label.toLowerCase())}</td><td></td><td></td><td></td><td class="r">${earned.toFixed(1)} of ${Portal.examWeight(kind) * rows.length}</td><td></td><td></td></tr></tfoot></table></div></div>`;
  }
});
Portal.actions.scriptExam = el => { Portal.ui.scriptExam = el.dataset.arg; Portal.render("answerScripts"); };

Portal.scriptContext = arg => {
  const [code, kindId, key] = arg.split("|");
  const term = Portal.terms().find(item => item.key === key);
  const course = termCourses(Portal.student, term).find(item => item.code === code);
  const kind = Portal.examKind(kindId);
  return { term, course, kind, marks: examMarks(Portal.student, term, course, kind) };
};

Portal.bookletHtml = ({ term, course, kind, marks }) => {
  const s = Portal.student;
  const samples = SAMPLE_ANSWERS[course.code] || [1, 2, 3].map(n => [`Explain core concept ${n} from ${course.shortName}.`, "The concept is defined first, then explained with a short worked example, and the final result is stated with its unit."]);
  const byQuestion = Object.fromEntries(marks.questions.map(item => [item.question, item]));
  const labels = ["2A", "2B", "3A"].filter(label => byQuestion[label]);
  const booklet = `AB-${String(seededRandom(`${s.id}|${course.code}|${kind.id}`)()).slice(2, 8)}`;
  const faculty = Portal.facultyFor(course.name)?.name || "Course faculty";
  const answerPage = (label, [question, answer]) => `<div class="bk-q"><span class="bk-mark">${byQuestion[label].marks}/${byQuestion[label].max}</span><p class="q">Q${esc(label)}. ${esc(question)}</p><p class="a">${esc(answer)}</p></div>`;
  return `<div class="booklet">
    <div class="bk-page bk-cover"><h4>K L Deemed to be University &middot; Answer booklet</h4>
      <dl><dt>Course</dt><dd>${esc(course.code)} ${esc(course.name)}</dd><dt>Examination</dt><dd>${esc(kind.label)}, ${esc(term.semester)} ${esc(term.academicYear)}</dd><dt>Student</dt><dd>${esc(s.name)}</dd><dt>University ID</dt><dd>${esc(s.universityId)}</dd><dt>Booklet number</dt><dd>${esc(booklet)}</dd><dt>Evaluated by</dt><dd>${esc(faculty)}</dd><dt>Total marks</dt><dd>${marks.scored} / ${kind.max}</dd></dl>
      <div class="tw"><table class="tbl tight"><thead><tr>${marks.questions.map(item => `<th class="c">${esc(item.question)}</th>`).join("")}<th class="c">Total</th></tr></thead><tbody><tr>${marks.questions.map(item => `<td class="c">${item.marks}</td>`).join("")}<td class="c"><strong>${marks.scored}</strong></td></tr></tbody></table></div>
      <p style="margin-top:14px"><span class="bk-stamp">Evaluated</span></p></div>
    <div class="bk-page">${samples.slice(0, 2).map((sample, index) => labels[index] ? answerPage(labels[index], sample) : "").join("")}</div>
    <div class="bk-page">${labels[2] ? answerPage(labels[2], samples[2]) : ""}<p class="bk-total">Total: ${marks.scored} / ${kind.max}</p></div></div>
    <p class="note">This is a sample scanned booklet for demonstration. Question-wise marks match the table above.</p>`;
};
Portal.actions.booklet = el => {
  const context = Portal.scriptContext(el.dataset.arg);
  Portal.openModal(`${context.course.code} ${context.kind.label}: answer booklet`, Portal.bookletHtml(context));
};

Portal.questionMarksHtml = ({ term, course, kind, marks }) => `<div class="tw"><table class="tbl tight"><thead><tr><th></th>${marks.questions.map(item => `<th class="c">${esc(item.question)}${item.adjusted ? " *" : ""}</th>`).join("")}</tr></thead><tbody>
  <tr><td>Maximum</td>${marks.questions.map(item => `<td class="c">${item.max}</td>`).join("")}</tr><tr><td><strong>Scored</strong></td>${marks.questions.map(item => `<td class="c">${item.adjusted ? `<strong style="color:var(--ok)">${item.marks}</strong>` : `<strong>${item.marks}</strong>`}</td>`).join("")}</tr></tbody></table></div>
  ${marks.hasAdjustment ? `<p class="note">* Marks adjusted by faculty after a re-evaluation request.</p>` : ""}
  <div class="facts" style="margin-top:14px"><div><small>Maximum marks</small><strong>${kind.max}</strong></div><div><small>Total marks</small><strong>${marks.scored}</strong></div><div><small>Weightage</small><strong>${Portal.examWeight(kind)}%</strong></div><div><small>Weighted marks</small><strong>${(marks.percent / 100 * Portal.examWeight(kind)).toFixed(2)}</strong></div></div>
  ${Portal.reevalFormHtml(term, course, kind, marks)}`;

Portal.reevalFormHtml = (term, course, kind, marks) => {
  if (!term.isCurrent) return "";
  const pending = readStore(KEYS.reevalRequests, []).filter(item => item.studentId === Portal.student.id && item.courseCode === course.code && item.examKindId === kind.id && item.status === "Pending");
  return `<div class="reeval-form">
    <h4 style="margin:0">Request a re-evaluation</h4>
    <label class="field-inline">Question<select id="reevalQuestion">${marks.questions.map(item => `<option value="${esc(item.question)}" ${pending.some(req => req.question === item.question) ? "disabled" : ""}>${esc(item.question)} (${item.marks} / ${item.max})${pending.some(req => req.question === item.question) ? " — pending" : ""}</option>`).join("")}</select></label>
    <label class="field-inline">Reason<textarea id="reevalReason" rows="2" maxlength="240" placeholder="Why you think this question needs a second look"></textarea></label>
    <div class="actions"><button class="btn primary" type="button" data-act="requestReeval" data-arg="${course.code}|${kind.id}|${term.key}">Submit request</button></div>
    <p class="form-line" id="reevalMessage"></p>
  </div>`;
};
Portal.actions.questionMarks = el => {
  const context = Portal.scriptContext(el.dataset.arg);
  Portal.openModal(`${context.course.code} ${context.kind.label}: question-wise marks`, Portal.questionMarksHtml(context));
};
Portal.actions.requestReeval = el => {
  const context = Portal.scriptContext(el.dataset.arg);
  const question = byId("reevalQuestion").value;
  const reason = byId("reevalReason").value.trim();
  const message = byId("reevalMessage");
  const already = readStore(KEYS.reevalRequests, []).some(item => item.studentId === Portal.student.id && item.courseCode === context.course.code && item.examKindId === context.kind.id && item.question === question && item.status === "Pending");
  if (already) { message.textContent = "A request for this question is already pending."; message.classList.remove("success"); return; }
  const current = context.marks.questions.find(item => item.question === question);
  const requests = readStore(KEYS.reevalRequests, []);
  requests.push({ id: makeId("reeval"), studentId: Portal.student.id, studentName: Portal.student.name, subject: context.course.name, courseCode: context.course.code, examKindId: context.kind.id, examLabel: context.kind.label, question, currentMarks: current.marks, maxMarks: current.max, reason, status: "Pending", createdAt: new Date().toISOString() });
  writeStore(KEYS.reevalRequests, requests);
  logActivity(`Requested re-evaluation of Q${question} in ${context.course.shortName}`, Portal.student.name);
  Portal.openModal(`${context.course.code} ${context.kind.label}: question-wise marks`, Portal.questionMarksHtml(context));
  byId("reevalMessage").textContent = "Request sent to the faculty.";
  byId("reevalMessage").classList.add("success");
};

/* ---------- Seating ---------- */

Portal.termSection("examSeating", {
  title: "Exam seating",
  subtitle: "The room and session allotted to you for each exam.",
  body: (term, el) => {
    if (!term.isCurrent) { el.innerHTML = `<div class="panel empty">Seating records are kept only for the running semester.</div>`; return; }
    const courseFor = code => SUBJECT_CONFIG.find(item => item.code === code);
    el.innerHTML = `<div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Ref</th><th>Date</th><th>Exam</th><th>Session</th><th>Course</th><th>Room</th></tr></thead><tbody>
      ${SEATING.map(item => `<tr><td>${item.id}</td><td>${esc(fmtDate(item.date))}</td><td>${esc(item.type)}</td><td>${esc(item.slot)}</td><td><strong>${esc(item.code)}</strong><small>${esc(courseFor(item.code)?.shortName || "")}</small></td><td><strong>${esc(item.room)}</strong></td></tr>`).join("")}
    </tbody></table></div></div>`;
  }
});

/* ---------- Hall ticket ---------- */

Portal.ui.ticket = { year: null, type: "Regular" };
Portal.ticketHtml = (term, withheld) => {
  const courseFor = code => SUBJECT_CONFIG.find(item => item.code === code);
  const schedule = SEATING.filter(item => item.type === "Semester end");
  const body = `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px"><div><h4>Examination schedule</h4></div><div>${Portal.barcodeSvg(Portal.student.universityId)}<small style="display:block;text-align:center">${esc(Portal.student.universityId)}</small></div></div>
    <table class="tbl"><thead><tr><th>Date</th><th>Session</th><th>Course</th><th>Room</th><th>Invigilator signature</th></tr></thead><tbody>
    ${schedule.map(item => `<tr><td>${esc(fmtDate(item.date))}</td><td>${esc(item.slot)}, ${item.slot === "Morning" ? "9:30 am to 12:30 pm" : "1:30 pm to 4:30 pm"}</td><td><strong>${esc(item.code)}</strong><br>${esc(courseFor(item.code)?.name || "")}</td><td>${esc(item.room)}</td><td></td></tr>`).join("")}</tbody></table>
    <h4>Instructions to candidates</h4><ol class="sheet-notes"><li>Carry this hall ticket and your university identity card to every examination.</li><li>You will not be admitted after the first 15 minutes of an examination.</li><li>Mobile phones, smart watches and programmable calculators are not allowed in the hall.</li><li>Fix the barcode sticker on the first page of the answer booklet.</li></ol>`;
  return Portal.sheet({ title: "Hall ticket", subtitle: `Semester end examination, ${term.semester} ${term.academicYear}`, photo: true, withheld, signatures: ["Candidate signature", "Controller of Examinations"], meta: [...Portal.studentMeta(term), ["Examination type", Portal.ui.ticket.type], ["Centre", "Vaddeswaram campus"]], body });
};

Portal.sections.hallTicketSection = () => {
  const term = Portal.currentTerm();
  const ticket = Portal.ui.ticket;
  ticket.year ||= term.yearOfStudy;
  const withheld = Portal.student.clearance?.overall === "On Hold" || Portal.student.suspended;
  let content;
  if (ticket.year !== term.yearOfStudy) content = `<div class="panel empty">Hall tickets are issued only for the running examinations of year ${term.yearOfStudy}.</div>`;
  else if (ticket.type !== "Regular") content = `<div class="panel empty">You have no supplementary examinations registered.</div>`;
  else content = `${withheld ? `<div class="banner bad"><div><strong>Hall ticket withheld</strong>${esc(Portal.student.suspended ? `Your account is suspended${Portal.student.suspensionReason ? ` (${Portal.student.suspensionReason})` : ""}. Contact the academic office.` : Portal.student.clearance?.note || "Your clearance is on hold.")} Contact the accounts or examination office.</div></div>` : `<div class="banner ok"><div><strong>Hall ticket authorised</strong>You are cleared for the semester end examinations.</div></div>`}${Portal.ticketHtml(term, withheld)}`;
  byId("hallTicketSection").innerHTML = `${Portal.head("Hall ticket", "Official admission ticket for the semester end examinations.", `<button class="btn primary" type="button" data-act="printTicket" ${withheld || ticket.year !== term.yearOfStudy || ticket.type !== "Regular" ? "disabled" : ""}>Print or save as PDF</button>`)}
    <div class="termbar"><label>Study year<select id="ticketYear">${Array.from({ length: term.yearOfStudy }, (_, i) => `<option value="${i + 1}" ${ticket.year === i + 1 ? "selected" : ""}>Year ${i + 1}</option>`).join("")}</select></label><label>Examination<select id="ticketType">${["Regular", "Supplementary"].map(type => `<option ${ticket.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label></div>${content}`;
  byId("ticketYear").addEventListener("change", event => { ticket.year = Number(event.target.value); Portal.render("hallTicketSection"); });
  byId("ticketType").addEventListener("change", event => { ticket.type = event.target.value; Portal.render("hallTicketSection"); });
};
Portal.actions.printTicket = () => Portal.printDocument(Portal.ticketHtml(Portal.currentTerm(), false));

/* ---------- End exam result and CGPA ---------- */

Portal.resultTable = result => `<table class="tbl"><thead><tr><th>#</th><th>Course</th><th class="r">Credits</th><th class="r">Score</th><th class="c">Grade</th><th class="r">Grade point</th><th class="c">Result</th></tr></thead><tbody>
  ${result.courses.map((course, index) => `<tr><td>${index + 1}</td><td><strong>${esc(course.code)}</strong><small>${esc(course.name)}</small></td><td class="r">${course.credits}</td><td class="r">${course.percent.toFixed(1)}%</td><td class="c"><strong>${course.letter}</strong></td><td class="r">${course.point}</td><td class="c">${pill(course.point ? "Pass" : "Fail", course.point ? "ok" : "bad")}</td></tr>`).join("")}</tbody></table>`;

Portal.termSection("endExamResults", {
  title: "End exam result",
  subtitle: "Grades, grade points and your SGPA for the semester.",
  actions: () => `<button class="btn primary" type="button" data-act="printResult">Print or save as PDF</button>`,
  body: (term, el) => {
    const result = termResult(Portal.student, term);
    el.innerHTML = `${term.isCurrent ? `<div class="banner info"><div><strong>Provisional result</strong>The semester end exam is still to be held, so these grades use the marks entered so far.</div></div>` : ""}
      <div class="chips"><div class="chip">Registered credits<strong>${result.credits}</strong></div><div class="chip">Earned credits<strong>${result.earned}</strong></div><div class="chip key">SGPA<strong>${result.sgpa.toFixed(2)}</strong></div></div>
      <div class="panel"><div class="tw">${Portal.resultTable(result)}</div></div>`;
  }
});
Portal.actions.printResult = () => {
  const pick = Portal.termPick.endExamResults || currentAcademicTerm();
  const term = Portal.terms().find(item => item.academicYear === pick.academicYear && item.semester === pick.semester) || Portal.currentTerm();
  const result = termResult(Portal.student, term);
  Portal.printDocument(Portal.sheet({ title: term.isCurrent ? "Provisional statement of grades" : "Statement of grades", subtitle: `${term.semester} ${term.academicYear}`, meta: [...Portal.studentMeta(term), ["Registered / earned credits", `${result.credits} / ${result.earned}`], ["SGPA", result.sgpa.toFixed(2)]], body: Portal.resultTable(result) }));
};

Portal.sections.myCgpa = () => {
  const results = cumulativeResults(Portal.student);
  const last = results[results.length - 1];
  byId("myCgpa").innerHTML = `${Portal.head("My CGPA", "Semester-wise grade points and your cumulative grade point average.", `<button class="btn primary" type="button" data-act="printCgpa">Print or save as PDF</button>`)}
    ${last ? `<div class="chips"><div class="chip key">CGPA<strong>${last.cgpa.toFixed(2)}</strong></div><div class="chip">Credits registered<strong>${last.cumulativeCredits}</strong></div><div class="chip">Semesters<strong>${results.length}</strong></div></div>
    <div class="panel"><h3>By semester</h3><div class="tw"><table class="tbl"><thead><tr><th>Academic year</th><th>Semester</th><th class="r">Credits</th><th class="r">Earned</th><th class="r">SGPA</th><th class="r">CGPA so far</th><th>Status</th></tr></thead><tbody>${results.map(result => `<tr><td>${esc(result.term.academicYear)}</td><td>Year ${result.term.yearOfStudy}, semester ${result.term.semesterNo}</td><td class="r">${result.credits}</td><td class="r">${result.earned}</td><td class="r"><strong>${result.sgpa.toFixed(2)}</strong></td><td class="r">${result.cgpa.toFixed(2)}</td><td>${pill(result.term.isCurrent ? "Provisional" : "Declared", result.term.isCurrent ? "warn" : "ok")}</td></tr>`).join("")}</tbody></table></div></div>
    ${results.slice().reverse().map(result => `<div class="panel"><h3>${esc(result.term.academicYear)}, ${esc(result.term.semester)}</h3><p class="sub">SGPA ${result.sgpa.toFixed(2)}</p><div class="tw">${Portal.resultTable(result)}</div></div>`).join("")}` : `<div class="panel empty">No results are available yet.</div>`}`;
};
Portal.actions.printCgpa = () => {
  const results = cumulativeResults(Portal.student);
  const last = results[results.length - 1];
  const body = `<table class="tbl"><thead><tr><th>Academic year</th><th>Semester</th><th class="r">Credits</th><th class="r">SGPA</th><th class="r">CGPA</th></tr></thead><tbody>${results.map(result => `<tr><td>${esc(result.term.academicYear)}</td><td>${esc(result.term.semester)} (semester ${result.term.semesterNo})</td><td class="r">${result.credits}</td><td class="r">${result.sgpa.toFixed(2)}</td><td class="r">${result.cgpa.toFixed(2)}</td></tr>`).join("")}</tbody></table>${results.map(result => `<h4>${esc(result.term.academicYear)}, ${esc(result.term.semester)}</h4>${Portal.resultTable(result)}`).join("")}`;
  Portal.printDocument(Portal.sheet({ title: "Cumulative grade point average", meta: [...Portal.studentMeta(Portal.currentTerm()).slice(0, 4), ["CGPA", last ? last.cgpa.toFixed(2) : "\u2014"], ["Credits registered", last ? String(last.cumulativeCredits) : "\u2014"]], body }));
};

/* ---------- Target SGPA ---------- */

Portal.ui.target = { sgpa: 9, code: null, semEnd: null };

Portal.chartSvg = items => {
  const width = 560, height = 250, left = 36, top = 18, plot = 160, group = (width - left - 10) / items.length, bar = Math.min(64, group * 0.55);
  const y = share => top + plot - plot * Math.max(0, Math.min(1, share));
  const grid = [0.25, 0.5, 0.75, 1].map(share => `<line x1="${left}" x2="${width - 6}" y1="${y(share)}" y2="${y(share)}" stroke="#e1e7f1"/><text x="${left - 6}" y="${y(share) + 4}" text-anchor="end">${share * 100}%</text>`).join("");
  const columns = items.map((item, index) => {
    const x = left + group * index + (group - bar) / 2;
    const marker = item.marker == null ? "" : `<line x1="${x - 6}" x2="${x + bar + 6}" y1="${y(item.marker / item.max)}" y2="${y(item.marker / item.max)}" stroke="#c0392b" stroke-width="3"/><text class="val" x="${x + bar + 8}" y="${y(item.marker / item.max) + 4}" style="fill:#c0392b;font-size:11px">${item.marker.toFixed(1)}</text>`;
    return `<rect x="${x}" y="${y(1)}" width="${bar}" height="${plot}" fill="#e8eef8" rx="3"/><rect x="${x}" y="${y(item.value / item.max)}" width="${bar}" height="${Math.max(1, plot * Math.min(1, item.value / item.max))}" fill="#1b6fb8" rx="3"/>${marker}<text class="val" x="${x + bar / 2}" y="${y(item.value / item.max) - 6}" text-anchor="middle">${item.value.toFixed(1)}</text><text x="${x + bar / 2}" y="${top + plot + 18}" text-anchor="middle">${esc(item.label)}</text><text x="${x + bar / 2}" y="${top + plot + 33}" text-anchor="middle">out of ${item.max}</text>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Weightage earned in each component against what the target needs">${grid}${columns}</svg>`;
};

Portal.sections.targetSimulator = () => {
  const term = Portal.currentTerm();
  const courses = termCourses(Portal.student, term);
  const target = Portal.ui.target;
  target.code ||= courses[0].code;
  byId("targetSimulator").innerHTML = `${Portal.head("Target SGPA", "Pick a target and a course to see what you need in the semester end exam to get there.")}
    <div class="termbar"><label>Target SGPA<input id="targetSgpa" type="number" min="5" max="10" step="0.1" value="${target.sgpa}"></label><label>Course<select id="targetCourse">${courses.map(course => `<option value="${course.code}" ${course.code === target.code ? "selected" : ""}>${esc(course.code)} ${esc(course.shortName)}</option>`).join("")}</select></label></div>
    <div class="panel" style="margin-bottom:18px"><div class="slider-row"><label for="targetSemEnd">If you score this in the semester end exam</label><input id="targetSemEnd" type="range" min="0" max="100" value="0"><strong class="num" id="targetSemEndValue">0</strong></div></div>
    <div id="targetResult"></div>`;
  const update = () => Portal.updateTarget();
  byId("targetSemEnd").addEventListener("input", event => { target.semEnd = Number(event.target.value); update(); });
  byId("targetSgpa").addEventListener("input", () => { target.sgpa = Math.max(5, Math.min(10, Number(byId("targetSgpa").value) || 9)); update(); });
  byId("targetCourse").addEventListener("change", event => { target.code = event.target.value; target.semEnd = null; update(); });
  update();
};

Portal.updateTarget = () => {
  const s = Portal.student;
  const term = Portal.currentTerm();
  const target = Portal.ui.target;
  const courses = termCourses(s, term);
  const course = courses.find(item => item.code === target.code) || courses[0];
  const results = courses.map(item => courseResult(s, term, item));
  const totalCredits = results.reduce((sum, item) => sum + item.credits, 0);
  const currentSgpa = results.reduce((sum, item) => sum + item.point * item.credits, 0) / totalCredits;
  const scores = scoresFor(s, term, course);
  const semEnd = target.semEnd ?? scores.semEnd;
  byId("targetSemEnd").value = Math.round(semEnd);
  byId("targetSemEndValue").textContent = Math.round(semEnd);
  const internalPoints = internalScoreFor(scores) * 0.4;
  const midPoints = scores.mid1 * 0.15 + scores.mid2 * 0.15;
  const base = internalPoints + midPoints;
  const projected = base + semEnd * 0.3;
  const projectedGrade = gradePointFor(projected);
  const requiredPoint = target.sgpa;
  const requiredPct = percentForPoint(requiredPoint);
  const neededSemEnd = (requiredPct - base) / 0.3;
  const passMark = getGrading().d;
  const advice = [];
  if (neededSemEnd <= 0) advice.push(`Your internals and mid exams already give ${base.toFixed(1)}%, above the ${requiredPct.toFixed(0)}% a ${target.sgpa.toFixed(1)} needs. Stay above the ${passMark}% pass mark in the semester end exam to keep it.`);
  else if (neededSemEnd > 100) advice.push(`Even 100 in the semester end exam gives ${(base + 30).toFixed(1)}%, below the ${requiredPct.toFixed(0)}% a ${target.sgpa.toFixed(1)} needs here. Lift your other courses or choose a lower target.`);
  else advice.push(`Score at least ${Math.ceil(neededSemEnd)} out of 100 in the semester end exam to reach ${requiredPct.toFixed(0)}% overall in ${course.shortName}.`);
  const tips = { assignment: "Submit every pending home assignment on time.", alm: "Complete the remaining ALM tasks.", quiz: "Practise earlier quizzes and attend tutorials.", lab: "Finish lab records and prepare for the viva." };
  internalsFor(s, term, course).rows.filter(row => row.marks / row.max < 0.7).forEach(row => advice.push(`${row.label}: you have ${row.marks} of ${row.max}. ${tips[row.key]}`));
  if (scores.mid1 < 60 || scores.mid2 < 60) advice.push("Review your mid exam answer scripts and revise the questions where marks were lost.");
  const pending = Portal.assignmentRows().filter(row => row.record.subject === course.name && row.status === "Pending").length;
  if (pending) advice.push(`${pending} assignment${pending === 1 ? " is" : "s are"} still pending in this course.`);
  const attendance = subjectAttendanceFor(s, course.name);
  if (attendance < 85) advice.push(`Attendance in this course is ${attendance.toFixed(1)}%. Keep it above 75% to stay eligible to write the exam.`);

  byId("targetResult").innerHTML = `<div class="kpis"><div><small>Your SGPA now</small><strong>${currentSgpa.toFixed(2)}</strong></div><div><small>Target SGPA</small><strong>${target.sgpa.toFixed(1)}</strong></div><div><small>${esc(course.shortName)} grade point now</small><strong>${projectedGrade.point}</strong></div><div><small>Grade point needed</small><strong>${requiredPoint.toFixed(1)}</strong></div><div><small>Score needed overall</small><strong>${requiredPct.toFixed(0)}%</strong></div></div>
    <div class="grid-2"><div class="panel"><h3>${esc(course.name)}</h3><p class="sub">Blue is what you hold. The red mark is where each component must be if you score ${requiredPct.toFixed(0)}% overall, which is what a grade point of ${requiredPoint.toFixed(1)} needs.</p>
      ${Portal.chartSvg([{ label: "Internals", max: 40, value: internalPoints, marker: requiredPct * 0.4 }, { label: "Mid exam 1", max: 15, value: scores.mid1 * 0.15, marker: requiredPct * 0.15 }, { label: "Mid exam 2", max: 15, value: scores.mid2 * 0.15, marker: requiredPct * 0.15 }, { label: "Semester end", max: 30, value: semEnd * 0.3, marker: requiredPct * 0.3 }])}
      <p>Projected score <strong>${projected.toFixed(1)}%</strong>, grade <strong>${projectedGrade.letter}</strong>.</p></div>
    <div class="panel"><h3>What to do</h3><ul class="advice">${advice.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div></div>
    <div class="panel" style="margin-top:18px"><h3>All courses</h3><div class="tw"><table class="tbl"><thead><tr><th>Course</th><th class="r">Credits</th><th class="r">Score now</th><th class="c">Grade</th><th class="r">Grade point</th></tr></thead><tbody>${results.map(item => `<tr><td><strong>${esc(item.code)}</strong><small>${esc(item.shortName)}</small></td><td class="r">${item.credits}</td><td class="r">${item.percent.toFixed(1)}%</td><td class="c">${item.letter}</td><td class="r">${item.point}</td></tr>`).join("")}</tbody></table></div></div>`;
};

/* ---------- Feedback ---------- */

Portal.sections.studentFeedback = () => {
  const items = Portal.feedbackItems();
  const pending = items.filter(item => !item.done);
  const done = items.filter(item => item.done);
  byId("studentFeedback").innerHTML = `${Portal.head("Feedback", "Rate each teacher for the running semester. It takes about a minute per form.")}
    <div class="chips"><div class="chip">Pending<strong>${pending.length}</strong></div><div class="chip">Submitted<strong>${done.length}</strong></div></div>
    <div class="panel"><h3>Pending feedback</h3><p class="sub">Forms you have not filled in yet</p>${pending.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Course</th><th>Class type</th><th>Faculty</th><th></th></tr></thead><tbody>${pending.map(item => `<tr><td><strong>${esc(item.course.code)}</strong><small>${esc(item.course.shortName)}</small></td><td>${esc(item.label)}</td><td>${esc(item.faculty)}</td><td><button class="btn primary sm" type="button" data-act="feedbackOpen" data-arg="${esc(item.id)}">Give feedback</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">You have given all your feedback. Thank you.</div>`}</div>
    ${done.length ? `<div class="panel"><h3>Submitted</h3><div class="tw"><table class="tbl"><thead><tr><th>Course</th><th>Class type</th><th>Faculty</th><th>Submitted</th><th class="r">Average rating</th></tr></thead><tbody>${done.map(item => `<tr><td><strong>${esc(item.course.code)}</strong><small>${esc(item.course.shortName)}</small></td><td>${esc(item.label)}</td><td>${esc(item.faculty)}</td><td>${esc(fmtDate(item.done.at.slice(0, 10)))}</td><td class="r">${(item.done.ratings.reduce((sum, value) => sum + value, 0) / item.done.ratings.length).toFixed(1)} / 5</td></tr>`).join("")}</tbody></table></div></div>` : ""}`;
};
Portal.actions.feedbackOpen = el => {
  const item = Portal.feedbackItems().find(entry => entry.id === el.dataset.arg);
  Portal.openModal(`Feedback: ${item.course.code} ${item.label}`, `<p class="muted" style="margin-bottom:14px">${esc(item.course.name)}, taught by ${esc(item.faculty)}. 1 is poor and 5 is excellent.</p>
    ${FEEDBACK_QUESTIONS.map((question, index) => `<fieldset class="rating" style="border:0;padding:0"><legend>${esc(question)}</legend><div class="rating-opts">${[1, 2, 3, 4, 5].map(value => `<label><input type="radio" name="q${index}" value="${value}">${value}</label>`).join("")}</div></fieldset>`).join("")}
    <label class="field-inline">Comments (optional)<textarea id="feedbackComment" rows="3" maxlength="300"></textarea></label>
    <div class="actions" style="margin-top:14px"><button class="btn primary" type="button" data-act="feedbackSubmit" data-arg="${esc(item.id)}">Submit feedback</button></div><p class="form-line" id="feedbackMessage"></p>`);
};
Portal.actions.feedbackSubmit = el => {
  const ratings = FEEDBACK_QUESTIONS.map((_, index) => Number(document.querySelector(`#portalModalBody input[name="q${index}"]:checked`)?.value || 0));
  if (ratings.includes(0)) { byId("feedbackMessage").textContent = "Rate every question before submitting."; return; }
  const comment = byId("feedbackComment").value.trim();
  Portal.update(record => { record.feedbackGiven = { ...record.feedbackGiven, [el.dataset.arg]: { ratings, comment, at: new Date().toISOString() } }; });
  byId("portalModal").close();
  Portal.render("studentFeedback");
  Portal.render("studentOverview");
  Portal.updateBadges();
};

/* ---------- Library ---------- */

Portal.ui.library = { query: "", available: false };
Portal.libraryResults = () => {
  const { query, available } = Portal.ui.library;
  const text = query.trim().toLowerCase();
  const books = LIBRARY_BOOKS.filter(book => (!available || book.available > 0) && (!text || [book.title, book.author, book.course].some(value => value.toLowerCase().includes(text))));
  byId("libraryResults").innerHTML = `<div class="tw"><table class="tbl"><thead><tr><th>Title</th><th>Author</th><th>Course</th><th class="r">Copies</th><th>Availability</th></tr></thead><tbody>
    ${books.length ? books.map(book => `<tr><td><strong>${esc(book.title)}</strong><small>No. ${book.id}</small></td><td>${esc(book.author)}</td><td>${esc(book.course || "General")}</td><td class="r">${book.copies}</td><td>${book.available ? pill(`${book.available} available`, "ok") : pill("All issued", "bad")}</td></tr>`).join("") : `<tr><td colspan="5" class="empty">No books match your search.</td></tr>`}</tbody></table></div>`;
};
Portal.sections.myLibrary = () => {
  const loans = libraryLoansFor(Portal.student).map(loan => {
    const book = LIBRARY_BOOKS.find(item => item.id === loan.bookId);
    const lateDays = loan.due < todayIso() ? Math.round((new Date(`${todayIso()}T00:00:00`) - new Date(`${loan.due}T00:00:00`)) / 86400000) : 0;
    return { loan, book, lateDays, fine: lateDays * 2 };
  });
  const fineTotal = loans.reduce((sum, item) => sum + item.fine, 0);
  byId("myLibrary").innerHTML = `${Portal.head("Library", "Books you have borrowed and the books you can find on the shelves.")}
    <div class="chips"><div class="chip">Books borrowed<strong>${loans.length}</strong></div><div class="chip">Fine due<strong>&#8377;${fineTotal}</strong></div><div class="chip">Fine rate<strong>&#8377;2 a day</strong></div></div>
    <div class="panel"><h3>Books you have borrowed</h3>${loans.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Title</th><th>Issued</th><th>Due</th><th>Status</th><th class="r">Fine</th><th></th></tr></thead><tbody>${loans.map(({ loan, book, lateDays, fine }) => `<tr><td><strong>${esc(book?.title || loan.bookId)}</strong><small>${esc(book?.author || "")}</small></td><td>${esc(fmtDate(loan.issued))}</td><td>${esc(fmtDate(loan.due))}</td><td>${lateDays ? pill(`${lateDays} days overdue`, "bad") : pill("On time", "ok")}</td><td class="r">&#8377;${fine}</td><td>${lateDays || loan.renewals >= 2 ? "" : `<button class="btn sm" type="button" data-act="renewLoan" data-arg="${esc(loan.id)}">Renew 14 days</button>`}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">You have no books out.</div>`}</div>
    <div class="panel" style="margin-top:18px"><h3>Find a book</h3><div class="filters"><label class="field-inline">Search<input id="librarySearch" type="search" placeholder="Title, author or course code" value="${esc(Portal.ui.library.query)}"></label><label class="field-inline" style="grid-auto-flow:column;align-items:center"><input id="libraryAvailable" type="checkbox" ${Portal.ui.library.available ? "checked" : ""} style="min-width:0;height:auto"> Available now</label></div><div id="libraryResults"></div></div>`;
  Portal.libraryResults();
  byId("librarySearch").addEventListener("input", event => { Portal.ui.library.query = event.target.value; Portal.libraryResults(); });
  byId("libraryAvailable").addEventListener("change", event => { Portal.ui.library.available = event.target.checked; Portal.libraryResults(); });
};
Portal.actions.renewLoan = el => { renewLibraryLoan(el.dataset.arg); Portal.render("myLibrary"); };

/* ---------- Class check-in (QR/code roll call) ---------- */

Portal.findMyCheckinSession = () => {
  const student = Portal.student;
  const enrolled = student.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS;
  return readStore(KEYS.checkinSessions, []).find(item => item.open && item.expiresAt > Date.now() && enrolled.includes(item.subject) && (item.section === "all" || item.section === student.section));
};

Portal.checkinWidgetHtml = () => {
  const session = Portal.findMyCheckinSession();
  if (!session) return "";
  const course = subjectConfigFor(session.subject);
  const checkedIn = Boolean(session.checkins[Portal.student.id]);
  const remaining = Math.max(0, Math.round((session.expiresAt - Date.now()) / 1000));
  return `<div class="panel checkin-widget" id="checkinWidgetBox">${checkedIn
    ? `<div class="checkin-done">\u2713 You are marked present for ${esc(course.code)} ${esc(course[session.component])}. Closes in ${remaining}s.</div>`
    : `<strong>${esc(course.code)} ${esc(course[session.component])} check-in is open</strong><span class="muted">Ask your faculty for the code. Closes in ${remaining}s.</span><input id="checkinCodeInput" maxlength="4" inputmode="numeric" placeholder="Code"><button class="btn primary sm" type="button" data-act="submitCheckin" data-arg="${session.id}">Mark present</button><span class="form-line" id="checkinWidgetMessage"></span>`}</div>`;
};

Portal.refreshCheckinWidget = () => {
  const box = byId("checkinWidgetBox");
  const html = Portal.checkinWidgetHtml();
  if (box) { if (html) box.outerHTML = html; else box.remove(); }
  else if (html && byId("studentOverview")?.classList.contains("active")) byId("studentOverview").querySelector(".home-hero")?.insertAdjacentHTML("afterend", html);
};

Portal.actions.submitCheckin = el => {
  const sessions = readStore(KEYS.checkinSessions, []);
  const target = sessions.find(item => item.id === el.dataset.arg);
  const message = byId("checkinWidgetMessage");
  if (!target || !target.open || target.expiresAt < Date.now()) { Portal.refreshCheckinWidget(); return; }
  const code = byId("checkinCodeInput").value.trim();
  if (code !== target.code) { if (message) message.textContent = "Incorrect code. Try again."; return; }
  target.checkins[Portal.student.id] = Date.now();
  writeStore(KEYS.checkinSessions, sessions);
  Portal.refreshCheckinWidget();
};

/* ---------- Counselling, clearance, report card, profile ---------- */

Portal.sections.counsellingDiary = () => {
  const entries = [
    ["2026-09-29", "2026-2027", "Odd Sem", "Submit accommodation form and inform about the in-semester examinations", "Parents informed that in-semester examinations are scheduled from 28-09-2026 to 01-10-2026.", "Student"],
    ["2026-09-13", "2026-2027", "Odd Sem", "Attendance status and semester 1 marks", "Shared August attendance and semester 1 marks with the parents.", "Parent"],
    ["2026-08-21", "2026-2027", "Odd Sem", "Attendance maintenance", "Informed parents and student about attendance for 16 to 30 August.", "Parent"],
    ["2026-05-22", "2025-2026", "Summer Term", "Second semester result", "Result shared with the parents. SGPA of 8.73.", "Parent"]
  ];
  byId("counsellingDiary").innerHTML = `${Portal.head("Counselling diary", "Meetings and calls with your faculty counsellor.")}<div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Date</th><th>Year and semester</th><th>Spoke with</th><th>Topic</th><th>Counsellor remarks</th></tr></thead><tbody>${entries.map(([date, year, sem, topic, remarks, who]) => `<tr><td>${esc(fmtDate(date))}</td><td>${esc(year)}<small>${esc(sem)}</small></td><td>${who}</td><td>${esc(topic)}</td><td>${esc(remarks)}</td></tr>`).join("")}</tbody></table></div><p class="note">Counsellor: Dr. Killi Chandra Bhushana Rao.</p></div>`;
};

Portal.sections.academicClearance = () => {
  const s = Portal.student;
  const clearance = s.clearance || { tuition: "Cleared", examFee: "Cleared", library: "Cleared", overall: "Eligible" };
  const hold = clearance.overall === "On Hold" || s.suspended;
  const rows = [["Accounts office", "Tuition and semester dues", clearance.tuition], ["Examination cell", "Exam fee and registration", clearance.examFee], ["Central library", "Books returned and fines paid", clearance.library], ["Department labs", "Lab kits and licences returned", "Cleared"], ["Head of department", "Attendance of 75% or more", overallAttendanceFor(s) >= 75 ? "Cleared" : "Condonation needed"], ["Disciplinary committee", "No active suspension on record", s.suspended ? "Suspended" : "Cleared"]];
  byId("academicClearance").innerHTML = `${Portal.head("Exam clearance", "Every office that must clear you before the hall ticket and report card are released.")}
    <div class="banner ${hold ? "bad" : "ok"}"><div><strong>${hold ? "Clearance on hold" : "You are cleared for the examinations"}</strong>${esc(s.suspended ? `Your account is suspended${s.suspensionReason ? ` (${s.suspensionReason})` : ""}. Contact the academic office.` : clearance.note || (hold ? "Contact the accounts or examination office." : "No dues are pending."))}</div></div>
    <div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Office</th><th>What is checked</th><th>Status</th></tr></thead><tbody>${rows.map(([office, scope, status]) => `<tr><td><strong>${esc(office)}</strong></td><td>${esc(scope)}</td><td>${pill(status, ["Cleared", "Eligible"].includes(status) ? "ok" : "bad")}</td></tr>`).join("")}</tbody></table></div></div>`;
};

Portal.reportBody = term => {
  const result = termResult(Portal.student, term);
  return `${Portal.resultTable(result)}<p style="margin-top:10px">SGPA <strong>${result.sgpa.toFixed(2)}</strong> &middot; Attendance <strong>${overallAttendanceFor(Portal.student).toFixed(1)}%</strong></p>`;
};
Portal.sections.myReport = () => {
  const term = Portal.currentTerm();
  const published = readStore(KEYS.publications, []).filter(item => item.students?.some(entry => entry.id === Portal.student.id));
  byId("myReport").innerHTML = `${Portal.head("Report card", `${term.semester} ${term.academicYear}`, `<button class="btn" type="button" data-act="downloadReport">Download PDF</button><button class="btn primary" type="button" data-act="printReport">Print</button>`)}
    <div class="banner ${published.some(item => item.semester === Portal.student.semester) ? "ok" : "info"}"><div><strong>${published.some(item => item.semester === Portal.student.semester) ? "Finalised" : "Provisional"}</strong>${published.length ? "The academic office has published your result." : "The academic office has not published the final report yet."}</div></div>
    ${Portal.sheet({ title: "Academic progress report", subtitle: `${term.semester} ${term.academicYear}`, meta: Portal.studentMeta(term), body: Portal.reportBody(term), signatures: ["Class advisor", "Principal"] })}`;
};
Portal.actions.downloadReport = () => downloadReportPdf(Portal.student, Portal.currentTerm().semester, false);
Portal.actions.printReport = () => { const term = Portal.currentTerm(); Portal.printDocument(Portal.sheet({ title: "Academic progress report", subtitle: `${term.semester} ${term.academicYear}`, meta: Portal.studentMeta(term), body: Portal.reportBody(term), signatures: ["Class advisor", "Principal"] })); };

Portal.sections.myProfile = () => {
  const s = Portal.student;
  const term = Portal.currentTerm();
  const picture = s.profilePicture?.startsWith("data:image/") ? `<img src="${esc(s.profilePicture)}" alt="">` : esc(s.name.charAt(0));
  byId("myProfile").innerHTML = `${Portal.head("Profile", "Your official details are managed by the academic office.")}
    <div class="panel"><div class="profile-head"><div class="profile-photo">${picture}</div><div><h3>${esc(s.name)}</h3><p class="muted">${esc(s.email)}</p></div></div>
      <div class="facts"><div><small>University ID</small><strong>${esc(s.universityId)}</strong></div><div><small>Branch</small><strong>${esc(s.department)}</strong></div><div><small>Batch and section</small><strong>${esc(s.batch || "2025-2029")}, ${esc(s.section || "")}</strong></div><div><small>Year and semester</small><strong>Year ${term.yearOfStudy}, semester ${term.semesterNo}</strong></div><div><small>Parent or guardian</small><strong>${esc(s.parentName || "Not on record")}</strong></div><div><small>Parent contact</small><strong>${esc(s.parentContact || "Not on record")}</strong></div><div><small>Your mobile</small><strong>${esc(s.phone || "Not on record")}</strong></div></div></div>
    <div class="panel" style="margin-top:18px"><h3>Account settings</h3><p class="sub">Change your photo or password. A photo appears on your hall ticket.</p>
      <div class="form-grid"><label>Profile photo<input id="profilePicture" type="file" accept="image/png,image/jpeg,image/webp"></label><label>New password<input id="profilePassword" type="password" minlength="8" placeholder="Leave blank to keep the current one"></label><label>Confirm password<input id="profilePasswordConfirm" type="password" minlength="8"></label></div>
      <div class="actions" style="margin-top:16px"><button class="btn primary" type="button" data-act="saveProfile">Save changes</button></div><p class="form-line" id="profileMessage"></p></div>`;
};
Portal.actions.saveProfile = async () => {
  const message = byId("profileMessage");
  const fail = text => { message.textContent = text; message.classList.remove("success"); };
  const password = byId("profilePassword").value;
  if (password && password !== byId("profilePasswordConfirm").value) return fail("The two passwords do not match.");
  if (password && password.length < 8) return fail("Use at least 8 characters for the password.");
  const picture = byId("profilePicture").files[0];
  if (picture && !["image/png", "image/jpeg", "image/webp"].includes(picture.type)) return fail("Choose a PNG, JPEG or WebP image.");
  if (picture && picture.size > 500000) return fail("Choose an image under 500 KB.");
  const data = picture ? await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(picture); }) : null;
  if (data) Portal.update(record => { record.profilePicture = data; });
  if (password) {
    const users = readStore(KEYS.users, []);
    const user = users.find(item => item.id === Portal.session.id);
    if (user) user.password = password;
    writeStore(KEYS.users, users);
  }
  logActivity("Updated student account settings", Portal.student.name);
  Portal.paintAvatar();
  Portal.render("myProfile");
  const done = byId("profileMessage");
  done.textContent = "Saved.";
  done.classList.add("success");
};

/* ---------- Search, shell and start-up ---------- */

Portal.paintAvatar = () => {
  const picture = Portal.student.profilePicture;
  byId("userInitial").innerHTML = picture?.startsWith("data:image/") ? `<img src="${esc(picture)}" alt="">` : esc(Portal.student.name.charAt(0).toUpperCase());
};

Portal.setupSearch = () => {
  const input = byId("globalErpSearch");
  const results = byId("globalSearchResults");
  const pages = [...document.querySelectorAll(".nav-link[data-section]")].map(button => ({ label: button.querySelector("span").textContent, section: button.dataset.section }));
  const courses = SUBJECT_CONFIG.map(course => ({ label: `${course.code} ${course.shortName}`, section: "myCourses" }));
  const index = [...pages, ...courses];
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (!query) { results.hidden = true; return; }
    const matches = index.filter(item => item.label.toLowerCase().includes(query)).slice(0, 8);
    results.innerHTML = matches.length ? matches.map(item => `<button type="button" data-goto="${item.section}">${esc(item.label)}</button>`).join("") : `<div class="none">Nothing matches "${esc(input.value)}".</div>`;
    results.hidden = false;
  });
  results.addEventListener("click", event => {
    const target = event.target.closest("[data-goto]");
    if (!target) return;
    Portal.go(target.dataset.goto);
    results.hidden = true;
    input.value = "";
  });
  document.addEventListener("click", event => { if (!event.target.closest(".search-box")) results.hidden = true; });
};

Portal.seed = () => {
  ensureSampleAssignments();
  const registrationWindow = getRegistrationWindow();
  const term = Portal.currentTerm();
  if (Portal.student.id === "stu_santhosh" && !Portal.student.courseRegistration) {
    const selections = Object.fromEntries(termCourses(Portal.student, term).map(course => [course.code, { primary: Portal.defaultSection(course, "primary"), secondary: Portal.defaultSection(course, "secondary") }]));
    Portal.update(record => { record.courseRegistration = { registeredAt: `${registrationWindow?.opens || "2026-07-05"}T10:00:00.000Z`, selections }; });
  }
  if (Portal.student.assignmentSubmissions === undefined) {
    const records = getAcademicRecords("assignments");
    const submissions = {};
    ["25SC2006", "25AD2102", "25MT1306"].forEach(code => {
      const record = records.find(item => item.id === `asg_sample_${code}_2`);
      if (record) submissions[record.id] = { status: "Submitted", submittedAt: new Date().toISOString(), marks: Math.round(record.maxMarks * 0.82) };
    });
    Portal.update(record => { record.assignmentSubmissions = submissions; });
  }
};

function startStudentPortal() {
  const session = protectPage("student");
  if (!session) return;
  setupDashboardShell(session);
  Portal.session = session;
  Portal.reload();
  if (!Portal.student) {
    document.querySelector(".content-area").innerHTML = `<div class="panel empty">Your account is not linked to a student record. Ask the administrator to connect it.</div>`;
    return;
  }
  Portal.seed();
  const term = Portal.currentTerm();
  byId("termChip").textContent = `Year ${term.yearOfStudy}, semester ${term.semesterNo} \u00b7 ${term.semester} ${term.academicYear}`;
  byId("userSub").textContent = Portal.student.department;
  Portal.paintAvatar();
  Portal.setupSearch();
  document.addEventListener("click", event => {
    const control = event.target.closest("[data-act]");
    if (control) Portal.actions[control.dataset.act]?.(control, event);
  });
  byId("portalModalClose").addEventListener("click", () => byId("portalModal").close());
  byId("portalModal").addEventListener("click", event => { if (event.target === byId("portalModal")) byId("portalModal").close(); });
  window.addEventListener("afterprint", () => { byId("printSheet").innerHTML = ""; });
  Portal.renderAll();
  Portal.updateBadges();
  setInterval(() => { if (byId("studentOverview")?.classList.contains("active")) Portal.refreshCheckinWidget(); }, 4000);
}
startStudentPortal();
