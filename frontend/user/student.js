// Student portal: shell, shared helpers and the semester pages.
// Exam, planning and campus pages live in student-more.js.

const Portal = { session: null, student: null, sections: {}, actions: {}, termPick: {}, ui: {} };
const byId = id => document.getElementById(id);
const esc = escapeHtml;
const fmtDate = iso => (iso ? formatAcademicDate(iso) : "\u2014");
const pill = (text, tone) => `<span class="pill ${tone}">${esc(text)}</span>`;
const pct = value => `${Number(value).toFixed(1)}%`;

Portal.reload = () => { Portal.student = getStudents(true).find(item => item.id === Portal.session.studentId) || Portal.student; };
Portal.update = mutate => {
  const all = getStudents(true);
  const record = all.find(item => item.id === Portal.session.studentId);
  if (!record) return;
  mutate(record);
  writeStore(KEYS.students, all);
  Portal.reload();
};
Portal.terms = () => studentTerms(Portal.student);
Portal.currentTerm = () => Portal.terms().find(term => term.isCurrent) || Portal.terms()[Portal.terms().length - 1];
Portal.facultyFor = subject => readStore(KEYS.users, []).find(user => user.role === "faculty" && !user.archived && user.subjects?.includes(subject));
Portal.defaultSection = (course, component) => {
  const base = /^S-(\d+)/.exec(course.section || "")?.[1] || "9";
  return course[component] === "Lecture" || course[component] === "Tutorial" ? `S-${base}-MA` : course[component] === "Practical" ? `S-${base}-A` : `S-${base}-B`;
};
Portal.sectionFor = (course, component) => Portal.student.courseRegistration?.selections?.[course.code]?.[component] || Portal.defaultSection(course, component);

Portal.head = (title, subtitle, actions = "") => `<div class="ph"><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div>${actions ? `<div class="actions">${actions}</div>` : ""}</div>`;
Portal.go = id => document.querySelector(`.nav-link[data-section="${id}"]`)?.click();
Portal.render = id => Portal.sections[id]?.();
Portal.renderAll = () => Object.keys(Portal.sections).forEach(id => Portal.render(id));

Portal.openModal = (title, html) => {
  byId("portalModalTitle").textContent = title;
  byId("portalModalBody").innerHTML = html;
  byId("portalModal").showModal();
};

Portal.printDocument = html => {
  byId("printSheet").innerHTML = html;
  window.print();
};

Portal.termBarHtml = (id, pick, term) => {
  const years = [...new Set(Portal.terms().map(item => item.academicYear))];
  return `<div class="termbar" data-bar="${id}">
    <label>Academic year<select data-term-year>${years.map(year => `<option ${year === pick.academicYear ? "selected" : ""}>${year}</option>`).join("")}</select></label>
    <label>Semester<select data-term-sem>${["Odd Sem", "Even Sem"].map(sem => `<option ${sem === pick.semester ? "selected" : ""}>${sem}</option>`).join("")}</select></label>
    <button class="btn primary" type="button" data-act="termShow" data-arg="${id}">Show</button>
    <button class="btn" type="button" data-act="termReset" data-arg="${id}">Current semester</button>
    ${term ? `<span class="muted">Year ${term.yearOfStudy}, semester ${term.semesterNo}${term.isCurrent ? " (running)" : ""}</span>` : ""}
  </div>`;
};

// Registers a page that follows the academic year and semester chosen in its filter bar.
Portal.termSection = (id, config) => {
  Portal.sections[id] = () => {
    const pick = Portal.termPick[id] || (Portal.termPick[id] = { ...currentAcademicTerm() });
    const term = Portal.terms().find(item => item.academicYear === pick.academicYear && item.semester === pick.semester);
    byId(id).innerHTML = `${Portal.head(config.title, config.subtitle, config.actions ? config.actions(term) : "")}${Portal.termBarHtml(id, pick, term)}<div data-body></div>`;
    const body = byId(id).querySelector("[data-body]");
    if (!term) body.innerHTML = `<div class="panel empty">No academic record exists for ${esc(pick.academicYear)} ${esc(pick.semester)}. Pick a semester you have studied.</div>`;
    else if (!termCourses(Portal.student, term).length && !config.allowEmpty) body.innerHTML = `<div class="panel empty">No course records are available for ${esc(term.academicYear)} ${esc(term.semester)}.</div>`;
    else config.body(term, body);
  };
};

Portal.actions.termShow = el => {
  const bar = el.closest(".termbar");
  Portal.termPick[el.dataset.arg] = { academicYear: bar.querySelector("[data-term-year]").value, semester: bar.querySelector("[data-term-sem]").value };
  Portal.render(el.dataset.arg);
};
Portal.actions.termReset = el => {
  Portal.termPick[el.dataset.arg] = { ...currentAcademicTerm() };
  Portal.render(el.dataset.arg);
};
Portal.actions.go = el => Portal.go(el.dataset.arg);

Portal.photoHtml = () => {
  const picture = Portal.student.profilePicture;
  if (picture?.startsWith("data:image/")) return `<img src="${esc(picture)}" alt="Photo of ${esc(Portal.student.name)}">`;
  const initial = esc(Portal.student.name.charAt(0).toUpperCase());
  return `<svg viewBox="0 0 124 152" role="img" aria-label="No photo uploaded"><rect width="124" height="152" fill="#e4e9f2"/><circle cx="62" cy="56" r="26" fill="#aab6cc"/><path d="M14 152c2-38 22-56 48-56s46 18 48 56z" fill="#aab6cc"/><text x="62" y="66" text-anchor="middle" font-size="30" font-family="sans-serif" fill="#fff">${initial}</text></svg>`;
};

Portal.barcodeSvg = text => {
  let x = 0;
  const bars = [...String(text)].flatMap(char => {
    const code = char.charCodeAt(0);
    return [1 + (code % 3), 1 + ((code >> 2) % 2), 1 + ((code >> 1) % 3), 1 + (code % 2)];
  }).map((width, index) => {
    const bar = index % 2 === 0 ? `<rect x="${x}" y="0" width="${width}" height="34" fill="#111"/>` : "";
    x += width + 1;
    return bar;
  }).join("");
  return `<svg class="sheet-barcode" viewBox="0 0 ${x} 34" width="${Math.min(150, x)}" height="34" aria-label="Barcode ${esc(text)}" preserveAspectRatio="none">${bars}</svg>`;
};

Portal.studentMeta = term => {
  const s = Portal.student;
  return [["Student name", s.name], ["University ID", s.universityId], ["Program and branch", `B.Tech, ${s.department}`], ["Batch and section", `${s.batch || "2025-2029"}, ${s.section || "\u2014"}`], ["Academic year", term.academicYear], ["Study year and semester", `Year ${term.yearOfStudy}, semester ${term.semesterNo} (${term.semester})`]];
};

// One letterhead for every printable document so they all look official.
Portal.sheet = ({ title, subtitle = "", meta = [], body = "", photo = false, withheld = false, signatures = ["Student", "Controller of Examinations"] }) => `
  <div class="sheet ${withheld ? "withheld" : ""}">
    <div class="sheet-head">
      <div class="sheet-seal" aria-hidden="true">KL</div>
      <div class="sheet-title"><h2>Koneru Lakshmaiah Education Foundation</h2><p>K L Deemed to be University, Vaddeswaram, Andhra Pradesh</p><h3>${esc(title)}</h3>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div>
      <div class="sheet-photo-wrap">${photo ? `<div class="sheet-photo">${Portal.photoHtml()}</div><small>Affix signature below photo</small>` : `<small>Generated ${esc(fmtDate(todayIso()))}</small>`}</div>
    </div>
    <div class="sheet-meta">${meta.map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>
    ${body}
    <div class="sheet-sign">${signatures.map(label => `<div>${esc(label)}</div>`).join("")}</div>
  </div>`;

/* ---------- shared data helpers ---------- */

Portal.assignmentRows = () => {
  const names = (Portal.student.enrolledSubjects?.length ? Portal.student.enrolledSubjects : SUBJECTS);
  const today = todayIso();
  return getAcademicRecords("assignments").filter(item => names.includes(item.subject)).map(record => {
    const submission = Portal.student.assignmentSubmissions?.[record.id];
    const status = submission ? (submission.marks === undefined ? "Submitted" : "Graded") : record.dueDate < today ? "Overdue" : "Pending";
    return { record, submission, status, config: subjectConfigFor(record.subject) };
  }).sort((a, b) => a.record.dueDate.localeCompare(b.record.dueDate));
};

Portal.feedbackItems = () => {
  const given = Portal.student.feedbackGiven || {};
  return termCourses(Portal.student, Portal.currentTerm()).flatMap(course => ["primary", "secondary"].map(component => {
    const id = `${course.code}:${component}`;
    return { id, course, component, label: course[component], faculty: Portal.facultyFor(course.name)?.name || "Faculty to be assigned", done: given[id] };
  }));
};

Portal.recentAbsences = limit => {
  const term = Portal.currentTerm();
  return termCourses(Portal.student, term).flatMap(course => ["primary", "secondary"].flatMap(component =>
    attendanceHistory(Portal.student, term, course, component).filter(entry => entry.status === "A").map(entry => ({ ...entry, course, component }))
  )).sort((a, b) => b.date.localeCompare(a.date) || b.period - a.period).slice(0, limit);
};

Portal.attention = () => {
  const s = Portal.student;
  const items = [];
  const windowRecord = getRegistrationWindow();
  const state = registrationWindowState(windowRecord);
  if (!s.courseRegistration) {
    if (state === "open") items.push({ text: `Course registration closes on ${fmtDate(windowRecord.closes)}.`, tone: "warn", go: "academicRegistration", label: "Register now" });
    else if (state === "upcoming") items.push({ text: `Course registration opens on ${fmtDate(windowRecord.opens)}.`, tone: "info", go: "academicRegistration", label: "View dates" });
    else items.push({ text: "Course registration is pending and the window is closed.", tone: "bad", go: "academicRegistration", label: "See what to do" });
  }
  const feedbackLeft = Portal.feedbackItems().filter(item => !item.done).length;
  if (feedbackLeft) items.push({ text: `${feedbackLeft} feedback form${feedbackLeft === 1 ? "" : "s"} waiting for you.`, tone: "warn", go: "studentFeedback", label: "Give feedback" });
  const rows = Portal.assignmentRows();
  const overdue = rows.filter(row => row.status === "Overdue").length;
  const pending = rows.filter(row => row.status === "Pending").length;
  if (overdue || pending) items.push({ text: `${pending} assignment${pending === 1 ? "" : "s"} pending${overdue ? `, ${overdue} overdue` : ""}.`, tone: overdue ? "bad" : "warn", go: "myAssignments", label: "Open assignments" });
  const low = termCourses(s, Portal.currentTerm()).filter(course => subjectAttendanceFor(s, course.name) < 75);
  if (low.length) items.push({ text: `Attendance is below 75% in ${low.map(course => course.shortName).join(", ")}.`, tone: "bad", go: "myAttendance", label: "View attendance" });
  if (s.clearance?.overall === "On Hold") items.push({ text: "Your exam clearance is on hold, so the hall ticket is withheld.", tone: "bad", go: "academicClearance", label: "See details" });
  return items;
};

Portal.updateBadges = () => {
  const setBadge = (id, count) => { const el = byId(id); el.hidden = !count; el.textContent = count; };
  setBadge("badgeFeedback", Portal.feedbackItems().filter(item => !item.done).length);
  setBadge("badgeAssignments", Portal.assignmentRows().filter(row => ["Pending", "Overdue"].includes(row.status)).length);
  const state = registrationWindowState();
  setBadge("badgeRegistration", !Portal.student.courseRegistration && state !== "upcoming" ? "!" : 0);
};

/* ---------- Home ---------- */

Portal.sections.studentOverview = () => {
  const s = Portal.student;
  const term = Portal.currentTerm();
  const results = cumulativeResults(s);
  const cgpa = results.length ? results[results.length - 1].cgpa : 0;
  const courses = termCourses(s, term);
  const attendance = overallAttendanceFor(s);
  const notices = getAcademicRecords("announcements").filter(item => item.audience === "all" || (item.audience === "student" && (!item.subject || s.enrolledSubjects?.includes(item.subject)))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const attention = Portal.attention();
  const absences = Portal.recentAbsences(4);
  byId("studentOverview").innerHTML = `
    <div class="home-hero"><div><p class="muted">Year ${term.yearOfStudy}, semester ${term.semesterNo} &middot; ${esc(term.semester)} ${esc(term.academicYear)}</p><h1>Welcome back, ${esc(s.name.split(" ")[0])}.</h1></div><p>${esc(s.department)} &middot; ${esc(s.section || "")} &middot; ${esc(s.universityId)}</p></div>
    ${Portal.checkinWidgetHtml ? Portal.checkinWidgetHtml() : ""}
    <div class="standing">
      <div><small>CGPA</small><strong>${cgpa.toFixed(2)}</strong><small>${results.length} semester${results.length === 1 ? "" : "s"} counted</small></div>
      <div><small>Attendance</small><strong class="${attendance < 75 ? "low" : attendance >= 85 ? "good" : ""}">${attendance.toFixed(1)}%</strong><small>${attendance < 75 ? "Below the 75% limit" : "Above the 75% limit"}</small></div>
      <div><small>Credits this semester</small><strong>${courses.reduce((sum, course) => sum + course.credits, 0)}</strong><small>${courses.length} courses</small></div>
      <div><small>Exam clearance</small><strong class="${s.clearance?.overall === "On Hold" ? "low" : "good"}" style="font-size:1.7rem">${s.clearance?.overall === "On Hold" ? "On hold" : "Cleared"}</strong><small>Hall ticket ${s.clearance?.overall === "On Hold" ? "withheld" : "available"}</small></div>
    </div>
    <div class="grid-2">
      <div class="stack">
        <div class="panel"><h3>Needs your attention</h3><p class="sub">Open items for this semester</p>${attention.length ? `<div class="todo">${attention.map(item => `<button type="button" data-act="go" data-arg="${item.go}"><span>${esc(item.text)}</span><span>${esc(item.label)}</span></button>`).join("")}</div>` : `<div class="empty">Nothing is waiting for you.</div>`}</div>
        <div class="panel"><h3>Current scores</h3><p class="sub">Weighted score so far in each course</p><div class="bars">${courses.map(course => { const value = finalScoreFor(scoresFor(s, term, course)); return `<div class="bar-row"><span>${esc(course.shortName)}</span><div class="bar-track"><div class="bar-fill ${value < 60 ? "low" : value >= 80 ? "high" : ""}" style="width:${Math.min(100, value)}%"></div></div><strong class="num">${value.toFixed(0)}%</strong></div>`; }).join("")}</div></div>
      </div>
      <div class="stack">
        <div class="panel"><h3>Notices</h3><p class="sub">From faculty and the academic office</p>${notices.length ? notices.map(item => `<div class="notice"><strong>${esc(item.title)}</strong><p>${esc(item.message)}</p><small>${esc(item.author)}, ${esc(fmtDate(item.date))}</small></div>`).join("") : `<div class="empty">No notices.</div>`}</div>
        <div class="panel"><h3>Recent absences</h3><p class="sub">Classes you were marked absent in</p>${absences.length ? absences.map(item => `<div class="notice"><strong>${esc(item.course.code)} ${esc(item.course.shortName)}</strong> <small>${esc(item.course[item.component])}</small><br><small>${esc(fmtDate(item.date))}, period ${item.period}</small></div>`).join("") : `<div class="empty">No absences recorded.</div>`}</div>
      </div>
    </div>`;
};

/* ---------- Course registration ---------- */

Portal.sections.academicRegistration = () => {
  const s = Portal.student;
  const term = Portal.currentTerm();
  const windowRecord = getRegistrationWindow();
  const state = registrationWindowState(windowRecord);
  const registration = s.courseRegistration;
  const courses = termCourses(s, term);
  let banner;
  if (state === "open") {
    banner = registration
      ? `<div class="banner ok"><div><strong>You are registered</strong>Saved on ${esc(fmtDate(registration.registeredAt.slice(0, 10)))}. You can change sections until ${esc(fmtDate(windowRecord.closes))}.</div></div>`
      : `<div class="banner warn"><div><strong>Registration is open</strong>Choose your sections and save before ${esc(fmtDate(windowRecord.closes))}.${windowRecord.notice ? ` ${esc(windowRecord.notice)}` : ""}</div></div>`;
  } else if (state === "upcoming") {
    banner = `<div class="banner info"><div><strong>Registration opens on ${esc(fmtDate(windowRecord.opens))}</strong>It stays open until ${esc(fmtDate(windowRecord.closes))}. You can choose sections here once it opens.</div></div>`;
  } else {
    banner = registration
      ? `<div class="banner ok"><div><strong>Registration completed</strong>Saved on ${esc(fmtDate(registration.registeredAt.slice(0, 10)))}. The window closed on ${esc(fmtDate(windowRecord?.closes))}.</div></div>`
      : `<div class="banner bad"><div><strong>Registration pending</strong>The window closed on ${esc(fmtDate(windowRecord?.closes))} and you have not registered. Ask the administrator to reopen registration for you.</div></div>`;
  }
  const options = (course, component) => {
    const base = Number(/^S-(\d+)/.exec(course.section || "")?.[1] || 9);
    const names = ["Lecture", "Tutorial"].includes(course[component]) ? [0, 1, 2].map(i => `S-${base + i}-MA`) : ["A", "B", "C"].map(letter => `S-${base}-${letter}`);
    const chosen = Portal.sectionFor(course, component);
    return names.map(name => `<option ${name === chosen ? "selected" : ""}>${name}</option>`).join("");
  };
  const editable = state === "open";
  byId("academicRegistration").innerHTML = `${Portal.head("Course registration", `${term.semester} ${term.academicYear} \u00b7 year ${term.yearOfStudy}, semester ${term.semesterNo}`)}${banner}
    <div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Course</th><th>Credits</th><th>L-T-P-S</th><th>Main class</th><th>Second class</th></tr></thead><tbody>
      ${courses.map(course => `<tr><td><strong>${esc(course.code)}</strong><small>${esc(course.name)}</small></td><td class="r">${course.credits}</td><td>${esc(course.ltps)}</td>
        ${["primary", "secondary"].map(component => `<td>${editable ? `<label class="field-inline">${esc(course[component])}<select class="reg-select" data-code="${course.code}" data-comp="${component}">${options(course, component)}</select></label>` : `${esc(course[component])}<small>${registration ? esc(Portal.sectionFor(course, component)) : "Not chosen"}</small>`}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>
    ${editable ? `<div class="actions" style="margin-top:16px"><button class="btn primary" type="button" data-act="saveRegistration">${registration ? "Update registration" : "Save registration"}</button></div><p class="form-line" id="regMessage"></p>` : ""}</div>`;
};

Portal.actions.saveRegistration = () => {
  if (registrationWindowState() !== "open") return;
  const selections = {};
  document.querySelectorAll("#academicRegistration select[data-code]").forEach(select => {
    selections[select.dataset.code] ||= {};
    selections[select.dataset.code][select.dataset.comp] = select.value;
  });
  Portal.update(record => { record.courseRegistration = { registeredAt: new Date().toISOString(), selections }; });
  logActivity(`Registered for ${Portal.currentTerm().semester} ${Portal.currentTerm().academicYear}`, Portal.student.name);
  Portal.render("academicRegistration");
  Portal.render("studentOverview");
  Portal.render("myAttendance");
  Portal.updateBadges();
  const message = byId("regMessage");
  if (message) { message.textContent = "Registration saved."; message.classList.add("success"); }
};

/* ---------- Courses and handouts ---------- */

Portal.termSection("myCourses", {
  title: "Courses and handouts",
  subtitle: "Course structure, credits and the evaluation plan for each course.",
  body: (term, el) => {
    el.innerHTML = `<div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>#</th><th>Course</th><th>L-T-P-S</th><th class="r">Credits</th><th>Offered by</th><th>Faculty</th><th></th></tr></thead><tbody>
      ${termCourses(Portal.student, term).map((course, index) => `<tr><td>${index + 1}</td><td><strong>${esc(course.code)}</strong><small>${esc(course.name)}</small></td><td>${esc(course.ltps)}</td><td class="r">${course.credits}</td><td>${esc(course.offeredBy)}</td><td>${esc(term.isCurrent ? Portal.facultyFor(course.name)?.name || "To be assigned" : "\u2014")}</td><td><button class="btn sm" type="button" data-act="handout" data-arg="${course.code}|${term.key}">View handout</button></td></tr>`).join("")}
    </tbody></table></div></div>`;
  }
});

Portal.handoutBody = (course, term) => {
  const weights = [["Home assignment", 10], ["ALM", 10], [course.secondary === "Tutorial" ? "Tutorial" : "Quiz", 10], [courseHasLab(course) ? "Lab internal" : "Continuous evaluation", 10], ["Mid exam 1", 15], ["Mid exam 2", 15], ["Semester end exam", 30]];
  return `<div class="facts"><div><small>Course code</small><strong>${esc(course.code)}</strong></div><div><small>L-T-P-S</small><strong>${esc(course.ltps)}</strong></div><div><small>Credits</small><strong>${course.credits}</strong></div><div><small>Offered by</small><strong>${esc(course.offeredBy)}</strong></div><div><small>Coordinator</small><strong>${esc(term.isCurrent ? Portal.facultyFor(course.name)?.name || "To be announced" : "\u2014")}</strong></div></div>
    <h4 style="margin:18px 0 6px">Course outcomes</h4><ol class="advice">
      <li>Explain the core concepts of ${esc(course.shortName)}.</li><li>Apply those concepts to solve structured problems.</li><li>Analyse a problem and choose a suitable method.</li><li>Design and test a working solution.</li><li>Communicate the results clearly in reports and viva.</li></ol>
    <h4 style="margin:18px 0 6px">Evaluation plan</h4><div class="tw"><table class="tbl"><thead><tr><th>Component</th><th class="r">Weightage</th></tr></thead><tbody>${weights.map(([name, weight]) => `<tr><td>${esc(name)}</td><td class="r">${weight}%</td></tr>`).join("")}</tbody><tfoot><tr><td>Total</td><td class="r">100%</td></tr></tfoot></table></div>`;
};
Portal.actions.handout = el => {
  const [code, key] = el.dataset.arg.split("|");
  const term = Portal.terms().find(item => item.key === key);
  const course = termCourses(Portal.student, term).find(item => item.code === code);
  Portal.openModal(`${course.code} ${course.name}`, `${Portal.handoutBody(course, term)}<div class="actions" style="margin-top:16px"><button class="btn" type="button" data-act="printHandout" data-arg="${code}|${key}">Print handout</button></div>`);
};
Portal.actions.printHandout = el => {
  const [code, key] = el.dataset.arg.split("|");
  const term = Portal.terms().find(item => item.key === key);
  const course = termCourses(Portal.student, term).find(item => item.code === code);
  Portal.printDocument(Portal.sheet({ title: "Course handout", subtitle: `${course.code} ${course.name}`, meta: Portal.studentMeta(term), body: Portal.handoutBody(course, term), signatures: ["Course coordinator", "Head of department"] }));
};

/* ---------- Attendance ---------- */

Portal.attendanceRows = term => termCourses(Portal.student, term).flatMap(course => ["primary", "secondary"].map(component => ({ course, component, summary: componentAttendanceFor(Portal.student, term, course, component) })));

Portal.termSection("myAttendance", {
  title: "Attendance",
  subtitle: "Attendance for each class type in every course, with a register of every class.",
  actions: () => `<button class="btn" type="button" data-act="printAttendance">Print</button>`,
  body: (term, el) => {
    const s = Portal.student;
    const rows = Portal.attendanceRows(term);
    const courses = termCourses(s, term);
    const overall = courses.reduce((sum, course) => sum + (term.isCurrent ? subjectAttendanceFor(s, course.name) : 0.75 * componentAttendanceFor(s, term, course, "primary").percent + 0.25 * componentAttendanceFor(s, term, course, "secondary").percent), 0) / courses.length;
    const below = rows.filter(row => row.summary.percent < 75).length;
    const need = summary => {
      if (summary.percent >= 75) { const spare = Math.floor((summary.attended - 0.75 * summary.conducted) / 0.75); return spare > 0 ? `Can miss ${spare} more` : "Right on the limit"; }
      return `Attend next ${Math.ceil((0.75 * summary.conducted - summary.attended) / 0.25)}`;
    };
    el.innerHTML = `<div class="chips"><div class="chip key">Overall<strong>${overall.toFixed(1)}%</strong></div><div class="chip">Class types below 75%<strong>${below}</strong></div><div class="chip">Course weight<strong>Main 75% &middot; Second 25%</strong></div></div>
      <div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>#</th><th>Course</th><th>Class type</th><th>Section</th><th class="r">Conducted</th><th class="r">Attended</th><th class="r">Absent</th><th class="r">Attendance</th><th>To stay above 75%</th><th></th></tr></thead><tbody>
      ${rows.map((row, index) => `<tr><td>${index + 1}</td><td><strong>${esc(row.course.code)}</strong><small>${esc(row.course.name)}</small></td><td>${esc(row.course[row.component])}</td><td>${esc(term.isCurrent ? Portal.sectionFor(row.course, row.component) : row.course.section)}</td><td class="r">${row.summary.conducted}</td><td class="r">${row.summary.attended}</td><td class="r">${row.summary.absent}</td><td class="r">${pill(pct(row.summary.percent), row.summary.percent >= 85 ? "ok" : row.summary.percent >= 75 ? "warn" : "bad")}</td><td>${need(row.summary)}</td><td><button class="btn sm" type="button" data-act="register" data-arg="${row.course.code}|${row.component}|${term.key}">Register</button></td></tr>`).join("")}
      </tbody></table></div></div>
      ${term.isCurrent ? `<div class="grid-2" style="margin-top:18px"><div class="panel"><h3>Recent absent periods</h3><p class="sub">Your latest absences across all courses</p>${Portal.absentListHtml()}</div><div class="panel"><h3>Absence texts</h3><p class="sub">Messages sent to you when a class was marked absent</p>${Portal.smsListHtml()}</div></div>` : ""}`;
  }
});

Portal.absentListHtml = () => {
  const absences = Portal.recentAbsences(8);
  return absences.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Date</th><th>Period</th><th>Course</th><th>Class type</th></tr></thead><tbody>${absences.map(item => `<tr><td>${esc(fmtDate(item.date))}</td><td>${item.period}</td><td><strong>${esc(item.course.code)}</strong> ${esc(item.course.shortName)}</td><td>${esc(item.course[item.component])}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">You have no absences this semester.</div>`;
};

Portal.smsListHtml = () => {
  const messages = readStore(KEYS.smsOutbox, []).filter(item => item.studentId === Portal.student.id && item.recipientType === "Student").slice(0, 5);
  return messages.length ? messages.map(item => `<div class="notice"><p>${esc(item.message)}</p><small>${esc(new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.sentAt)))}, to ${esc(item.to || "no number")}</small></div>`).join("") : `<div class="empty">No absence texts yet.</div>`;
};

Portal.registerHtml = (course, component, term) => {
  const s = Portal.student;
  const summary = componentAttendanceFor(s, term, course, component);
  const history = attendanceHistory(s, term, course, component);
  const weighted = term.isCurrent ? subjectAttendanceFor(s, course.name) : 0.75 * componentAttendanceFor(s, term, course, "primary").percent + 0.25 * componentAttendanceFor(s, term, course, "secondary").percent;
  const label = date => { const [y, m, d] = date.split("-"); return `${d}/${m}/${y.slice(2)}`; };
  return `<div class="facts"><div><small>Course</small><strong>${esc(course.code)} ${esc(course[component])}</strong></div><div><small>Section</small><strong>${esc(term.isCurrent ? Portal.sectionFor(course, component) : course.section)}</strong></div><div><small>Year and semester</small><strong>${esc(term.academicYear)}, ${esc(term.semester)}</strong></div><div><small>Conducted / attended / absent</small><strong>${summary.conducted} / ${summary.attended} / ${summary.absent}</strong></div><div><small>This class type</small><strong>${pct(summary.percent)}</strong></div><div><small>Course weighted</small><strong>${pct(weighted)}</strong></div></div>
    <div class="tw" style="margin-top:16px"><table class="tbl tight"><thead><tr><th>Date</th>${history.map(entry => `<th class="c">${label(entry.date)}<small>H ${entry.period}</small></th>`).join("")}</tr></thead><tbody><tr><td><strong>${esc(s.name)}</strong></td>${history.map(entry => `<td class="c" style="${entry.status === "A" ? "color:var(--bad);font-weight:700;background:var(--bad-bg)" : ""}">${entry.status}</td>`).join("")}</tr></tbody></table></div>
    <p class="note">P is present and A is absent. Classes before faculty roll calls began are shown from the stored attendance record.</p>`;
};
Portal.actions.register = el => {
  const [code, component, key] = el.dataset.arg.split("|");
  const term = Portal.terms().find(item => item.key === key);
  const course = termCourses(Portal.student, term).find(item => item.code === code);
  Portal.openModal(`Attendance register: ${course.code} ${course[component]}`, `${Portal.registerHtml(course, component, term)}<div class="actions" style="margin-top:14px"><button class="btn" type="button" data-act="printRegister" data-arg="${el.dataset.arg}">Print register</button></div>`);
};
Portal.actions.printRegister = el => {
  const [code, component, key] = el.dataset.arg.split("|");
  const term = Portal.terms().find(item => item.key === key);
  const course = termCourses(Portal.student, term).find(item => item.code === code);
  Portal.printDocument(Portal.sheet({ title: "Course attendance register", subtitle: `${course.code} ${course.name}, ${course[component]}`, meta: Portal.studentMeta(term), body: Portal.registerHtml(course, component, term), signatures: ["Faculty", "Head of department"] }));
};
Portal.actions.printAttendance = () => {
  const pick = Portal.termPick.myAttendance || currentAcademicTerm();
  const term = Portal.terms().find(item => item.academicYear === pick.academicYear && item.semester === pick.semester) || Portal.currentTerm();
  const rows = Portal.attendanceRows(term);
  const body = `<table class="tbl"><thead><tr><th>Course</th><th>Class type</th><th class="r">Conducted</th><th class="r">Attended</th><th class="r">Absent</th><th class="r">Attendance</th></tr></thead><tbody>${rows.map(row => `<tr><td>${esc(row.course.code)} ${esc(row.course.shortName)}</td><td>${esc(row.course[row.component])}</td><td class="r">${row.summary.conducted}</td><td class="r">${row.summary.attended}</td><td class="r">${row.summary.absent}</td><td class="r">${pct(row.summary.percent)}</td></tr>`).join("")}</tbody></table>`;
  Portal.printDocument(Portal.sheet({ title: "Attendance statement", meta: Portal.studentMeta(term), body, signatures: ["Class advisor", "Head of department"] }));
};

/* ---------- Timetable and classrooms ---------- */

Portal.sections.mySchedule = () => {
  const today = ["Sunday", ...DAYS][new Date().getDay()].slice(0, 3);
  const rows = Object.entries(TIMETABLE).map(([day, slots]) => {
    const cells = Array(11).fill(null);
    slots.forEach(([start, end, code, comp, section, room]) => { cells[start - 1] = { span: end - start + 1, html: `${esc(code)} ${comp}<br><small>${esc(section)} &middot; ${esc(room)}</small>` }; for (let i = start; i < end; i++) cells[i] = "skip"; });
    return `<tr><td class="day">${esc(day.slice(0, 3))}${day.slice(0, 3) === today ? "<small>Today</small>" : ""}</td>${cells.map(cell => cell === "skip" ? "" : cell ? `<td class="cell" colspan="${cell.span}">${cell.html}</td>` : `<td class="off">-</td>`).join("")}</tr>`;
  }).join("");
  const term = Portal.currentTerm();
  byId("mySchedule").innerHTML = `${Portal.head("Timetable", `${term.semester} ${term.academicYear}, year ${term.yearOfStudy}. Letters show the class type: L lecture, T tutorial, P practical, S skill.`, `<button class="btn" type="button" data-act="printTimetable">Print</button>`)}
    <div class="panel"><div class="tw"><table class="tbl tt"><thead><tr><th>Day</th>${PERIOD_TIMES.map((time, i) => `<th>${i + 1}<small>${time}</small></th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div></div>
    <div class="panel" style="margin-top:18px"><h3>Your courses</h3><div class="facts" style="margin-top:10px">${termCourses(Portal.student, term).map(item => `<div><small>${esc(item.code)}</small><strong>${esc(item.shortName)}</strong></div>`).join("")}</div></div>`;
};
Portal.actions.printTimetable = () => {
  const term = Portal.currentTerm();
  Portal.printDocument(Portal.sheet({ title: "Class timetable", meta: Portal.studentMeta(term), body: byId("mySchedule").querySelector(".tw").outerHTML, signatures: ["Class advisor", "Head of department"] }));
};

Portal.sections.emptyRooms = () => {
  byId("emptyRooms").innerHTML = `${Portal.head("Empty classrooms", "Rooms with no class allotted in the chosen period. Use them for self-study or group work.", `<select id="studentRoomsDay" aria-label="Day"></select><select id="studentRoomsPeriod" aria-label="Period"></select>`)}<div class="panel" id="studentRoomsResult"></div>`;
  setupEmptyRoomViewer("studentRooms");
};

/* ---------- Assignments ---------- */

Portal.ui.assignmentFilter = { status: "All", subject: "all" };
Portal.sections.myAssignments = () => {
  const rows = Portal.assignmentRows();
  const filter = Portal.ui.assignmentFilter;
  const count = status => rows.filter(row => row.status === status).length;
  const visible = rows.filter(row => (filter.status === "All" || (filter.status === "Submitted" ? ["Submitted", "Graded"].includes(row.status) : row.status === filter.status)) && (filter.subject === "all" || row.record.subject === filter.subject));
  const courses = termCourses(Portal.student, Portal.currentTerm());
  byId("myAssignments").innerHTML = `${Portal.head("Assignments", "Work given in each course, with what is still pending.")}
    <div class="chips"><div class="chip">Pending<strong>${count("Pending")}</strong></div><div class="chip">Overdue<strong>${count("Overdue")}</strong></div><div class="chip">Submitted<strong>${count("Submitted") + count("Graded")}</strong></div></div>
    <div class="filters"><div class="seg" role="group" aria-label="Status">${["All", "Pending", "Overdue", "Submitted"].map(status => `<button type="button" class="${filter.status === status ? "on" : ""}" data-act="assignmentStatus" data-arg="${status}">${status}</button>`).join("")}</div>
      <label class="field-inline">Course<select id="assignmentSubject"><option value="all">All courses</option>${courses.map(course => `<option value="${esc(course.name)}" ${filter.subject === course.name ? "selected" : ""}>${esc(course.shortName)}</option>`).join("")}</select></label></div>
    <div class="panel"><div class="tw"><table class="tbl"><thead><tr><th>Course</th><th>Assignment</th><th>Due</th><th class="r">Marks</th><th>Status</th><th></th></tr></thead><tbody>
      ${visible.length ? visible.map(({ record, submission, status, config }) => `<tr><td><strong>${esc(config?.code || "")}</strong><small>${esc(config?.shortName || record.subject)}</small></td><td>${esc(record.title)}</td><td>${esc(fmtDate(record.dueDate))}</td><td class="r">${submission?.marks === undefined ? `\u2014 / ${Number(record.maxMarks)}` : `${Number(submission.marks)} / ${Number(record.maxMarks)}`}</td><td>${pill(status, status === "Overdue" ? "bad" : status === "Pending" ? "warn" : "ok")}</td><td>${submission ? "" : `<button class="btn sm" type="button" data-act="submitAssignment" data-arg="${esc(record.id)}">Mark submitted</button>`}</td></tr>`).join("") : `<tr><td colspan="6" class="empty">No assignments match this filter.</td></tr>`}
    </tbody></table></div></div>`;
  byId("assignmentSubject").addEventListener("change", event => { Portal.ui.assignmentFilter.subject = event.target.value; Portal.render("myAssignments"); });
};
Portal.actions.assignmentStatus = el => { Portal.ui.assignmentFilter.status = el.dataset.arg; Portal.render("myAssignments"); };
Portal.actions.submitAssignment = el => {
  Portal.update(record => { record.assignmentSubmissions = { ...record.assignmentSubmissions, [el.dataset.arg]: { status: "Submitted", submittedAt: new Date().toISOString() } }; });
  Portal.render("myAssignments");
  Portal.render("studentOverview");
  Portal.updateBadges();
};
