const KEYS = {
  users: "klu_users",
  students: "klu_students",
  session: "klu_session",
  grading: "klu_grading",
  timetable: "klu_timetable",
  assignments: "klu_assignments",
  exams: "klu_exams",
  announcements: "klu_announcements",
  activity: "klu_activity",
  publications: "klu_publications",
  gradeSubmissions: "klu_grade_submissions",
  settings: "klu_settings",
  courseRegSelections: "klu_course_reg_selections",
  classrooms: "klu_classrooms",
  roomAllotments: "klu_room_allotments",
  attendanceLog: "klu_attendance_log",
  smsOutbox: "klu_sms_outbox",
  registrationWindow: "klu_registration_window",
  checkinSessions: "klu_checkin_sessions",
  substitutionRequests: "klu_substitution_requests",
  reevalRequests: "klu_reeval_requests",
  qpOverrides: "klu_qp_overrides",
  theme: "klu_theme",
  bonusRequests: "klu_bonus_requests",
  lessonCoverage: "klu_lesson_coverage",
  coMatrix: "klu_co_matrix",
  weights: "klu_weights"
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIOD_TIMES = ["09:00-09:50", "09:50-10:40", "10:50-11:40", "11:40-12:30", "12:30-01:20", "01:20-02:10", "02:10-03:00", "03:10-04:00", "04:00-04:50", "05:00-05:50", "05:50-06:40"];
const COMPONENT_BASELINE = 24;
const ROOM_SEEDS = [
  ["C421A", "C Block", "Classroom", 70], ["C421B1", "C Block", "Classroom", 60], ["C421B2", "C Block", "Classroom", 60], ["C523", "C Block", "Classroom", 70],
  ["C219", "C Block", "Classroom", 70], ["C218", "C Block", "Classroom", 60], ["C018", "C Block", "Classroom", 80], ["C411", "C Block", "Classroom", 70],
  ["C511", "C Block", "Classroom", 70], ["C506", "C Block", "Classroom", 70], ["C617", "C Block", "Lab", 40], ["C623", "C Block", "Classroom", 70],
  ["M206", "M Block", "Classroom", 80], ["M304", "M Block", "Classroom", 80], ["R104A", "R Block", "Classroom", 60], ["R210A", "R Block", "Classroom", 60],
  ["S813", "S Block", "Classroom", 90], ["S818", "S Block", "Classroom", 90], ["S902", "S Block", "Seminar Hall", 120], ["SK011", "S Block", "Lab", 45]
];
// [day, period, room, course code, section]
const ALLOTMENT_SEEDS = [
  ["Monday", 1, "C421A", "25SC2006", "S-9"], ["Monday", 2, "C523", "25EC2206", "S-10"], ["Monday", 3, "C018", "25AD2102", "S-12"], ["Monday", 4, "C421B1", "25MT1306", "S-9"], ["Monday", 7, "C506", "25CS2102", "S-12"],
  ["Tuesday", 2, "C506", "25CS2102", "S-12"], ["Tuesday", 3, "C421A", "25SC2006", "S-9"], ["Tuesday", 4, "C523", "25EC2206", "S-10"],
  ["Wednesday", 1, "C421B1", "25MT1306", "S-9"], ["Wednesday", 2, "C018", "25AD2102", "S-12"], ["Wednesday", 4, "C617", "25CS2101", "S-7"], ["Wednesday", 5, "C617", "25CS2101", "S-7"],
  ["Thursday", 1, "C523", "25EC2206", "S-10"], ["Thursday", 3, "C421A", "25SC2006", "S-9"], ["Thursday", 7, "C421B1", "25MT1306", "S-9"],
  ["Friday", 1, "C018", "25AD2102", "S-12"], ["Friday", 2, "C421B1", "25MT1306", "S-9"], ["Friday", 3, "C506", "25CS2102", "S-12"]
];

const SUBJECT_CONFIG = [
  { code: "25SC2006", name: "OBJECT ORIENTED PROGRAMMING USING JAVA", shortName: "OOP Java", primary: "Lecture", secondary: "Skill", ltps: "3-0-0-2", credits: 4, offeredBy: "CSE", section: "S-9-MA", legacy: "Computer Science" },
  { code: "25EC2206", name: "EMBEDDED SYSTEM DESIGN AND IOT", shortName: "Embedded & IoT", primary: "Lecture", secondary: "Skill", ltps: "3-0-0-2", credits: 4, offeredBy: "ECE", section: "S-10-MA", legacy: "Physics" },
  { code: "25AD2102", name: "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING", shortName: "AI & ML", primary: "Lecture", secondary: "Practical", ltps: "3-0-2-0", credits: 4, offeredBy: "AI&DS", section: "S-12-MA", legacy: "Chemistry" },
  { code: "25CS2102", name: "OPERATING SYSTEMS", shortName: "Operating Systems", primary: "Lecture", secondary: "Practical", ltps: "3-0-2-0", credits: 4, offeredBy: "CSE", section: "S-12-MA", legacy: "English" },
  { code: "25CS2101", name: "FRONT END DEVELOPMENT FRAMEWORKS FOR WEB APPLICATIONS", shortName: "Front End", primary: "Practical", secondary: "Skill", ltps: "0-0-4-2", credits: 3, offeredBy: "CSE", section: "S-7-C", legacy: "Computer Science" },
  { code: "25MT1306", name: "MATHEMATICS FOR DATA SCIENCE AND ANALYTICS", shortName: "Maths for DS", primary: "Lecture", secondary: "Tutorial", ltps: "3-1-0-0", credits: 4, offeredBy: "FED", section: "S-9-MA", legacy: "Mathematics" }
];
const SUBJECTS = SUBJECT_CONFIG.map(subject => subject.name);
const CURRENT_SEMESTER = "Odd Sem";
const FACULTY_SEEDS = [
  { id: "usr_faculty_priya", name: "Dr. Priya Rao", email: "2500032294@kluniversity.in", username: "2500032294", password: "Faculty@KLU2026", mobile: "+91 98480 32294", mfaCode: "4821", role: "faculty", subjects: [SUBJECTS[0], SUBJECTS[3], SUBJECTS[4]] },
  { id: "usr_faculty_kiran", name: "Prof. Kiran Kumar", email: "2500032295@kluniversity.in", username: "2500032295", password: "Faculty@KLU2026", mobile: "+91 98480 32295", mfaCode: "5732", role: "faculty", subjects: [SUBJECTS[1], SUBJECTS[2], SUBJECTS[5]] }
];
const ADDITIONAL_STUDENTS = [
  ["stu_rohan", "Rohan Mehta", "2500032289@kluniversity.in", "IT"],
  ["stu_sneha", "Sneha Iyer", "2500032290@kluniversity.in", "CSE"],
  ["stu_aditya", "Aditya Verma", "2500032291@kluniversity.in", "ECE"],
  ["stu_meera", "Meera Das", "2500032292@kluniversity.in", "AI/DS"],
  ["stu_jashwanth", "N. Jashwanth", "2500032228@kluniversity.in", "CSE"]
];

const ACADEMIC_SEEDS = {
  timetable: [
    { id: "slot_mon_1", day: "Monday", start: "09:00", end: "10:00", subject: SUBJECTS[0], room: "C-204" },
    { id: "slot_mon_2", day: "Monday", start: "11:00", end: "12:00", subject: SUBJECTS[1], room: "E-112" },
    { id: "slot_tue_1", day: "Tuesday", start: "10:00", end: "11:00", subject: SUBJECTS[2], room: "C-310" },
    { id: "slot_wed_1", day: "Wednesday", start: "09:00", end: "10:00", subject: SUBJECTS[3], room: "C-208" },
    { id: "slot_thu_1", day: "Thursday", start: "13:30", end: "15:30", subject: SUBJECTS[4], room: "Lab-5" },
    { id: "slot_fri_1", day: "Friday", start: "10:00", end: "11:00", subject: SUBJECTS[5], room: "M-106" }
  ],
  assignments: [
    { id: "assignment_java", subject: SUBJECTS[0], title: "Collections and exception handling", dueDate: "2026-10-02", maxMarks: 20 },
    { id: "assignment_ai", subject: SUBJECTS[2], title: "Classification model worksheet", dueDate: "2026-10-06", maxMarks: 25 },
    { id: "assignment_frontend", subject: SUBJECTS[4], title: "Responsive dashboard exercise", dueDate: "2026-10-10", maxMarks: 30 }
  ],
  exams: [
    { id: "exam_mid_java", subject: SUBJECTS[0], type: "Mid 1", date: "2026-10-14", time: "09:30", room: "R-210" },
    { id: "exam_mid_iot", subject: SUBJECTS[1], type: "Mid 1", date: "2026-10-16", time: "09:30", room: "R-212" },
    { id: "exam_mid_ai", subject: SUBJECTS[2], type: "Mid 1", date: "2026-10-18", time: "13:30", room: "R-310" }
  ],
  announcements: [
    { id: "notice_registration", title: "Course registration window", message: "Review your subjects before course registration closes.", audience: "student", date: "2026-09-20", author: "Academic Office" },
    { id: "notice_midterm", title: "Mid-term preparation", message: "Faculty have published the first mid-term assessment schedule.", audience: "all", date: "2026-09-18", author: "Examination Cell" }
  ]
};

function subjectConfigFor(name) {
  return SUBJECT_CONFIG.find(subject => subject.name === name);
}

function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (_) {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function seedData() {
  if (!localStorage.getItem(KEYS.users)) {
    writeStore(KEYS.users, [
      { id: "usr_admin", name: "Administrator", email: "admin@kluniversity.in", username: "admin_klu", password: "Admin@KLU#2026", mobile: "+91 98480 00001", mfaCode: "9046", role: "admin" },
      { id: "usr_santhosh", name: "Pujari Santhosh", email: "2500032283@kluniversity.in", username: "2500032283", password: "2500032283", role: "student", studentId: "stu_santhosh" },
      { id: "usr_arjun", name: "Arjun Reddy", email: "2500032284@kluniversity.in", username: "2500032284", password: "2500032284", role: "student", studentId: "stu_arjun" },
      { id: "usr_ananya", name: "Ananya Sharma", email: "2500032285@kluniversity.in", username: "2500032285", password: "2500032285", role: "student", studentId: "stu_ananya" },
      { id: "usr_fatima", name: "Fatima Khan", email: "2500032286@kluniversity.in", username: "2500032286", password: "2500032286", role: "student", studentId: "stu_fatima" }
    ]);
  }
  if (!localStorage.getItem(KEYS.students)) {
    writeStore(KEYS.students, [
      { id: "stu_santhosh", name: "Pujari Santhosh", email: "2500032283@kluniversity.in", universityId: "2500032283", department: "CSE", attendance: 88, marks: { "OBJECT ORIENTED PROGRAMMING USING JAVA": 92, "EMBEDDED SYSTEM DESIGN AND IOT": 88, "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": 82, "OPERATING SYSTEMS": 90, "FRONT END DEVELOPMENT FRAMEWORKS FOR WEB APPLICATIONS": 95, "MATHEMATICS FOR DATA SCIENCE AND ANALYTICS": 81 }, totalMarks: { "OBJECT ORIENTED PROGRAMMING USING JAVA": 100, "EMBEDDED SYSTEM DESIGN AND IOT": 100, "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": 100, "OPERATING SYSTEMS": 100, "FRONT END DEVELOPMENT FRAMEWORKS FOR WEB APPLICATIONS": 100, "MATHEMATICS FOR DATA SCIENCE AND ANALYTICS": 100 }, remarks: "Santhosh demonstrates outstanding analytical and practical software engineering capability." },
      { id: "stu_arjun", name: "Arjun Reddy", email: "2500032284@kluniversity.in", universityId: "2500032284", department: "CSE", attendance: 92, marks: { "Mathematics": 88, "Physics": 84, "Chemistry": 79, "English": 91, "Computer Science": 95 }, totalMarks: { "Mathematics": 100, "Physics": 100, "Chemistry": 100, "English": 100, "Computer Science": 100 }, remarks: "Arjun shows strong analytical ability and consistent effort. He should revise organic chemistry concepts before the next assessment." },
      { id: "stu_ananya", name: "Ananya Sharma", email: "2500032285@kluniversity.in", universityId: "2500032285", department: "ECE", attendance: 96, marks: { "Mathematics": 94, "Physics": 91, "Chemistry": 93, "English": 89, "Computer Science": 97 }, totalMarks: { "Mathematics": 100, "Physics": 100, "Chemistry": 100, "English": 100, "Computer Science": 100 }, remarks: "Ananya performs consistently across subjects and participates actively in class discussions. Excellent progress this term." },
      { id: "stu_fatima", name: "Fatima Khan", email: "2500032286@kluniversity.in", universityId: "2500032286", department: "CSIT", attendance: 88, marks: { "Mathematics": 76, "Physics": 81, "Chemistry": 85, "English": 92, "Computer Science": 87 }, totalMarks: { "Mathematics": 100, "Physics": 100, "Chemistry": 100, "English": 100, "Computer Science": 100 }, remarks: "Fatima communicates clearly and has improved in science subjects. Regular mathematics practice will strengthen her overall score." },
      { id: "stu_vikram", name: "Vikram Joshi", email: "2500032287@kluniversity.in", universityId: "2500032287", department: "AIDS", attendance: 83, marks: { "Mathematics": 69, "Physics": 74, "Chemistry": 71, "English": 78, "Computer Science": 82 }, totalMarks: { "Mathematics": 100, "Physics": 100, "Chemistry": 100, "English": 100, "Computer Science": 100 }, remarks: "Vikram has made steady progress. More regular attendance and timely assignment submission will help him improve further." },
      { id: "stu_kavya", name: "Kavya Nair", email: "2500032288@kluniversity.in", universityId: "2500032288", department: "CSE", attendance: 94, marks: { "Mathematics": 86, "Physics": 89, "Chemistry": 90, "English": 88, "Computer Science": 93 }, totalMarks: { "Mathematics": 100, "Physics": 100, "Chemistry": 100, "English": 100, "Computer Science": 100 }, remarks: "Kavya is attentive, well prepared, and demonstrates a sound understanding of all subjects." }
    ]);
    const users = readStore(KEYS.users, []);
    [
      ["usr_vikram", "Vikram Joshi", "2500032287@kluniversity.in", "stu_vikram"],
      ["usr_kavya", "Kavya Nair", "2500032288@kluniversity.in", "stu_kavya"]
    ].forEach(([id, name, email, studentId]) => users.push({ id, name, email, username: email.split("@")[0], password: email.split("@")[0], role: "student", studentId }));
    writeStore(KEYS.users, users);
  }
  if (!localStorage.getItem(KEYS.grading)) {
    writeStore(KEYS.grading, { aPlus: 90, a: 80, b: 70, c: 60, d: 50 });
  }
  Object.entries(ACADEMIC_SEEDS).forEach(([key, records]) => {
    if (!localStorage.getItem(KEYS[key])) writeStore(KEYS[key], records);
  });
  if (!localStorage.getItem(KEYS.classrooms)) writeStore(KEYS.classrooms, ROOM_SEEDS.map(([id, building, type, capacity]) => ({ id, building, type, capacity })));
  if (!localStorage.getItem(KEYS.roomAllotments)) writeStore(KEYS.roomAllotments, ALLOTMENT_SEEDS.map(([day, period, room, courseCode, section], i) => ({ id: `allot_seed_${i}`, day, period, room, courseCode, section })));
  if (!localStorage.getItem(KEYS.attendanceLog)) writeStore(KEYS.attendanceLog, []);
  if (!localStorage.getItem(KEYS.smsOutbox)) writeStore(KEYS.smsOutbox, []);
  if (!localStorage.getItem(KEYS.registrationWindow)) writeStore(KEYS.registrationWindow, { academicYear: "2026-2027", semester: "Odd Sem", opens: "2026-07-01", closes: "2026-07-15", notice: "Course registration for the Odd Semester 2026-2027." });
  if (!localStorage.getItem(KEYS.activity)) writeStore(KEYS.activity, []);
  if (!localStorage.getItem(KEYS.publications)) writeStore(KEYS.publications, []);
  if (!localStorage.getItem(KEYS.gradeSubmissions)) writeStore(KEYS.gradeSubmissions, []);
  if (!localStorage.getItem(KEYS.settings)) writeStore(KEYS.settings, { schoolName: "KL University", reportSubtitle: "Academic Progress Report", contact: "Vaddeswaram, Andhra Pradesh", academicYear: "2026-2027", semesterName: CURRENT_SEMESTER, semesterStart: "2026-07-01", semesterEnd: "2026-12-15" });
}

function getSession() { return readStore(KEYS.session, null); }
function getStudents(includeArchived = false) {
  const students = readStore(KEYS.students, []);
  return includeArchived ? students : students.filter(student => !student.archived);
}
function getGrading() { return readStore(KEYS.grading, { aPlus: 90, a: 80, b: 70, c: 60, d: 50 }); }

function logActivity(action, actor = getSession()?.name || "System") {
  const activity = readStore(KEYS.activity, []);
  activity.unshift({ id: makeId("activity"), action, actor, timestamp: new Date().toISOString() });
  writeStore(KEYS.activity, activity.slice(0, 60));
}

function downloadFile(contents, filename, type) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([contents], { type }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function boundedPercent(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
}

function isValidPercentage(value) {
  return String(value).trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100;
}

function hasCompleteGrade(grade) {
  return ["assignment", "alm", "quiz", "lab", "mid1", "mid2", "semEnd"].every(component => isValidPercentage(grade?.[component]));
}

function internalScoreFor(grade = {}) {
  const base = ["assignment", "alm", "quiz", "lab"].reduce((sum, component) => sum + boundedPercent(grade[component]), 0) / 4;
  return Math.min(100, base + Number(grade.bonus || 0));
}

function finalScoreFor(grade = {}) {
  const weights = getWeights();
  return internalScoreFor(grade) * (weights.internal / 100) + boundedPercent(grade.mid1) * (weights.mid1 / 100) + boundedPercent(grade.mid2) * (weights.mid2 / 100) + boundedPercent(grade.semEnd) * (weights.semEnd / 100);
}

function seededGrade(base, subjectIndex) {
  const clamp = value => Math.max(0, Math.min(100, value));
  return {
    assignment: clamp(base + 4 - subjectIndex),
    alm: clamp(base + 1),
    quiz: clamp(base - 3 + subjectIndex),
    lab: clamp(base + 3),
    mid1: clamp(base - 5),
    mid2: clamp(base),
    semEnd: clamp(base + 2)
  };
}

function ensureAcademicData() {
  const users = readStore(KEYS.users, []);
  FACULTY_SEEDS.forEach(faculty => {
    if (!users.some(user => user.email === faculty.email)) users.push({ ...faculty });
  });
  const students = getStudents(true);
  ADDITIONAL_STUDENTS.forEach(([id, name, email, department], index) => {
    if (students.some(student => student.email === email)) return;
    const base = 72 + index * 3;
    students.push({
      id, name, email, universityId: email.split("@")[0], department, semester: CURRENT_SEMESTER,
      enrolledSubjects: [...SUBJECTS], grades: Object.fromEntries(SUBJECTS.map((subject, subjectIndex) => [subject, seededGrade(base, subjectIndex)])),
      attendance: 85, marks: Object.fromEntries(SUBJECTS.map(subject => [subject, 0])), totalMarks: Object.fromEntries(SUBJECTS.map(subject => [subject, 100])), remarks: "Academic record is in progress."
    });
    users.push({ id: `usr_${id}`, name, email, password: email.split("@")[0], role: "student", studentId: id });
  });
  students.forEach((student, studentIndex) => {
    student.semester ||= CURRENT_SEMESTER;
    student.enrolledSubjects = student.enrolledSubjects?.filter(subject => SUBJECTS.includes(subject)) || [...SUBJECTS];
    student.grades ||= {};
    student.enrolledSubjects.forEach((subject, subjectIndex) => {
      if (!student.grades[subject]) student.grades[subject] = seededGrade(70 + ((studentIndex * 4 + subjectIndex * 3) % 24), subjectIndex);
    });
  });
  writeStore(KEYS.users, users);
  writeStore(KEYS.students, students);
}

function migrateUserPasswords() {
  const users = readStore(KEYS.users, []);
  let updated = false;

  // 1. Admin gets its own username and password; a changed password is kept
  let admin = users.find(u => u.role === "admin" || u.email === "admin@kluniversity.in");
  if (admin) {
    admin.role = "admin";
    admin.username ||= "admin_klu";
    if (!admin.password || admin.password === "2500032283") admin.password = "Admin@KLU#2026";
    if (admin.email === "2500032283@kluniversity.in") admin.email = "admin@kluniversity.in";
    admin.mobile ||= "+91 98480 00001";
    admin.mfaCode ||= "9046";
    delete admin.studentId;
    updated = true;
  } else {
    users.push({ id: "usr_admin", name: "Administrator", email: "admin@kluniversity.in", username: "admin_klu", password: "Admin@KLU#2026", mobile: "+91 98480 00001", mfaCode: "9046", role: "admin" });
    updated = true;
  }

  // 2. Faculty must not share a password with a student ID; a changed password is kept
  users.filter(u => u.role === "faculty").forEach(f => {
    f.mfaCode ||= String(1000 + Math.abs([...f.email].reduce((sum, ch) => sum * 31 + ch.charCodeAt(0), 0)) % 9000);
    f.mobile ||= `+91 98480 ${f.email.split("@")[0].slice(-5)}`;
    if (!f.password || f.password === f.email.split("@")[0]) {
      f.password = "Faculty@KLU2026";
    }
    f.username ||= f.email.split("@")[0];
    updated = true;
  });

  // 3. Ensure student Pujari Santhosh (2500032283) has a dedicated student account
  let santhosh = users.find(u => u.studentId === "stu_santhosh" || (u.role === "student" && u.email === "2500032283@kluniversity.in"));
  if (!santhosh) {
    users.push({
      id: "usr_santhosh",
      name: "Pujari Santhosh",
      email: "2500032283@kluniversity.in",
      username: "2500032283",
      password: "2500032283",
      role: "student",
      studentId: "stu_santhosh"
    });
    updated = true;
  } else {
    santhosh.username = "2500032283";
    santhosh.password = santhosh.password || "2500032283";
    santhosh.studentId = "stu_santhosh";
  }

  // 4. Ensure students have default passwords
  users.filter(u => u.role === "student").forEach(s => {
    s.username = s.username || s.email.split("@")[0];
    s.password = s.password || s.email.split("@")[0];
  });

  if (updated || JSON.stringify(users) !== JSON.stringify(readStore(KEYS.users, []))) {
    writeStore(KEYS.users, users);
  }

  // Also ensure stu_santhosh is in students list
  const students = getStudents(true);
  if (!students.some(s => s.id === "stu_santhosh")) {
    students.unshift({
      id: "stu_santhosh",
      name: "Pujari Santhosh",
      email: "2500032283@kluniversity.in",
      universityId: "2500032283",
      department: "CSE",
      attendance: 88,
      semester: CURRENT_SEMESTER,
      enrolledSubjects: [...SUBJECTS],
      marks: Object.fromEntries(SUBJECTS.map(subject => [subject, 90])),
      totalMarks: Object.fromEntries(SUBJECTS.map(subject => [subject, 100])),
      remarks: "Santhosh demonstrates outstanding analytical and practical software engineering capability.",
      clearance: {
        tuition: "Cleared",
        examFee: "Cleared",
        library: "Cleared",
        department: "Cleared",
        overall: "Eligible",
        note: "All tuition, exam fees, and library dues verified. Authorized for examination hall ticket."
      }
    });
    writeStore(KEYS.students, students);
  }
}

function migrateCorrectedUniversityIds() {
  const oldId = "2500032293";
  const newId = "2500032228";
  const email = `${newId}@kluniversity.in`;
  const students = getStudents(true);
  const student = students.find(item => item.id === "stu_jashwanth");
  if (student) {
    student.universityId = newId;
    student.email = email;
    writeStore(KEYS.students, students);
  }
  const users = readStore(KEYS.users, []);
  let user = users.find(item => item.studentId === "stu_jashwanth");
  if (!user && student) {
    user = { id: "usr_stu_jashwanth", name: student.name, role: "student", studentId: student.id };
    users.push(user);
  }
  if (user) {
    user.email = email;
    if (!user.password || user.password === oldId) user.password = newId;
    writeStore(KEYS.users, users);
  }
}

function migrateStudentData() {
  const departments = ["CSE", "IT", "ME", "CE", "ECE", "EEE", "ChE", "BT", "AE", "AI/DS"];
  const departmentAliases = { CSIT: "IT", AIDS: "AI/DS" };
  const students = getStudents(true);
  const migrated = students.map((student, index) => {
    const previousAttendance = boundedPercent(student.attendance);
    const subjectAttendance = Object.fromEntries(SUBJECTS.map(subject => {
      const config = subjectConfigFor(subject);
      const record = student.subjectAttendance?.[subject] || student.subjectAttendance?.[config.legacy];
      const primary = record?.primary ?? record?.lecture;
      const secondary = record?.secondary ?? record?.skill;
      return [subject, {
        primary: primary === undefined ? Math.round(previousAttendance) : boundedPercent(primary),
        secondary: secondary === undefined ? Math.round(previousAttendance) : boundedPercent(student.attendanceModel ? secondary : Number(secondary) * 4)
      }];
    }));
    return {
      ...student,
      universityId: student.universityId || student.email?.split("@")[0] || student.roll,
      department: departmentAliases[student.department] || student.department || departments[index % departments.length],
      batch: student.batch || "2025-2029",
      section: student.section || `${departmentAliases[student.department] || student.department || departments[index % departments.length]}-1`,
      attendance: overallAttendanceFor({ ...student, subjectAttendance }),
      attendanceModel: "weighted_subject_types",
      subjectAttendance,
      phone: student.phone || `+91 80000 ${String(student.universityId || student.email?.split("@")[0] || "").slice(-5)}`,
      parentName: student.parentName || `Parent of ${student.name}`,
      parentContact: student.parentContact || `+91 90000 ${String(student.universityId || student.email?.split("@")[0] || "").slice(-5)}`,
      marks: Object.fromEntries(SUBJECTS.map(subject => {
        const legacy = subjectConfigFor(subject).legacy;
        return [subject, Number(student.marks?.[subject] ?? student.marks?.[legacy]) || 0];
      })),
      totalMarks: Object.fromEntries(SUBJECTS.map(subject => {
        const legacy = subjectConfigFor(subject).legacy;
        return [subject, Number(student.totalMarks?.[subject] ?? student.totalMarks?.[legacy]) || 100];
      })),
      clearance: student.clearance || {
        tuition: "Cleared",
        examFee: "Cleared",
        library: "Cleared",
        department: "Cleared",
        overall: "Eligible",
        note: "All tuition, exam fees, and library dues verified. Authorized for examination hall ticket."
      }
    };
  });
  if (JSON.stringify(students) !== JSON.stringify(migrated)) writeStore(KEYS.students, migrated);
}

function baselineAttendancePercent(student, subject) {
  const record = student?.subjectAttendance?.[subject];
  if (record) return boundedPercent(record.primary) * 0.75 + boundedPercent(record.secondary) * 0.25;
  return boundedPercent(student?.attendance);
}

function loggedAttendanceCounts(studentId, subject, component = null) {
  const counts = { conducted: 0, attended: 0 };
  if (!studentId) return counts;
  readStore(KEYS.attendanceLog, []).forEach(record => {
    if (record.subject !== subject || !(studentId in record.entries)) return;
    if (component && (record.component || "primary") !== component) return;
    counts.conducted += 1;
    if (record.entries[studentId] === "P") counts.attended += 1;
  });
  return counts;
}

// Stored percentages act as a 24-class baseline per class type; faculty roll calls are added on top.
function componentAttendanceSummary(student, subject, component) {
  const record = student?.subjectAttendance?.[subject];
  const base = record ? boundedPercent(record[component]) : boundedPercent(student?.attendance);
  const log = loggedAttendanceCounts(student?.id, subject, component);
  const conducted = COMPONENT_BASELINE + log.conducted;
  const attended = Math.round(COMPONENT_BASELINE * base / 100) + log.attended;
  return { conducted, attended, absent: conducted - attended, percent: attended / conducted * 100 };
}

function subjectAttendanceFor(student, subject) {
  const base = baselineAttendancePercent(student, subject);
  if (!loggedAttendanceCounts(student?.id, subject).conducted) return base;
  return componentAttendanceSummary(student, subject, "primary").percent * 0.75 + componentAttendanceSummary(student, subject, "secondary").percent * 0.25;
}

function attendanceSummaryFor(student, subject) {
  const parts = ["primary", "secondary"].map(component => componentAttendanceSummary(student, subject, component));
  const conducted = parts[0].conducted + parts[1].conducted;
  const attended = parts[0].attended + parts[1].attended;
  return { conducted, attended, absent: conducted - attended, percent: subjectAttendanceFor(student, subject) };
}

function overallAttendanceFor(student) {
  const subjects = student?.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS;
  const percentages = subjects.map(subject => subjectAttendanceFor(student, subject));
  return percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length;
}

// Detained = overall attendance below 75%; Failed = any subject below the D threshold.
function studentOutcome(student, subjects = student?.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS) {
  const passMark = getGrading().d;
  const count = subjects.length || 1;
  const failedSubjects = subjects.filter(subject => subjectPercentage(student, subject) < passMark);
  const attendance = subjects.reduce((sum, subject) => sum + subjectAttendanceFor(student, subject), 0) / count;
  const average = subjects.reduce((sum, subject) => sum + subjectPercentage(student, subject), 0) / count;
  const status = attendance < 75 ? "Detained" : failedSubjects.length ? "Failed" : "Passed";
  return { status, failedSubjects, attendance, average };
}

function outcomeClass(status) {
  return status === "Passed" ? "good" : status === "Failed" ? "bad" : "warn";
}

// Disciplinary/enrollment status shown in the Students page - distinct from the academic
// Passed/Failed/Detained outcome above. Suspended is an admin-set flag; Detained falls back to
// the same attendance rule; everyone else is Active.
function studentStatusLabel(student) {
  if (student?.suspended) return "Suspended";
  if (Number(student?.attendance) < 75) return "Detained";
  return "Active";
}

function studentStatusClass(status) {
  return status === "Active" ? "good" : status === "Detained" ? "warn" : "bad";
}

// A faculty member's department(s), inferred from the departments offering their assigned subjects.
function facultyDepartments(user) {
  return [...new Set((user?.subjects || []).map(subject => subjectConfigFor(subject)?.offeredBy).filter(Boolean))];
}

function facultyForCourse(courseCode) {
  const config = SUBJECT_CONFIG.find(item => item.code === courseCode);
  if (!config) return null;
  return readStore(KEYS.users, []).find(user => user.role === "faculty" && !user.archived && user.subjects?.includes(config.name)) || null;
}

// Where a faculty member is right now: the room they're allotted to for the current day/period,
// if their subject has a class scheduled, otherwise null (meaning free).
function facultyCurrentLocation(user) {
  const { day, period } = currentDayAndPeriod();
  const codes = new Set((user?.subjects || []).map(subject => subjectConfigFor(subject)?.code).filter(Boolean));
  const allotment = readStore(KEYS.roomAllotments, []).find(item => item.day === day && Number(item.period) === period && codes.has(item.courseCode));
  return allotment ? { room: allotment.room, courseCode: allotment.courseCode, day, period } : null;
}

// Exam/assessment weightage - configurable via the Academic Setup page, with the original
// hardcoded split (Internal 40 / Mid1 15 / Mid2 15 / Sem End 30) as the default.
function getWeights() {
  return readStore(KEYS.weights, { internal: 40, mid1: 15, mid2: 15, semEnd: 30 });
}

function currentDayAndPeriod() {
  const now = new Date();
  const day = ["Sunday", ...DAYS][now.getDay()];
  const minutes = now.getHours() * 60 + now.getMinutes();
  const starts = PERIOD_TIMES.map(time => {
    const [hour, minute] = time.split("-")[0].split(":").map(Number);
    return (hour < 8 ? hour + 12 : hour) * 60 + minute;
  });
  const index = starts.reduce((found, start, i) => (start <= minutes ? i : found), 0);
  return { day: DAYS.includes(day) ? day : "Monday", period: minutes > 18 * 60 + 40 ? 1 : index + 1 };
}

function emptyRoomsFor(day, period) {
  const taken = new Set(readStore(KEYS.roomAllotments, []).filter(item => item.day === day && Number(item.period) === Number(period)).map(item => item.room));
  return readStore(KEYS.classrooms, []).filter(room => !taken.has(room.id));
}

// Fills the day/period selects and keeps the free-room table in sync; returns the render function.
function setupEmptyRoomViewer(prefix) {
  const daySelect = document.getElementById(`${prefix}Day`);
  const periodSelect = document.getElementById(`${prefix}Period`);
  const output = document.getElementById(`${prefix}Result`);
  if (!daySelect || !periodSelect || !output) return () => {};
  const now = currentDayAndPeriod();
  daySelect.innerHTML = DAYS.map(day => `<option ${day === now.day ? "selected" : ""}>${day}</option>`).join("");
  periodSelect.innerHTML = PERIOD_TIMES.map((time, i) => `<option value="${i + 1}" ${i + 1 === now.period ? "selected" : ""}>Period ${i + 1} (${time})</option>`).join("");
  const render = () => {
    const day = daySelect.value;
    const period = Number(periodSelect.value);
    const rooms = readStore(KEYS.classrooms, []);
    const free = emptyRoomsFor(day, period);
    const busy = readStore(KEYS.roomAllotments, []).filter(item => item.day === day && Number(item.period) === period);
    output.innerHTML = `<p class="room-summary"><strong>${free.length}</strong> of ${rooms.length} rooms are empty on ${escapeHtml(day)}, period ${period}.</p>
      <div class="room-grid">${free.length ? free.map(room => `<article class="room-card free"><strong>${escapeHtml(room.id)}</strong><span>${escapeHtml(room.building)} · ${escapeHtml(room.type)}</span><small>Capacity ${Number(room.capacity)}</small></article>`).join("") : `<div class="empty-state">Every room is occupied in this period.</div>`}</div>
      ${busy.length ? `<details class="room-busy"><summary>${busy.length} occupied room${busy.length === 1 ? "" : "s"}</summary><div class="table-wrap"><table><thead><tr><th>Room</th><th>Course</th><th>Section</th></tr></thead><tbody>${busy.map(item => `<tr><td><strong>${escapeHtml(item.room)}</strong></td><td>${escapeHtml(item.courseCode)}</td><td>${escapeHtml(item.section)}</td></tr>`).join("")}</tbody></table></div></details>` : ""}`;
  };
  daySelect.addEventListener("change", render);
  periodSelect.addEventListener("change", render);
  render();
  return render;
}

function todayIso() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function getRegistrationWindow() {
  return readStore(KEYS.registrationWindow, null);
}

function registrationWindowState(window_ = getRegistrationWindow()) {
  if (!window_) return "closed";
  const today = todayIso();
  return today < window_.opens ? "upcoming" : today > window_.closes ? "closed" : "open";
}

function dayNameFromDate(isoDate) {
  return ["Sunday", ...DAYS][new Date(`${isoDate}T00:00:00`).getDay()];
}

// A faculty member is "busy" in a period if one of their subjects has a room allotment there.
function facultyBusyAt(day, period) {
  const codes = new Set(readStore(KEYS.roomAllotments, []).filter(item => item.day === day && Number(item.period) === Number(period)).map(item => item.courseCode));
  const busySubjects = new Set(SUBJECT_CONFIG.filter(config => codes.has(config.code)).map(config => config.name));
  return new Set(readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived && user.subjects?.some(subject => busySubjects.has(subject))).map(user => user.id));
}

function freeFacultyAt(day, period, excludeId = "") {
  const busy = facultyBusyAt(day, period);
  return readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived && user.id !== excludeId && !busy.has(user.id));
}

// No SMS gateway exists in a browser-only build, so messages are written to a local outbox.
function sendAbsenceAlerts(student, subject, date, period, facultyName, componentLabel = "") {
  const config = subjectConfigFor(subject);
  const percent = subjectAttendanceFor(student, subject);
  const text = `KL University: ${student.name} (${student.universityId}) was marked ABSENT in ${config.code} ${config.shortName}${componentLabel ? ` (${componentLabel})` : ""} on ${date}, period ${period}. Attendance is now ${percent.toFixed(1)}%. - ${facultyName}`;
  const sentAt = new Date().toISOString();
  const outbox = readStore(KEYS.smsOutbox, []);
  [["Parent", student.parentName, student.parentContact], ["Student", student.name, student.phone]].forEach(([recipientType, recipientName, to]) => {
    outbox.unshift({ id: makeId("sms"), studentId: student.id, recipientType, recipientName, to: to || "", message: text, sentAt, subject, date, status: to ? "Delivered (simulated)" : "Failed - no number on record" });
  });
  writeStore(KEYS.smsOutbox, outbox.slice(0, 300));
}

function subjectPercentage(student, subject) {
  if (student?.grades?.[subject]) return finalScoreFor(student.grades[subject]);
  const obtained = Number(student?.marks?.[subject]) || 0;
  const total = Number(student?.totalMarks?.[subject]) || 100;
  return total > 0 ? obtained / total * 100 : 0;
}

function averageFor(student) {
  const subjects = student?.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS;
  return subjects.reduce((sum, subject) => sum + subjectPercentage(student, subject), 0) / subjects.length;
}

function gradeFor(mark) {
  const grade = getGrading();
  if (mark >= grade.aPlus) return "A+";
  if (mark >= grade.a) return "A";
  if (mark >= grade.b) return "B";
  if (mark >= grade.c) return "C";
  if (mark >= grade.d) return "D";
  return "F";
}

function attendanceClass(value) {
  if (value >= 85) return "good";
  if (value >= 75) return "warn";
  return "bad";
}

function getAcademicRecords(type) {
  return readStore(KEYS[type], []);
}

function subjectOptions(subjects = SUBJECTS) {
  return subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subjectConfigFor(subject)?.shortName || subject)}</option>`).join("");
}

function formatAcademicDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function timetableHtml(subjects, editable = false, day = "") {
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const slots = getAcademicRecords("timetable").filter(slot => subjects.includes(slot.subject) && (!day || slot.day === day)).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.start.localeCompare(b.start));
  if (!slots.length) return `<div class="empty-state">No timetable slots are available.</div>`;
  return `<div class="timeline-list">${slots.map(slot => `<article class="timeline-item"><div class="timeline-time"><strong>${escapeHtml(slot.day)}</strong><span>${escapeHtml(slot.start)}–${escapeHtml(slot.end)}</span></div><div><strong>${escapeHtml(subjectConfigFor(slot.subject)?.shortName || slot.subject)}</strong><span>${escapeHtml(slot.room)}</span></div>${editable ? `<button type="button" class="icon-action" data-delete-slot="${escapeHtml(slot.id)}" aria-label="Delete timetable slot">×</button>` : ""}</article>`).join("")}</div>`;
}

function examScheduleHtml(subjects, editable = false) {
  const exams = getAcademicRecords("exams").filter(exam => subjects.includes(exam.subject)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  if (!exams.length) return `<div class="empty-state">No examinations are scheduled.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Assessment</th><th>Subject</th><th>Time</th><th>Room</th>${editable ? "<th>Action</th>" : ""}</tr></thead><tbody>${exams.map(exam => `<tr><td>${formatAcademicDate(exam.date)}</td><td>${escapeHtml(exam.type)}</td><td><strong>${escapeHtml(subjectConfigFor(exam.subject)?.shortName || exam.subject)}</strong></td><td>${escapeHtml(exam.time)}</td><td>${escapeHtml(exam.room)}</td>${editable ? `<td><button type="button" class="btn danger small" data-delete-exam="${escapeHtml(exam.id)}">Delete</button></td>` : ""}</tr>`).join("")}</tbody></table></div>`;
}

function announcementHtml(announcements, editable = false) {
  if (!announcements.length) return `<div class="panel empty-state">No announcements are available.</div>`;
  return announcements.slice().sort((a, b) => b.date.localeCompare(a.date)).map(notice => `<article class="notice-item"><div class="notice-date"><strong>${new Date(`${notice.date}T00:00:00`).getDate()}</strong><span>${new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(`${notice.date}T00:00:00`))}</span></div><div><div class="notice-meta">${escapeHtml(notice.author)} · ${escapeHtml(notice.subject ? subjectConfigFor(notice.subject)?.shortName || notice.subject : notice.audience === "all" ? "Everyone" : notice.audience)}</div><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(notice.message)}</p></div>${editable ? `<button type="button" class="icon-action" data-delete-announcement="${escapeHtml(notice.id)}" aria-label="Delete announcement">×</button>` : ""}</article>`).join("");
}

function assignmentHtml(assignments, student = null, editable = false) {
  if (!assignments.length) return `<div class="panel empty-state">No assignments are available.</div>`;
  return assignments.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(assignment => {
    const submission = student?.assignmentSubmissions?.[assignment.id];
    const status = submission?.status || (assignment.dueDate < new Date().toISOString().slice(0, 10) ? "Overdue" : "Pending");
    return `<article class="assignment-item"><div><span class="subject-tag">${escapeHtml(subjectConfigFor(assignment.subject)?.shortName || assignment.subject)}</span><h3>${escapeHtml(assignment.title)}</h3><p>Due ${formatAcademicDate(assignment.dueDate)} · ${Number(assignment.maxMarks)} marks</p></div>${student ? `<div class="assignment-result"><span class="status-pill ${status === "Submitted" ? "good" : status === "Overdue" ? "bad" : "warn"}">${escapeHtml(status)}</span><strong>${submission?.marks === undefined ? "Not graded" : `${Number(submission.marks)} / ${Number(assignment.maxMarks)}`}</strong>${status !== "Submitted" ? `<button type="button" class="btn secondary small" data-submit-assignment="${escapeHtml(assignment.id)}">Mark Submitted</button>` : ""}</div>` : editable ? `<button type="button" class="icon-action" data-delete-assignment="${escapeHtml(assignment.id)}" aria-label="Delete assignment">×</button>` : ""}</article>`;
  }).join("");
}

function showMessage(element, text, success = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("success", success);
}

function redirectForRole(role) {
  window.location.href = role === "admin" ? "../admin/admin.html" : role === "faculty" ? "../faculty/faculty.html" : "../user/student.html";
}

function setupAuthPages() {
  const klEmailPattern = /^25000\d{5}@kluniversity\.in$/;

  // Initialize visual Captcha code
  const captchaCodeElem = document.getElementById("captchaCode");
  const captchaInputElem = document.getElementById("captchaInput");
  const refreshCaptchaBtn = document.getElementById("refreshCaptchaBtn");
  const usernameInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const otpGroup = document.getElementById("otpGroup");
  const otpInput = document.getElementById("otpInput");
  const otpTarget = document.getElementById("otpTarget");
  const otpDemoBox = document.getElementById("otpDemoBox");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const authMessage = document.getElementById("authMessage");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (captchaCodeElem) captchaCodeElem.textContent = code;
    return code;
  };

  if (captchaCodeElem) generateCaptcha();
  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener("click", () => {
      generateCaptcha();
      if (captchaInputElem) captchaInputElem.value = "";
    });
  }

  // Faculty and admin must pass a fixed 4-digit MFA code after the password; students only need the captcha.
  let pending = null;
  const resetMfa = () => {
    pending = null;
    if (!otpGroup) return;
    otpGroup.hidden = true;
    otpInput.required = false;
    otpInput.value = "";
    loginSubmitBtn.textContent = "Sign in";
  };
  const requestMfa = user => {
    pending = { user, attempts: 0 };
    otpGroup.hidden = false;
    otpInput.required = true;
    otpInput.value = "";
    otpInput.focus();
    loginSubmitBtn.textContent = "Verify MFA code & sign in";
    otpTarget.textContent = `${user.role === "admin" ? "Administrator" : "Faculty"} account`;
    otpDemoBox.innerHTML = `Enter the 4-digit MFA code issued to you by the IT office.${user.mfaCode ? `<br><strong>Demo mode:</strong> this account's code is <code>${user.mfaCode}</code>.` : ""}`;
  };
  const completeLogin = user => {
    writeStore(KEYS.session, { id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.studentId || null });
    logActivity(`${user.role} signed in`, user.name);
    redirectForRole(user.role);
  };
  [usernameInput, passwordInput, captchaInputElem].forEach(input => input?.addEventListener("input", () => {
    if (!pending) return;
    resetMfa();
    showMessage(authMessage, "");
  }));
  document.getElementById("forgotPasswordLink")?.addEventListener("click", event => {
    event.preventDefault();
    showMessage(authMessage, "Contact the administrator or the examination office to reset your password.");
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      if (pending) {
        if (otpInput.value.trim() !== String(pending.user.mfaCode)) {
          pending.attempts += 1;
          if (pending.attempts >= 3) {
            resetMfa();
            generateCaptcha();
            captchaInputElem.value = "";
            return showMessage(authMessage, "Too many wrong MFA attempts. Start again.");
          }
          otpInput.value = "";
          return showMessage(authMessage, `Incorrect MFA code. ${3 - pending.attempts} attempt(s) left.`);
        }
        return completeLogin(pending.user);
      }

      if (captchaCodeElem && captchaInputElem) {
        const expected = captchaCodeElem.textContent.trim().toUpperCase();
        if (captchaInputElem.value.trim().toUpperCase() !== expected) {
          generateCaptcha();
          captchaInputElem.value = "";
          return showMessage(authMessage, "Incorrect Verification Code. Please try again.");
        }
      }

      const identifier = usernameInput.value.trim().toLowerCase();
      const user = readStore(KEYS.users, []).find(item =>
        !item.archived && (
          (item.username && item.username.toLowerCase() === identifier) ||
          (item.email && item.email.toLowerCase() === identifier) ||
          (/^25000\d{5}$/.test(identifier) && item.email && item.email.toLowerCase() === `${identifier}@kluniversity.in`)
        )
      );
      if (!user || user.password !== passwordInput.value) {
        generateCaptcha();
        captchaInputElem.value = "";
        return showMessage(authMessage, "Incorrect username or password.");
      }

      if (user.role === "student") return completeLogin(user);
      requestMfa(user);
      showMessage(authMessage, "Password verified. Enter your MFA code.", true);
    });
  }

  const roleSelect = document.getElementById("signupRole");
  if (roleSelect) {
    const toggleFields = () => {
      const isStudent = roleSelect.value === "student";
      const isFaculty = roleSelect.value === "faculty";
      document.getElementById("rollField").hidden = !isStudent;
      document.getElementById("classField").hidden = !isStudent;
      document.getElementById("facultySubjectsField").hidden = !isFaculty;
      document.getElementById("signupRoll").required = isStudent;
      document.getElementById("signupClass").required = isStudent;
    };
    roleSelect.addEventListener("change", toggleFields);
    toggleFields();
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim().toLowerCase();
      const role = document.getElementById("signupRole").value;
      if (!klEmailPattern.test(email)) return showMessage(document.getElementById("authMessage"), "Email must follow the format 25000xxxxx@kluniversity.in.");
      if (!['student', 'faculty'].includes(role)) return showMessage(document.getElementById("authMessage"), "Choose a valid account role.");
      const users = readStore(KEYS.users, []);
      if (users.some(user => user.email.toLowerCase() === email)) return showMessage(document.getElementById("authMessage"), "An account with this email already exists.");
      const user = { id: makeId("usr"), name, email, password: email.split("@")[0], role };
      if (role === "student") {
        const students = getStudents();
        const universityId = document.getElementById("signupRoll").value.trim();
        if (universityId !== email.split("@")[0]) return showMessage(document.getElementById("authMessage"), "Student ID must match the number in the KL University email.");
        if (students.some(student => student.universityId === universityId)) return showMessage(document.getElementById("authMessage"), "This student ID is already registered.");
        user.studentId = makeId("stu");
        students.push({ id: user.studentId, name, email, universityId, department: document.getElementById("signupClass").value, semester: CURRENT_SEMESTER, enrolledSubjects: [...SUBJECTS], grades: {}, attendance: 0, marks: Object.fromEntries(SUBJECTS.map(subject => [subject, 0])), totalMarks: Object.fromEntries(SUBJECTS.map(subject => [subject, 100])), remarks: "Academic record has not been entered yet." });
        writeStore(KEYS.students, students);
      }
      if (role === "faculty") {
        user.subjects = [];
        user.archived = true;
      }
      users.push(user);
      writeStore(KEYS.users, users);
      const message = role === "faculty" ? "Faculty account submitted for administrator approval." : "Registration successful. Redirecting to login...";
      showMessage(document.getElementById("authMessage"), message, true);
      if (role === "student") setTimeout(() => { window.location.href = "../login/index.html"; }, 700);
    });
  }
}

function protectPage(expectedRole) {
  const session = getSession();
  const user = session && readStore(KEYS.users, []).find(item => item.id === session.id && item.role === expectedRole && !item.archived);
  if (!session || !user) {
    localStorage.removeItem(KEYS.session);
    window.location.replace("../login/index.html");
    return null;
  }
  const validatedSession = { id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.studentId || null };
  if (JSON.stringify(session) !== JSON.stringify(validatedSession)) writeStore(KEYS.session, validatedSession);
  return validatedSession;
}

// Shared light/dark toggle, inserted into the topbar of every dashboard page (admin, faculty, student).
function initThemeToggle() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || document.getElementById("themeModeBtn")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.id = "themeModeBtn";
  button.className = "icon-btn theme-toggle-btn";
  button.setAttribute("aria-label", "Toggle dark mode");
  const applyTheme = theme => { document.documentElement.dataset.theme = theme; button.textContent = theme === "dark" ? "\u2600" : "\u263D"; };
  const current = localStorage.getItem(KEYS.theme) === "dark" ? "dark" : "light";
  applyTheme(current);
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(KEYS.theme, next);
    applyTheme(next);
  });
  const anchor = topbar.querySelector(".user-chip, #profileSettingsBtn");
  if (anchor) anchor.before(button); else topbar.appendChild(button);
}

function setupDashboardShell(session) {
  document.getElementById("currentUserName").textContent = session.name;
  document.getElementById("userInitial").textContent = session.name.charAt(0).toUpperCase();
  document.getElementById("welcomeName").textContent = session.name;
  initThemeToggle();
  document.body.insertAdjacentHTML("beforeend", `<dialog id="profileSettingsDialog"><form id="profileSettingsForm" class="dialog-form"><div class="dialog-heading"><h2>Profile Settings</h2><button type="button" class="icon-btn" id="closeProfileSettings" aria-label="Close profile settings">×</button></div><label>Full name<input id="profileName" type="text" required></label><label>KL University email<input id="profileEmail" type="email" readonly></label><p class="muted small-text">New accounts use the 10-digit university ID as the default password.</p><div class="dialog-actions"><button type="button" class="btn secondary" id="cancelProfileSettings">Cancel</button><button type="submit" class="btn primary">Save Profile</button></div><p id="profileSettingsMessage" class="form-message"></p></form></dialog>`);
  const profileDialog = document.getElementById("profileSettingsDialog");
  document.getElementById("profileSettingsBtn").addEventListener("click", () => {
    if (session.role === "student") {
      document.querySelector('[data-section="myProfile"]')?.click();
      return;
    }
    document.getElementById("profileName").value = session.name;
    document.getElementById("profileEmail").value = session.email;
    showMessage(document.getElementById("profileSettingsMessage"), "");
    profileDialog.showModal();
  });
  document.getElementById("closeProfileSettings").addEventListener("click", () => profileDialog.close());
  document.getElementById("cancelProfileSettings").addEventListener("click", () => profileDialog.close());
  document.getElementById("profileSettingsForm").addEventListener("submit", event => {
    event.preventDefault();
    const users = readStore(KEYS.users, []);
    const user = users.find(item => item.id === session.id);
    if (!user) return showMessage(document.getElementById("profileSettingsMessage"), "Profile could not be found.");
    const name = document.getElementById("profileName").value.trim();
    user.name = name;
    writeStore(KEYS.users, users);
    if (session.studentId) {
      const students = getStudents();
      const student = students.find(item => item.id === session.studentId);
      if (student) { student.name = name; writeStore(KEYS.students, students); }
    }
    writeStore(KEYS.session, { ...session, name });
    profileDialog.close();
    window.location.reload();
  });
  // Logout is handled by the standalone login/logout.js, loaded after this file on every dashboard page.
  const sidebar = document.querySelector(".sidebar");
  document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.querySelectorAll(".nav-link[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.section;
      document.querySelectorAll(".page-section").forEach(section => section.classList.toggle("active", section.id === sectionId));
      document.querySelectorAll(".nav-link[data-section]").forEach(link => link.classList.toggle("active", link === button));
      document.getElementById("pageTitle").textContent = button.querySelector("span").textContent;
      sidebar.classList.remove("open");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderBarChart(container, labels, values, color = "") {
  if (!container) return;
  container.innerHTML = labels.map((label, index) => {
    const value = Math.max(0, Math.min(100, Number(values[index]) || 0));
    const style = `height:${Math.max(4, value * 1.75)}px;${color ? `background:${color}` : ""}`;
    const displayLabel = subjectConfigFor(label)?.shortName || label;
    return `<div class="bar-column"><div class="bar" style="${style}"><span>${Math.round(value)}</span></div><span>${escapeHtml(displayLabel)}</span></div>`;
  }).join("");
}

function reportHtml(student) {
  if (!student) return `<div class="panel empty-state">No student record is available.</div>`;
  const settings = readStore(KEYS.settings, { schoolName: "KL University", reportSubtitle: "Academic Progress Report" });
  const isSnapshot = Array.isArray(student.subjects);
  const average = Number(student.average ?? averageFor(student));
  let totalObtained = 0;
  let totalMax = 0;
  const rows = isSnapshot ? student.subjects.map(item => { totalObtained += Number(item.score) || 0; totalMax += 100; return `<tr><td>${escapeHtml(item.subject)}</td><td>${Number(item.score).toFixed(1)} / 100</td><td>${escapeHtml(item.grade || gradeFor(item.score))}</td><td>${Number(item.score) >= getGrading().d ? "Pass" : "Needs Improvement"}</td><td>${escapeHtml(item.remark || "—")}</td></tr>`; }).join("") : SUBJECTS.map(subject => {
    const hasWeightedGrade = Boolean(student.grades?.[subject]);
    const mark = hasWeightedGrade ? finalScoreFor(student.grades[subject]) : Number(student.marks?.[subject]) || 0;
    const total = hasWeightedGrade ? 100 : Number(student.totalMarks?.[subject]) || 100;
    const percentage = subjectPercentage(student, subject);
    totalObtained += mark;
    totalMax += total;
    return `<tr><td>${escapeHtml(subject)}</td><td>${mark.toFixed(1)} / ${total}</td><td>${gradeFor(percentage)}</td><td>${percentage >= getGrading().d ? "Pass" : "Needs Improvement"}</td><td>${escapeHtml(student.subjectRemarks?.[subject] || "—")}</td></tr>`;
  }).join("");
  const status = studentStatusLabel(student);
  return `<article class="report-card">
    <header class="report-header"><div><h2>${escapeHtml(settings.schoolName)}</h2><p>${escapeHtml(settings.reportSubtitle)} · ${escapeHtml(student.semester || CURRENT_SEMESTER)}</p></div><div class="report-badge">${gradeFor(average)}</div></header>
    <div class="report-body">
      <div class="report-student-info">
        <div class="info-item"><span>Student Name</span><strong>${escapeHtml(student.name)}</strong></div>
        <div class="info-item"><span>Student ID</span><strong>${escapeHtml(student.universityId)}</strong></div>
        <div class="info-item"><span>Department</span><strong>${escapeHtml(student.department)} · ${escapeHtml(student.section || "Section 1")}</strong></div>
        <div class="info-item"><span>Academic Term</span><strong>${escapeHtml(settings.academicYear || "2026-2027")} · ${escapeHtml(student.semester || settings.semesterName || CURRENT_SEMESTER)}</strong></div>
        <div class="info-item"><span>Status</span><strong><span class="status-pill ${studentStatusClass(status)}" title="${escapeHtml(student.suspended ? student.suspensionReason || "Suspended" : "")}">${status}</span></strong></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Result</th><th>Faculty Remark</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="report-summary"><div><span>Total Marks (Faculty-submitted)</span><strong>${totalObtained.toFixed(1)} / ${totalMax}</strong></div><div><span>Overall Average</span><strong>${average.toFixed(1)}%</strong></div><div><span>Overall Grade</span><strong>${gradeFor(average)}</strong></div><div><span>Attendance</span><strong>${Number(student.attendance) || 0}%</strong></div></div>
      <div class="report-remark"><strong>Class Teacher's Remark</strong><span>${escapeHtml(student.classRemark || student.remarks || "No remark has been added.")}</span></div>
      <div class="report-footer"><span>${escapeHtml(settings.contact || "Academic Office")}</span><span>Authorized Signature</span><span>Generated: ${new Intl.DateTimeFormat("en-IN").format(new Date())}</span></div>
    </div>
  </article>`;
}

function buildSimplePdf(lines) {
  const clean = value => String(value ?? "").normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/([\\()])/g, "\\$1");
  const content = lines.map((line, index) => `BT /F1 ${line.size} Tf 50 ${790 - index * 22} Td (${clean(line.text)}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function downloadReportPdf(student, semester, finalized = false) {
  const settings = readStore(KEYS.settings, {});
  const subjectRows = Array.isArray(student.subjects)
    ? student.subjects
    : (student.enrolledSubjects || SUBJECTS).map(subject => ({ subject, score: subjectPercentage(student, subject), grade: gradeFor(subjectPercentage(student, subject)) }));
  const average = Number(student.average ?? averageFor(student));
  const lines = [
    { text: settings.schoolName || "KL University", size: 18 },
    { text: `${finalized ? "Official" : "Provisional"} Academic Report`, size: 12 },
    { text: `${settings.academicYear || "2026-2027"} | ${semester || CURRENT_SEMESTER}`, size: 10 },
    { text: "", size: 10 },
    { text: `Student: ${student.name}`, size: 11 },
    { text: `Student ID: ${student.universityId}`, size: 10 },
    { text: `Department: ${student.department || "Not provided"}`, size: 10 },
    { text: "", size: 10 },
    { text: "Subject                                      Score      Grade", size: 10 },
    ...subjectRows.map(item => ({ text: `${(subjectConfigFor(item.subject)?.shortName || item.subject).slice(0, 40).padEnd(45)}${Number(item.score).toFixed(1).padStart(6)}%     ${item.grade || gradeFor(item.score)}`, size: 9 })),
    { text: "", size: 10 },
    { text: `Overall average: ${average.toFixed(1)}%    Grade: ${gradeFor(average)}`, size: 11 },
    { text: `Attendance: ${Number(student.attendance) || 0}%`, size: 10 },
    { text: "", size: 10 },
    { text: `Generated: ${new Intl.DateTimeFormat("en-IN").format(new Date())}`, size: 9 },
    { text: finalized ? "Authorized academic record" : "Provisional record - subject to final publication", size: 9 }
  ];
  downloadFile(buildSimplePdf(lines), `${student.universityId}-${String(semester || CURRENT_SEMESTER).replace(/\s+/g, "-")}-report.pdf`, "application/pdf");
}

function populateStudentSelect(select, students, selectedId) {
  if (!select) return;
  select.innerHTML = students.map(student => `<option value="${escapeHtml(student.id)}" ${student.id === selectedId ? "selected" : ""}>${escapeHtml(student.name)} (${escapeHtml(student.universityId)})</option>`).join("");
}

function setupAdmin() {
  const session = protectPage("admin");
  if (!session) return;
  setupDashboardShell(session);

  const refreshAll = () => {
    const students = getStudents();
    const allStudents = getStudents(true);
    const faculty = readStore(KEYS.users, []).filter(user => user.role === "faculty");
    const averages = students.map(averageFor);
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("archivedStudentCount").textContent = `${allStudents.filter(student => student.archived).length} archived`;
    document.getElementById("totalFaculty").textContent = faculty.filter(user => !user.archived).length;
    document.getElementById("assignedFacultyCount").textContent = `${faculty.filter(user => !user.archived && user.subjects?.length).length} with subjects`;
    document.getElementById("departmentCount").textContent = `${new Set(students.map(student => student.department)).size} / ${new Set(students.map(student => student.section)).size}`;
    document.getElementById("classAverage").textContent = `${(averages.reduce((sum, value) => sum + value, 0) / (averages.length || 1)).toFixed(1)}%`;
    document.getElementById("avgAttendance").textContent = `${(students.reduce((sum, student) => sum + Number(student.attendance || 0), 0) / (students.length || 1)).toFixed(1)}% attendance`;
    const subjectAverages = SUBJECTS.map(subject => students.reduce((sum, student) => sum + subjectPercentage(student, subject), 0) / (students.length || 1));
    renderBarChart(document.getElementById("subjectChart"), SUBJECTS, subjectAverages);
    const lowAttendance = students.filter(student => Number(student.attendance) < 75).length;
    const incompleteGrades = students.reduce((count, student) => count + (student.enrolledSubjects || []).filter(subject => !student.grades?.[subject]).length, 0);
    const unassignedFaculty = faculty.filter(user => !user.archived && !user.subjects?.length).length;
    const suspendedStudents = students.filter(student => student.suspended);
    const detainedStudents = students.filter(student => Number(student.attendance) < 75 && !student.suspended);
    const pendingSubRequests = readStore(KEYS.substitutionRequests, []).filter(item => item.status === "Pending").length;
    const pendingBonusRequests = readStore(KEYS.bonusRequests, []).filter(item => item.status === "Pending").length;
    document.getElementById("detainedCount").textContent = detainedStudents.length;
    document.getElementById("suspendedCount").textContent = suspendedStudents.length;
    document.getElementById("detainedList").innerHTML = detainedStudents.length ? detainedStudents.map(student => `<div class="action-item"><strong>${Number(student.attendance).toFixed(1)}%</strong><span>${escapeHtml(student.name)} \u00b7 ${escapeHtml(student.universityId)} \u00b7 ${escapeHtml(student.department)}</span></div>`).join("") : `<div class="empty-state">No detained students.</div>`;
    document.getElementById("suspendedList").innerHTML = suspendedStudents.length ? suspendedStudents.map(student => `<div class="action-item"><strong>${escapeHtml(student.universityId)}</strong><span>${escapeHtml(student.name)}${student.suspensionReason ? ` \u2014 ${escapeHtml(student.suspensionReason)}` : ""}</span></div>`).join("") : `<div class="empty-state">No suspended students.</div>`;
    document.getElementById("pendingActions").innerHTML = [[lowAttendance, "students below 75% attendance"], [incompleteGrades, "subject grades awaiting entry"], [unassignedFaculty, "faculty without assigned subjects"], [pendingSubRequests, "leave/substitution requests awaiting a decision"], [pendingBonusRequests, "bonus-mark requests awaiting a decision"]].map(([count, label]) => `<div class="action-item"><strong>${count}</strong><span>${label}</span></div>`).join("");
    const activity = readStore(KEYS.activity, []).slice(0, 6);
    document.getElementById("recentActivity").innerHTML = activity.length ? activity.map(item => `<div class="activity-item"><span>${escapeHtml(item.action)}</span><small>${escapeHtml(item.actor)} · ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.timestamp))}</small></div>`).join("") : `<div class="empty-state">No activity recorded yet.</div>`;
    renderStudentsTable(document.getElementById("studentSearch").value);
    renderFacultyTable(document.getElementById("facultySearch").value);
    const currentRecord = document.getElementById("recordStudentSelect").value || students[0]?.id;
    const currentAttendance = document.getElementById("attendanceStudentSelect").value || students[0]?.id;
    const currentReport = document.getElementById("reportStudentSelect").value || students[0]?.id;
    populateStudentSelect(document.getElementById("recordStudentSelect"), students, currentRecord);
    populateStudentSelect(document.getElementById("attendanceStudentSelect"), students, currentAttendance);
    populateStudentSelect(document.getElementById("reportStudentSelect"), students, currentReport);
    loadRecordForm(document.getElementById("recordStudentSelect").value);
    loadAttendanceForm(document.getElementById("attendanceStudentSelect").value);
    renderAdminReport(document.getElementById("reportStudentSelect").value);
    populateStudentSelect(document.getElementById("registrationStudent"), students, document.getElementById("registrationStudent").value || students[0]?.id);
    renderRegistrationChoices();
    renderAcademicClearance();
    renderBranchReport();
    renderAllotments();
    renderRegistrationStatus();
    renderSubstitutions();
    renderBonusRequests();
    renderAcademicSetup();
    renderGradeOversight();
  };

  const renderStudentsTable = (query = "") => {
    const normalized = query.trim().toLowerCase();
    const allForFilters = getStudents(true);
    const departments = [...new Set(allForFilters.map(student => student.department).filter(Boolean))].sort();
    const departmentSelect = document.getElementById("studentFilterDepartment");
    const facultySelect = document.getElementById("studentFilterFaculty");
    const allFaculty = readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived);
    const departmentValue = departmentSelect.value || "all";
    const facultyOptions = departmentValue === "all" ? allFaculty : allFaculty.filter(user => facultyDepartments(user).includes(departmentValue));
    const facultyValue = facultyOptions.some(user => user.id === facultySelect.value) ? facultySelect.value : "all";
    departmentSelect.innerHTML = `<option value="all">All departments</option>${departments.map(department => `<option value="${escapeHtml(department)}" ${department === departmentValue ? "selected" : ""}>${escapeHtml(department)}</option>`).join("")}`;
    facultySelect.innerHTML = `<option value="all">All faculty${departmentValue === "all" ? "" : " in this department"}</option>${facultyOptions.map(user => `<option value="${escapeHtml(user.id)}" ${user.id === facultyValue ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}`;
    const selectedFaculty = facultyValue !== "all" ? facultyOptions.find(user => user.id === facultyValue) : null;
    const facultySubjects = selectedFaculty?.subjects || [];
    const students = allForFilters.filter(student =>
      [student.name, student.universityId, student.department].some(value => value.toLowerCase().includes(normalized)) &&
      (departmentValue === "all" || student.department === departmentValue) &&
      (facultyValue === "all" || student.enrolledSubjects?.some(subject => facultySubjects.includes(subject))));
    document.getElementById("studentCount").textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;
    document.getElementById("studentsTable").innerHTML = students.length ? students.map(student => {
      const status = studentStatusLabel(student);
      return `<tr>
      <td><div class="student-cell"><span class="avatar">${escapeHtml(student.name.charAt(0))}</span><div><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.email)}${student.archived ? " · Archived" : ""}</small></div></div></td>
      <td>${escapeHtml(student.universityId)}</td><td><strong>${escapeHtml(student.department)}</strong><small>${escapeHtml(student.batch || "2025-2029")} · ${escapeHtml(student.section || `${student.department}-1`)}</small></td><td><span class="status-pill ${studentStatusClass(status)}" title="${escapeHtml(student.suspended ? student.suspensionReason || "Suspended" : "")}">${status}</span></td><td><span class="status-pill ${attendanceClass(Number(student.attendance))}">${Number(student.attendance) || 0}%</span></td><td>${averageFor(student).toFixed(1)}%</td>
      <td><div class="action-group">${student.archived ? `<button class="btn secondary small" data-archive-student="${student.id}">Restore</button>` : `<button class="btn secondary small" data-edit-id="${student.id}">Edit</button><button class="btn secondary small" data-view-id="${student.id}">Report</button><button class="btn secondary small" data-reset-student="${student.id}">Reset Password</button><button class="btn danger small" data-archive-student="${student.id}">Archive</button>`}</div></td></tr>`;
    }).join("") : `<tr><td colspan="7" class="empty-state">No matching students found.</td></tr>`;
    document.querySelectorAll("[data-edit-id]").forEach(button => button.addEventListener("click", () => openStudentDialog(button.dataset.editId)));
    document.querySelectorAll("[data-view-id]").forEach(button => button.addEventListener("click", () => openReport(button.dataset.viewId)));
    document.querySelectorAll("[data-reset-student]").forEach(button => button.addEventListener("click", () => resetStudentPassword(button.dataset.resetStudent)));
    document.querySelectorAll("[data-archive-student]").forEach(button => button.addEventListener("click", () => toggleStudentArchive(button.dataset.archiveStudent)));
  };

  const renderFacultyTable = (query = "") => {
    const normalized = query.trim().toLowerCase();
    const allFaculty = readStore(KEYS.users, []).filter(user => user.role === "faculty");
    const departments = [...new Set(allFaculty.flatMap(facultyDepartments))].sort();
    const departmentSelect = document.getElementById("facultyFilterDepartment");
    const departmentValue = departmentSelect.value || "all";
    departmentSelect.innerHTML = `<option value="all">All departments</option>${departments.map(department => `<option value="${escapeHtml(department)}" ${department === departmentValue ? "selected" : ""}>${escapeHtml(department)}</option>`).join("")}`;
    const faculty = allFaculty.filter(user =>
      [user.name, user.email, ...(user.subjects || [])].some(value => value.toLowerCase().includes(normalized)) &&
      (departmentValue === "all" || facultyDepartments(user).includes(departmentValue)));
    document.getElementById("facultyCount").textContent = `${faculty.length} faculty account${faculty.length === 1 ? "" : "s"}`;
    document.getElementById("facultyTable").innerHTML = faculty.length ? faculty.map(user => {
      const location = facultyCurrentLocation(user);
      return `<tr><td><div class="student-cell"><span class="avatar">${escapeHtml(user.name.charAt(0))}</span><div><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.email)}</small></div></div></td><td>${escapeHtml(user.email.split("@")[0])}</td><td>${(user.subjects || []).map(subject => escapeHtml(subjectConfigFor(subject)?.shortName || subject)).join(", ") || "Not assigned"}</td><td>${location ? `<span class="status-pill warn">${escapeHtml(location.room)}</span>` : `<span class="status-pill good">Free</span>`}</td><td><span class="status-pill ${user.archived ? "bad" : "good"}">${user.archived ? "Archived" : "Active"}</span></td><td><div class="action-group"><button class="btn secondary small" data-edit-faculty="${user.id}">Edit</button><button class="btn secondary small" data-reset-faculty="${user.id}">Reset Password</button><button class="btn ${user.archived ? "secondary" : "danger"} small" data-archive-faculty="${user.id}">${user.archived ? "Restore" : "Archive"}</button></div></td></tr>`;
    }).join("") : `<tr><td colspan="6" class="empty-state">No matching faculty found.</td></tr>`;
    document.querySelectorAll("[data-edit-faculty]").forEach(button => button.addEventListener("click", () => openFacultyDialog(button.dataset.editFaculty)));
    document.querySelectorAll("[data-reset-faculty]").forEach(button => button.addEventListener("click", () => resetFacultyPassword(button.dataset.resetFaculty)));
    document.querySelectorAll("[data-archive-faculty]").forEach(button => button.addEventListener("click", () => toggleFacultyArchive(button.dataset.archiveFaculty)));
  };

  const openReport = id => {
    populateStudentSelect(document.getElementById("reportStudentSelect"), getStudents(), id);
    renderAdminReport(id);
    document.querySelector('[data-section="reports"]').click();
  };

  const renderAdminReport = id => {
    const student = getStudents().find(item => item.id === id);
    document.getElementById("adminReportContainer").innerHTML = reportHtml(student);
  };

  const openStudentDialog = id => {
    const student = getStudents().find(item => item.id === id);
    document.getElementById("studentDialogTitle").textContent = student ? "Edit Student" : "Add Student";
    document.getElementById("studentId").value = student?.id || "";
    document.getElementById("studentName").value = student?.name || "";
    document.getElementById("studentEmail").value = student?.email || "";
    document.getElementById("studentRoll").value = student?.universityId || "";
    document.getElementById("studentClass").value = student?.department || "CSE";
    document.getElementById("studentBatch").value = student?.batch || "2025-2029";
    document.getElementById("studentSection").value = student?.section || `${student?.department || "CSE"}-1`;
    document.getElementById("studentDateOfBirth").value = student?.dateOfBirth || "";
    document.getElementById("studentParentName").value = student?.parentName || "";
    document.getElementById("studentParentContact").value = student?.parentContact || "";
    document.getElementById("studentSuspended").checked = Boolean(student?.suspended);
    document.getElementById("studentSuspensionReason").value = student?.suspensionReason || "";
    showMessage(document.getElementById("studentFormMessage"), "");
    document.getElementById("studentDialog").showModal();
  };

  const toggleStudentArchive = id => {
    const students = getStudents(true);
    const student = students.find(item => item.id === id);
    if (!student) return;
    student.archived = !student.archived;
    const users = readStore(KEYS.users, []);
    const user = users.find(item => item.studentId === id);
    if (user) user.archived = student.archived;
    writeStore(KEYS.students, students);
    writeStore(KEYS.users, users);
    logActivity(`${student.archived ? "Archived" : "Restored"} student ${student.name}`, session.name);
    refreshAll();
  };

  const resetStudentPassword = id => {
    const student = getStudents(true).find(item => item.id === id);
    const users = readStore(KEYS.users, []);
    const user = users.find(item => item.studentId === id);
    if (!student || !user) return;
    user.password = student.universityId;
    writeStore(KEYS.users, users);
    logActivity(`Reset password for ${student.name}`, session.name);
    refreshAll();
  };

  const openFacultyDialog = id => {
    const faculty = readStore(KEYS.users, []).find(user => user.id === id && user.role === "faculty");
    document.getElementById("facultyDialogTitle").textContent = faculty ? "Edit Faculty" : "Add Faculty";
    document.getElementById("facultyId").value = faculty?.id || "";
    document.getElementById("facultyName").value = faculty?.name || "";
    document.getElementById("facultyEmail").value = faculty?.email || "";
    document.getElementById("adminFacultySubjectChoices").innerHTML = SUBJECTS.map(subject => `<label><input type="checkbox" value="${escapeHtml(subject)}" ${faculty?.subjects?.includes(subject) ? "checked" : ""}>${escapeHtml(subject)}</label>`).join("");
    const sections = [...new Set(getStudents().map(student => student.section).filter(Boolean))].sort();
    document.getElementById("adminMentorSectionChoices").innerHTML = sections.length ? sections.map(section => `<label><input type="checkbox" value="${escapeHtml(section)}" ${faculty?.mentorSections?.includes(section) ? "checked" : ""}>${escapeHtml(section)}</label>`).join("") : `<p class="muted small-text">No student sections exist yet.</p>`;
    showMessage(document.getElementById("facultyFormMessage"), "");
    document.getElementById("facultyDialog").showModal();
  };

  const toggleFacultyArchive = id => {
    const users = readStore(KEYS.users, []);
    const faculty = users.find(user => user.id === id && user.role === "faculty");
    if (!faculty) return;
    if (faculty.archived && !faculty.subjects?.length) {
      openFacultyDialog(id);
      showMessage(document.getElementById("facultyFormMessage"), "Assign at least one subject before activating this faculty account.");
      return;
    }
    faculty.archived = !faculty.archived;
    writeStore(KEYS.users, users);
    logActivity(`${faculty.archived ? "Archived" : "Restored"} faculty ${faculty.name}`, session.name);
    refreshAll();
  };

  const resetFacultyPassword = id => {
    const users = readStore(KEYS.users, []);
    const faculty = users.find(user => user.id === id && user.role === "faculty");
    if (!faculty) return;
    faculty.password = faculty.email.split("@")[0];
    writeStore(KEYS.users, users);
    logActivity(`Reset password for ${faculty.name}`, session.name);
    refreshAll();
  };

  const renderGradeOversight = () => {
    const students = getStudents();
    const expected = students.reduce((total, student) => total + (student.enrolledSubjects || []).length, 0);
    const completed = students.reduce((total, student) => total + (student.enrolledSubjects || []).filter(subject => hasCompleteGrade(student.grades?.[subject])).length, 0);
    const publications = readStore(KEYS.publications, []);
    const submissions = readStore(KEYS.gradeSubmissions, []);
    document.getElementById("gradeOversightStats").innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Expected Records</p><strong>${expected}</strong><small>Registered subject records</small></div></article><article class="stat-card"><span class="stat-icon green">✓</span><div><p>Completed</p><strong>${completed}</strong><small>${expected ? (completed / expected * 100).toFixed(1) : "0.0"}% complete</small></div></article><article class="stat-card"><span class="stat-icon amber">!</span><div><p>Missing</p><strong>${expected - completed}</strong><small>Require faculty entry</small></div></article><article class="stat-card"><span class="stat-icon purple">▤</span><div><p>Published</p><strong>${publications.length}</strong><small>Historical snapshots</small></div></article>`;
    const missingBySubject = SUBJECTS.map(subject => {
      const enrolled = students.filter(student => student.enrolledSubjects?.includes(subject));
      const missing = enrolled.filter(student => !hasCompleteGrade(student.grades?.[subject]));
      return { subject, enrolled: enrolled.length, missing: missing.length };
    }).filter(item => item.missing > 0);
    document.getElementById("missingGradesBySubject").innerHTML = missingBySubject.length ? `<div class="table-wrap"><table><thead><tr><th>Subject</th><th>Enrolled</th><th>Missing</th><th>Complete %</th></tr></thead><tbody>${missingBySubject.map(item => `<tr><td><strong>${escapeHtml(subjectConfigFor(item.subject)?.shortName || item.subject)}</strong></td><td>${item.enrolled}</td><td><span class="status-pill bad">${item.missing}</span></td><td>${(((item.enrolled - item.missing) / (item.enrolled || 1)) * 100).toFixed(1)}%</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">Every subject has complete grades.</div>`;
    document.getElementById("facultySubmissionList").innerHTML = submissions.length ? `<div class="table-wrap"><table><thead><tr><th>Faculty</th><th>Subject</th><th>Semester</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>${submissions.map(item => `<tr><td>${escapeHtml(item.facultyName)}</td><td><strong>${escapeHtml(subjectConfigFor(item.subject)?.shortName || item.subject)}</strong></td><td>${escapeHtml(item.semester)}</td><td>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.submittedAt))}</td><td><span class="status-pill ${item.status === "submitted" ? "good" : "warn"}">${item.status === "submitted" ? "Locked" : "Reopened"}</span></td><td>${item.status === "submitted" ? `<button type="button" class="btn secondary small" data-reopen-submission="${escapeHtml(item.id)}">Reopen</button>` : "Editable"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">No faculty gradebooks have been submitted.</div>`;
    document.getElementById("publicationHistory").innerHTML = publications.length ? `<div class="table-wrap"><table><thead><tr><th>Published</th><th>Semester</th><th>Students</th><th>Published By</th><th>History</th></tr></thead><tbody>${publications.map(item => `<tr><td>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.publishedAt))}</td><td>${escapeHtml(item.semester)}</td><td>${item.students.length}</td><td>${escapeHtml(item.publishedBy)}</td><td><button type="button" class="btn secondary small" data-export-publication="${escapeHtml(item.id)}">Export CSV</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">No results have been published.</div>`;
  };

  const loadRecordForm = id => {
    const student = getStudents().find(item => item.id === id);
    document.getElementById("marksInputs").innerHTML = SUBJECTS.map(subject => `<fieldset class="mark-entry"><legend>${escapeHtml(subject)}</legend><label>Marks obtained<input type="number" min="0" data-subject="${escapeHtml(subject)}" value="${Number(student?.marks?.[subject]) || 0}" required></label><label>Total marks<input type="number" min="1" data-total-subject="${escapeHtml(subject)}" value="${Number(student?.totalMarks?.[subject]) || 100}" required></label></fieldset>`).join("");
    document.getElementById("remarksInput").value = student?.remarks || "";
    showMessage(document.getElementById("recordMessage"), "");
  };

  const updateAttendancePreview = () => {
    let percentageTotal = 0;
    SUBJECTS.forEach(subject => {
      const primary = Number(document.querySelector(`[data-attendance-subject="${subject}"][data-period="primary"]`)?.value) || 0;
      const secondary = Number(document.querySelector(`[data-attendance-subject="${subject}"][data-period="secondary"]`)?.value) || 0;
      const percentage = primary * 0.75 + secondary * 0.25;
      percentageTotal += percentage;
      const output = document.querySelector(`[data-attendance-result="${subject}"]`);
      if (output) output.textContent = `${percentage.toFixed(1)}%`;
    });
    const percentage = percentageTotal / SUBJECTS.length;
    document.getElementById("attendancePreview").textContent = `${percentage.toFixed(1)}%`;
  };

  const loadAttendanceForm = id => {
    const student = getStudents().find(item => item.id === id);
    document.getElementById("attendanceInputs").innerHTML = student ? SUBJECTS.map(subject => {
      const config = subjectConfigFor(subject);
      const record = student.subjectAttendance?.[subject] || { primary: 0, secondary: 0 };
      return `<fieldset class="attendance-card"><legend>${escapeHtml(subject)}</legend><label>${escapeHtml(config.primary)} attendance <span>75% weight</span><input type="number" min="0" max="100" value="${Number(record.primary) || 0}" data-attendance-subject="${escapeHtml(subject)}" data-period="primary" required></label><label>${escapeHtml(config.secondary)} attendance <span>25% weight</span><input type="number" min="0" max="100" value="${Number(record.secondary) || 0}" data-attendance-subject="${escapeHtml(subject)}" data-period="secondary" required></label><div class="subject-attendance-total"><span>Subject attendance</span><strong data-attendance-result="${escapeHtml(subject)}">0%</strong></div></fieldset>`;
    }).join("") : `<p class="empty-state">No student record is available.</p>`;
    showMessage(document.getElementById("attendanceMessage"), "");
    updateAttendancePreview();
  };

  const renderRegistrationChoices = () => {
    const student = getStudents().find(item => item.id === document.getElementById("registrationStudent").value);
    document.getElementById("adminRegistrationChoices").innerHTML = SUBJECTS.map(subject => `<label><input type="checkbox" value="${escapeHtml(subject)}" ${student?.enrolledSubjects?.includes(subject) ? "checked" : ""}>${escapeHtml(subject)}</label>`).join("");
  };

  const renderAcademicSetup = () => {
    document.getElementById("adminTimetable").innerHTML = timetableHtml(SUBJECTS, true);
    document.getElementById("adminExams").innerHTML = examScheduleHtml(SUBJECTS, true);
    document.getElementById("adminAnnouncementList").innerHTML = announcementHtml(getAcademicRecords("announcements"), true);
  };

  const renderAcademicClearance = () => {
    const students = getStudents(true);
    const query = document.getElementById("clearanceSearch")?.value.trim().toLowerCase() || "";
    const filter = document.getElementById("clearanceStatusFilter")?.value || "all";

    const eligibleCount = students.filter(s => s.clearance?.overall !== "On Hold" && !s.suspended).length;
    const onHoldCount = students.filter(s => s.clearance?.overall === "On Hold" || s.suspended).length;
    const attRiskCount = students.filter(s => Number(s.attendance || 0) < 75).length;

    if (document.getElementById("clearanceTotalStudents")) document.getElementById("clearanceTotalStudents").textContent = students.length;
    if (document.getElementById("clearanceEligibleCount")) document.getElementById("clearanceEligibleCount").textContent = eligibleCount;
    if (document.getElementById("clearanceOnHoldCount")) document.getElementById("clearanceOnHoldCount").textContent = onHoldCount;
    if (document.getElementById("clearanceAttRiskCount")) document.getElementById("clearanceAttRiskCount").textContent = attRiskCount;

    const filtered = students.filter(student => {
      const matchesQuery = !query || [student.name, student.universityId, student.department].some(val => (val || "").toLowerCase().includes(query));
      const overall = (student.clearance?.overall || "Eligible") === "On Hold" || student.suspended ? "On Hold" : "Eligible";
      const matchesFilter = filter === "all" || overall === filter;
      return matchesQuery && matchesFilter;
    });

    const body = document.getElementById("adminClearanceTableBody");
    if (!body) return;

    body.innerHTML = filtered.length ? filtered.map(student => {
      const clearance = student.clearance || { tuition: "Cleared", examFee: "Cleared", library: "Cleared", overall: "Eligible" };
      const isHold = clearance.overall === "On Hold" || student.suspended;
      const att = Number(student.attendance) || 0;
      return `<tr>
        <td><strong>${escapeHtml(student.name)}</strong></td>
        <td>${escapeHtml(student.universityId)}</td>
        <td>${escapeHtml(student.department)}</td>
        <td><span class="status-pill ${attendanceClass(att)}">${att}%</span></td>
        <td><span class="status-pill ${clearance.tuition === 'Due' ? 'bad' : 'good'}">${clearance.tuition || 'Cleared'}</span></td>
        <td><span class="status-pill ${clearance.examFee === 'Due' ? 'bad' : 'good'}">${clearance.examFee || 'Cleared'}</span></td>
        <td><span class="status-pill ${clearance.library === 'Due' ? 'bad' : 'good'}">${clearance.library || 'Cleared'}</span></td>
        <td><strong class="${isHold ? 'warn-text' : 'good-text'}">${student.suspended ? "ON HOLD (Suspended)" : isHold ? 'ON HOLD' : 'ELIGIBLE'}</strong></td>
        <td>
          <button type="button" class="btn ${isHold ? 'primary' : 'danger'} small" data-toggle-clearance="${student.id}" data-current="${clearance.overall || 'Eligible'}" ${student.suspended ? "disabled title=\"Lift the suspension from the Students page first\"" : ""}>
            ${isHold ? 'Authorize' : 'Put On Hold'}
          </button>
        </td>
      </tr>`;
    }).join("") : `<tr><td colspan="9" class="empty-state">No students found matching clearance filters.</td></tr>`;

    body.querySelectorAll("[data-toggle-clearance]").forEach(btn => {
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.toggleClearance;
        const current = btn.dataset.current;
        const newStatus = current === "On Hold" ? "Eligible" : "On Hold";
        const allStudents = getStudents(true);
        const st = allStudents.find(s => s.id === studentId);
        if (st) {
          st.clearance = st.clearance || {};
          st.clearance.overall = newStatus;
          st.clearance.tuition = newStatus === "On Hold" ? "Due" : "Cleared";
          st.clearance.examFee = newStatus === "On Hold" ? "Due" : "Cleared";
          st.clearance.note = newStatus === "On Hold" ? "Semester fee dues pending. Hallticket withheld by Admin." : "All fees cleared. Hallticket authorized.";
          writeStore(KEYS.students, allStudents);
          logActivity(`Updated exam clearance for ${st.name} to ${newStatus}`, session.name);
          renderAcademicClearance();
        }
      });
    });
  };

  document.getElementById("clearanceSearch")?.addEventListener("input", renderAcademicClearance);
  document.getElementById("clearanceStatusFilter")?.addEventListener("change", renderAcademicClearance);

  const renderBranchReport = () => {
    const branchSelect = document.getElementById("branchReportBranch");
    const sectionSelect = document.getElementById("branchReportSection");
    if (!branchSelect || !sectionSelect) return;
    const students = getStudents();
    const branches = [...new Set(students.map(student => student.department))].sort();
    const branch = branches.includes(branchSelect.value) ? branchSelect.value : "all";
    const sections = [...new Set(students.filter(student => branch === "all" || student.department === branch).map(student => student.section))].sort();
    const section = sections.includes(sectionSelect.value) ? sectionSelect.value : "all";
    branchSelect.innerHTML = `<option value="all">All branches</option>${branches.map(item => `<option value="${escapeHtml(item)}" ${item === branch ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}`;
    sectionSelect.innerHTML = `<option value="all">All sections</option>${sections.map(item => `<option value="${escapeHtml(item)}" ${item === section ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}`;

    const filtered = students.filter(student => (branch === "all" || student.department === branch) && (section === "all" || student.section === section));
    const outcomes = new Map(filtered.map(student => [student.id, studentOutcome(student)]));
    const count = status => filtered.filter(student => outcomes.get(student.id).status === status).length;
    const percent = (part, whole) => whole ? (part / whole * 100).toFixed(1) : "0.0";
    const overallAverage = filtered.reduce((sum, student) => sum + outcomes.get(student.id).average, 0) / (filtered.length || 1);
    document.getElementById("branchReportStats").innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Students</p><strong>${filtered.length}</strong><small>In this filter</small></div></article><article class="stat-card"><span class="stat-icon green">%</span><div><p>Pass percentage</p><strong>${percent(count("Passed"), filtered.length)}%</strong><small>${count("Passed")} passed</small></div></article><article class="stat-card"><span class="stat-icon amber">!</span><div><p>Failed / Detained</p><strong>${count("Failed")} / ${count("Detained")}</strong><small>Need follow-up</small></div></article><article class="stat-card"><span class="stat-icon purple">\u03a3</span><div><p>Average score</p><strong>${overallAverage.toFixed(1)}%</strong><small>Across enrolled subjects</small></div></article>`;

    const groups = new Map();
    filtered.forEach(student => {
      const key = `${student.department}|${student.section}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(student);
    });
    document.getElementById("branchReportBody").innerHTML = groups.size ? [...groups.entries()].sort().map(([key, members]) => {
      const [department, sectionName] = key.split("|");
      const passed = members.filter(student => outcomes.get(student.id).status === "Passed").length;
      const failed = members.filter(student => outcomes.get(student.id).status === "Failed").length;
      const suspended = members.filter(student => student.suspended).length;
      const detained = members.length - passed - failed;
      const average = members.reduce((sum, student) => sum + outcomes.get(student.id).average, 0) / members.length;
      return `<tr><td><strong>${escapeHtml(department)}</strong></td><td>${escapeHtml(sectionName)}</td><td>${members.length}</td><td>${passed}</td><td>${failed}</td><td>${detained}</td><td>${suspended}</td><td><span class="status-pill ${passed / members.length >= 0.75 ? "good" : "warn"}">${percent(passed, members.length)}%</span></td><td>${average.toFixed(1)}%</td></tr>`;
    }).join("") : `<tr><td colspan="9" class="empty-state">No students match this filter.</td></tr>`;

    const order = { Detained: 0, Failed: 1, Passed: 2 };
    document.getElementById("branchStudentBody").innerHTML = filtered.length ? filtered.slice().sort((a, b) => order[outcomes.get(a.id).status] - order[outcomes.get(b.id).status] || a.name.localeCompare(b.name)).map(student => {
      const outcome = outcomes.get(student.id);
      return `<tr><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.department)} \u00b7 ${escapeHtml(student.section)}</td><td>${outcome.average.toFixed(1)}%</td><td><span class="status-pill ${attendanceClass(outcome.attendance)}">${outcome.attendance.toFixed(1)}%</span></td><td><span class="status-pill ${outcomeClass(outcome.status)}">${outcome.status}</span></td><td>${outcome.failedSubjects.map(subject => escapeHtml(subjectConfigFor(subject)?.shortName || subject)).join(", ") || "\u2014"}</td></tr>`;
    }).join("") : `<tr><td colspan="7" class="empty-state">No students match this filter.</td></tr>`;
    document.getElementById("exportBranchReportBtn").onclick = () => {
      const rows = [["Student", "ID", "Department", "Section", "Average", "Attendance", "Status", "Failed subjects"], ...filtered.map(student => { const outcome = outcomes.get(student.id); return [student.name, student.universityId, student.department, student.section, outcome.average.toFixed(1), outcome.attendance.toFixed(1), outcome.status, outcome.failedSubjects.join("; ")]; })];
      downloadFile("\uFEFF" + rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n"), "branch-section-results.csv", "text/csv;charset=utf-8");
      logActivity("Exported branch & section results", session.name);
    };
    document.getElementById("downloadSectionSheetBtn").onclick = () => {
      const settings = readStore(KEYS.settings, {});
      const sorted = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
      const maxRows = 30;
      const lines = [
        { text: settings.schoolName || "KL University", size: 16 },
        { text: "Section Result Sheet", size: 12 },
        { text: `${branch === "all" ? "All branches" : branch} \u00b7 ${section === "all" ? "All sections" : section} \u00b7 ${settings.academicYear || "2026-2027"} ${settings.semesterName || CURRENT_SEMESTER}`, size: 10 },
        { text: "", size: 10 },
        { text: `Students: ${filtered.length}   Average: ${overallAverage.toFixed(1)}%   Pass %: ${percent(count("Passed"), filtered.length)}%`, size: 9 },
        { text: "", size: 10 },
        { text: "Name                                ID              Average   Attendance  Status", size: 9 },
        ...sorted.slice(0, maxRows).map(student => { const outcome = outcomes.get(student.id); return { text: `${student.name.slice(0, 34).padEnd(36)}${student.universityId.padEnd(16)}${outcome.average.toFixed(1).padStart(6)}%   ${outcome.attendance.toFixed(1).padStart(6)}%    ${outcome.status}`, size: 8.5 }; }),
        ...(sorted.length > maxRows ? [{ text: `\u2026 and ${sorted.length - maxRows} more (use Export CSV for the full list)`, size: 8 }] : []),
        { text: "", size: 10 },
        { text: `Generated: ${new Intl.DateTimeFormat("en-IN").format(new Date())}`, size: 8 }
      ];
      downloadFile(buildSimplePdf(lines), "section-result-sheet.pdf", "application/pdf");
      logActivity("Downloaded a section result sheet PDF", session.name);
    };
  };
  document.getElementById("branchReportBranch")?.addEventListener("change", renderBranchReport);
  document.getElementById("branchReportSection")?.addEventListener("change", renderBranchReport);

  const refreshRoomViewer = setupEmptyRoomViewer("adminRooms");
  const allotFieldsReady = () => {
    document.getElementById("allotDay").innerHTML = DAYS.map(day => `<option>${day}</option>`).join("");
    document.getElementById("allotPeriod").innerHTML = PERIOD_TIMES.map((time, i) => `<option value="${i + 1}">Period ${i + 1} (${time})</option>`).join("");
    document.getElementById("allotRoom").innerHTML = readStore(KEYS.classrooms, []).map(room => `<option value="${escapeHtml(room.id)}">${escapeHtml(room.id)} \u00b7 ${escapeHtml(room.type)} (${Number(room.capacity)})</option>`).join("");
    document.getElementById("allotCourse").innerHTML = SUBJECT_CONFIG.map(subject => `<option value="${subject.code}">${subject.code} \u00b7 ${escapeHtml(subject.shortName)}</option>`).join("");
  };
  allotFieldsReady();

  const allotConflict = (day, period, room, section, ignoreId = "") => {
    const sameSlot = readStore(KEYS.roomAllotments, []).filter(item => item.id !== ignoreId && item.day === day && Number(item.period) === Number(period));
    if (sameSlot.some(item => item.room === room)) return `${room} already has a class on ${day}, period ${period}.`;
    if (sameSlot.some(item => item.section.toUpperCase() === section.toUpperCase())) return `Section ${section} is already in another room on ${day}, period ${period}.`;
    return "";
  };

  const renderAllotments = () => {
    const body = document.getElementById("allotmentBody");
    if (!body) return;
    const rooms = readStore(KEYS.classrooms, []);
    const allotments = readStore(KEYS.roomAllotments, []).slice().sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.period - b.period);
    body.innerHTML = allotments.length ? allotments.map(item => `<tr><td>${escapeHtml(item.day)}</td><td>${Number(item.period)} <small>(${PERIOD_TIMES[item.period - 1] || ""})</small></td><td><strong>${escapeHtml(item.courseCode)}</strong></td><td>${escapeHtml(facultyForCourse(item.courseCode)?.name || "Unassigned")}</td><td>${escapeHtml(item.section)}</td><td><select data-change-room="${escapeHtml(item.id)}" aria-label="Room">${rooms.map(room => `<option value="${escapeHtml(room.id)}" ${room.id === item.room ? "selected" : ""}>${escapeHtml(room.id)}</option>`).join("")}</select></td><td><button type="button" class="btn danger small" data-delete-allotment="${escapeHtml(item.id)}">Remove</button></td></tr>`).join("") : `<tr><td colspan="7" class="empty-state">No rooms are allotted yet.</td></tr>`;
    refreshRoomViewer();
  };

  document.getElementById("roomAllotForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("allotMessage");
    const day = document.getElementById("allotDay").value;
    const period = Number(document.getElementById("allotPeriod").value);
    const room = document.getElementById("allotRoom").value;
    const courseCode = document.getElementById("allotCourse").value;
    const section = document.getElementById("allotSection").value.trim();
    if (!section) return showMessage(message, "Enter a section.");
    const conflict = allotConflict(day, period, room, section);
    if (conflict) return showMessage(message, conflict);
    const allotments = readStore(KEYS.roomAllotments, []);
    allotments.push({ id: makeId("allot"), day, period, room, courseCode, section });
    writeStore(KEYS.roomAllotments, allotments);
    logActivity(`Allotted ${room} to ${courseCode} ${section} (${day}, period ${period})`, session.name);
    event.target.reset();
    showMessage(message, `${room} allotted.`, true);
    renderAllotments();
  });

  document.getElementById("allotmentBody")?.addEventListener("change", event => {
    const id = event.target.dataset.changeRoom;
    if (!id) return;
    const message = document.getElementById("allotMessage");
    const allotments = readStore(KEYS.roomAllotments, []);
    const item = allotments.find(entry => entry.id === id);
    if (!item) return;
    const conflict = allotConflict(item.day, item.period, event.target.value, item.section, id);
    if (conflict) {
      showMessage(message, conflict);
      return renderAllotments();
    }
    logActivity(`Moved ${item.courseCode} ${item.section} from ${item.room} to ${event.target.value}`, session.name);
    item.room = event.target.value;
    writeStore(KEYS.roomAllotments, allotments);
    showMessage(message, "Room changed.", true);
    renderAllotments();
  });

  document.getElementById("allotmentBody")?.addEventListener("click", event => {
    const id = event.target.dataset.deleteAllotment;
    if (!id) return;
    const allotments = readStore(KEYS.roomAllotments, []);
    const item = allotments.find(entry => entry.id === id);
    writeStore(KEYS.roomAllotments, allotments.filter(entry => entry.id !== id));
    if (item) logActivity(`Removed ${item.room} allotment for ${item.courseCode} ${item.section}`, session.name);
    showMessage(document.getElementById("allotMessage"), "Allotment removed.", true);
    renderAllotments();
  });

  const renderSubstitutions = () => {
    const container = document.getElementById("substitutionQueue");
    if (!container) return;
    const all = readStore(KEYS.substitutionRequests, []);
    document.getElementById("substitutionStats").innerHTML = ["Pending", "Approved", "Rejected"].map(status => `<article class="stat-card"><span class="stat-icon ${status === "Pending" ? "amber" : status === "Approved" ? "green" : "red"}">${status === "Pending" ? "!" : status === "Approved" ? "\u2713" : "\u2715"}</span><div><p>${status}</p><strong>${all.filter(item => item.status === status).length}</strong><small>Leave/substitution requests</small></div></article>`).join("");
    const filterValue = document.getElementById("subStatusFilter")?.value || "all";
    const requests = all.filter(item => filterValue === "all" || item.status === filterValue).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = requests.length ? requests.map(request => {
      const subjectLabel = subjectConfigFor(request.subject)?.shortName || request.subject;
      const free = freeFacultyAt(dayNameFromDate(request.date), request.period, request.facultyId);
      const substitute = readStore(KEYS.users, []).find(user => user.id === request.substituteFacultyId);
      return `<div class="queue-item">
        <div><strong>${escapeHtml(request.facultyName)}</strong> requested leave for <strong>${escapeHtml(subjectLabel)}</strong></div>
        <div class="queue-meta"><span>${escapeHtml(formatAcademicDate(request.date))}, period ${request.period}</span><span>${escapeHtml(request.reason || "No reason given")}</span><span class="status-pill ${request.status === "Approved" ? "good" : request.status === "Rejected" ? "bad" : "warn"}">${escapeHtml(request.status)}</span></div>
        ${request.status === "Pending" ? `<div class="queue-actions">
            <label>Substitute<select data-substitute-select="${request.id}"><option value="">Choose free faculty</option>${free.map(user => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)}</option>`).join("")}</select></label>
            <button type="button" class="btn primary small" data-approve-substitution="${request.id}">Approve</button>
            <button type="button" class="btn danger small" data-reject-substitution="${request.id}">Reject</button>
          </div>` : substitute ? `<div class="queue-meta">Substitute: <strong>${escapeHtml(substitute.name)}</strong></div>` : ""}
      </div>`;
    }).join("") : `<div class="empty-state">No leave or substitution requests.</div>`;
  };
  document.getElementById("subStatusFilter")?.addEventListener("change", renderSubstitutions);
  document.getElementById("substitutionQueue")?.addEventListener("click", event => {
    const approveId = event.target.dataset.approveSubstitution;
    const rejectId = event.target.dataset.rejectSubstitution;
    if (!approveId && !rejectId) return;
    const requests = readStore(KEYS.substitutionRequests, []);
    const request = requests.find(item => item.id === (approveId || rejectId));
    if (!request) return;
    if (approveId) {
      const select = document.querySelector(`[data-substitute-select="${approveId}"]`);
      if (!select?.value) { alert("Choose a substitute before approving."); return; }
      request.substituteFacultyId = select.value;
      request.status = "Approved";
      logActivity(`Approved substitution for ${request.facultyName} (${subjectConfigFor(request.subject)?.shortName || request.subject})`, session.name);
    } else {
      request.status = "Rejected";
      logActivity(`Rejected substitution request from ${request.facultyName}`, session.name);
    }
    writeStore(KEYS.substitutionRequests, requests);
    renderSubstitutions();
  });

  const renderBonusRequests = () => {
    const container = document.getElementById("bonusQueue");
    if (!container) return;
    const requests = readStore(KEYS.bonusRequests, []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = requests.length ? requests.map(request => `<div class="queue-item">
        <div><strong>${escapeHtml(request.facultyName)}</strong> requests <strong>+${Number(request.points)} internal points</strong> for <strong>${escapeHtml(request.studentName)}</strong> in ${escapeHtml(subjectConfigFor(request.subject)?.shortName || request.subject)}</div>
        <div class="queue-meta"><span>${escapeHtml(request.studentUniversityId)}</span><span class="status-pill ${request.status === "Approved" ? "good" : request.status === "Rejected" ? "bad" : "warn"}">${escapeHtml(request.status)}</span></div>
        <p class="muted">${escapeHtml(request.reason || "No reason given")}</p>
        ${request.status === "Pending" ? `<div class="queue-actions"><button type="button" class="btn primary small" data-approve-bonus="${request.id}">Approve</button><button type="button" class="btn danger small" data-reject-bonus="${request.id}">Reject</button></div>` : ""}
      </div>`).join("") : `<div class="empty-state">No co-curricular bonus requests.</div>`;
  };
  document.getElementById("bonusQueue")?.addEventListener("click", event => {
    const approveId = event.target.dataset.approveBonus;
    const rejectId = event.target.dataset.rejectBonus;
    if (!approveId && !rejectId) return;
    const requests = readStore(KEYS.bonusRequests, []);
    const request = requests.find(item => item.id === (approveId || rejectId));
    if (!request) return;
    if (approveId) {
      const students = getStudents();
      const student = students.find(item => item.id === request.studentId);
      if (student) {
        student.grades ||= {};
        const grade = { ...(student.grades[request.subject] || {}) };
        grade.bonus = Math.min(20, Number(grade.bonus || 0) + Number(request.points));
        student.grades[request.subject] = grade;
        writeStore(KEYS.students, students);
      }
      request.status = "Approved";
      logActivity(`Approved ${request.points}pt bonus for ${request.studentName} (${subjectConfigFor(request.subject)?.shortName || request.subject})`, session.name);
    } else {
      request.status = "Rejected";
      logActivity(`Rejected a bonus request for ${request.studentName}`, session.name);
    }
    writeStore(KEYS.bonusRequests, requests);
    renderBonusRequests();
  });

  document.getElementById("studentSearch").addEventListener("input", event => renderStudentsTable(event.target.value));
  document.getElementById("studentFilterDepartment").addEventListener("change", () => renderStudentsTable(document.getElementById("studentSearch").value));
  document.getElementById("studentFilterFaculty").addEventListener("change", () => renderStudentsTable(document.getElementById("studentSearch").value));
  document.getElementById("facultySearch").addEventListener("input", event => renderFacultyTable(event.target.value));
  document.getElementById("facultyFilterDepartment").addEventListener("change", () => renderFacultyTable(document.getElementById("facultySearch").value));
  document.getElementById("addStudentBtn").addEventListener("click", () => openStudentDialog());
  document.getElementById("closeStudentDialog").addEventListener("click", () => document.getElementById("studentDialog").close());
  document.getElementById("cancelStudentDialog").addEventListener("click", () => document.getElementById("studentDialog").close());
  document.getElementById("studentForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("studentId").value;
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim().toLowerCase();
    const universityId = document.getElementById("studentRoll").value.trim();
    const department = document.getElementById("studentClass").value;
    const batch = document.getElementById("studentBatch").value.trim();
    const section = document.getElementById("studentSection").value.trim();
    const dateOfBirth = document.getElementById("studentDateOfBirth").value;
    const parentName = document.getElementById("studentParentName").value.trim();
    const parentContact = document.getElementById("studentParentContact").value.trim();
    const suspended = document.getElementById("studentSuspended").checked;
    const suspensionReason = document.getElementById("studentSuspensionReason").value.trim();
    if (!/^25000\d{5}@kluniversity\.in$/.test(email)) return showMessage(document.getElementById("studentFormMessage"), "Email must follow the format 25000xxxxx@kluniversity.in.");
    if (universityId !== email.split("@")[0]) return showMessage(document.getElementById("studentFormMessage"), "Student ID must match the number in the KL University email.");
    const students = getStudents();
    if (students.some(student => student.id !== id && (student.email.toLowerCase() === email || student.universityId === universityId))) return showMessage(document.getElementById("studentFormMessage"), "Email and student ID must be unique.");
    if (id) {
      const student = students.find(item => item.id === id);
      Object.assign(student, { name, email, universityId, department, batch, section, dateOfBirth, parentName, parentContact, suspended, suspensionReason: suspended ? suspensionReason : "" });
      const user = readStore(KEYS.users, []).find(item => item.studentId === id);
      if (user) { user.name = name; user.email = email; }
      const users = readStore(KEYS.users, []);
      const userIndex = users.findIndex(item => item.studentId === id);
      if (userIndex >= 0) { users[userIndex].name = name; users[userIndex].email = email; writeStore(KEYS.users, users); }
    } else {
      const studentId = makeId("stu");
      students.push({ id: studentId, name, email, universityId, department, batch, section, dateOfBirth, parentName, parentContact, suspended, suspensionReason: suspended ? suspensionReason : "", semester: readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER, enrolledSubjects: [...SUBJECTS], grades: {}, attendance: 0, marks: Object.fromEntries(SUBJECTS.map(subject => [subject, 0])), totalMarks: Object.fromEntries(SUBJECTS.map(subject => [subject, 100])), remarks: "Academic record has not been entered yet." });
      const users = readStore(KEYS.users, []);
      users.push({ id: makeId("usr"), name, email, password: universityId, role: "student", studentId });
      writeStore(KEYS.users, users);
    }
    writeStore(KEYS.students, students);
    logActivity(`${id ? "Updated" : "Created"} student ${name}`, session.name);
    document.getElementById("studentDialog").close();
    refreshAll();
  });

  document.getElementById("addFacultyBtn").addEventListener("click", () => openFacultyDialog());
  document.getElementById("closeFacultyDialog").addEventListener("click", () => document.getElementById("facultyDialog").close());
  document.getElementById("cancelFacultyDialog").addEventListener("click", () => document.getElementById("facultyDialog").close());
  document.getElementById("facultyForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("facultyId").value;
    const name = document.getElementById("facultyName").value.trim();
    const email = document.getElementById("facultyEmail").value.trim().toLowerCase();
    const subjects = [...document.querySelectorAll("#adminFacultySubjectChoices input:checked")].map(input => input.value);
    const mentorSections = [...document.querySelectorAll("#adminMentorSectionChoices input:checked")].map(input => input.value);
    if (!/^25000\d{5}@kluniversity\.in$/.test(email)) return showMessage(document.getElementById("facultyFormMessage"), "Email must follow the KL University format.");
    if (!subjects.length) return showMessage(document.getElementById("facultyFormMessage"), "Select at least one assigned subject.");
    const users = readStore(KEYS.users, []);
    if (users.some(user => user.id !== id && user.email.toLowerCase() === email)) return showMessage(document.getElementById("facultyFormMessage"), "This email is already registered.");
    if (id) {
      const faculty = users.find(user => user.id === id && user.role === "faculty");
      if (!faculty) return;
      Object.assign(faculty, { name, email, subjects, mentorSections });
    } else {
      users.push({ id: makeId("usr_faculty"), name, email, password: email.split("@")[0], role: "faculty", subjects, mentorSections, archived: false });
    }
    writeStore(KEYS.users, users);
    logActivity(`${id ? "Updated" : "Created"} faculty ${name}`, session.name);
    document.getElementById("facultyDialog").close();
    refreshAll();
  });

  document.getElementById("recordStudentSelect").addEventListener("change", event => loadRecordForm(event.target.value));
  document.getElementById("recordForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("recordStudentSelect").value;
    const students = getStudents();
    const student = students.find(item => item.id === id);
    if (!student) return;
    student.totalMarks ||= {};
    for (const input of document.querySelectorAll("#marksInputs [data-subject]")) {
      const totalInput = document.querySelector(`#marksInputs [data-total-subject="${input.dataset.subject}"]`);
      if (!Number.isFinite(Number(input.value)) || Number(input.value) < 0 || !Number.isFinite(Number(totalInput.value)) || Number(totalInput.value) <= 0 || Number(input.value) > Number(totalInput.value)) return showMessage(document.getElementById("recordMessage"), `${input.dataset.subject} requires valid marks that do not exceed the total.`);
      student.marks[input.dataset.subject] = Number(input.value);
      student.totalMarks[input.dataset.subject] = Number(totalInput.value);
    }
    student.remarks = document.getElementById("remarksInput").value.trim();
    writeStore(KEYS.students, students);
    logActivity(`Updated academic record for ${student.name}`, session.name);
    showMessage(document.getElementById("recordMessage"), "Academic record saved successfully.", true);
    refreshAll();
    showMessage(document.getElementById("recordMessage"), "Academic record saved successfully.", true);
  });
  document.getElementById("attendanceStudentSelect").addEventListener("change", event => loadAttendanceForm(event.target.value));
  document.getElementById("attendanceInputs").addEventListener("input", updateAttendancePreview);
  document.getElementById("attendanceForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("attendanceStudentSelect").value;
    const students = getStudents();
    const student = students.find(item => item.id === id);
    if (!student) return;
    const attendanceInputs = [...document.querySelectorAll("#attendanceInputs [data-attendance-subject]")];
    if (attendanceInputs.some(input => !isValidPercentage(input.value))) return showMessage(document.getElementById("attendanceMessage"), "Every attendance value must be between 0 and 100.");
    student.subjectAttendance = Object.fromEntries(SUBJECTS.map(subject => {
      const primary = Number(document.querySelector(`[data-attendance-subject="${subject}"][data-period="primary"]`).value);
      const secondary = Number(document.querySelector(`[data-attendance-subject="${subject}"][data-period="secondary"]`).value);
      return [subject, { primary, secondary }];
    }));
    student.attendance = overallAttendanceFor(student);
    writeStore(KEYS.students, students);
    logActivity(`Updated attendance for ${student.name}`, session.name);
    refreshAll();
    showMessage(document.getElementById("attendanceMessage"), "Attendance saved successfully.", true);
  });
  document.getElementById("reportStudentSelect").addEventListener("change", event => renderAdminReport(event.target.value));
  document.getElementById("printAdminReport").addEventListener("click", () => window.print());

  document.getElementById("timetableSubject").innerHTML = subjectOptions();
  document.getElementById("examSubject").innerHTML = subjectOptions();
  document.getElementById("timetableForm").addEventListener("submit", event => {
    event.preventDefault();
    const start = document.getElementById("timetableStart").value;
    const end = document.getElementById("timetableEnd").value;
    if (end <= start) return showMessage(document.getElementById("timetableMessage"), "End time must be after the start time.");
    const records = getAcademicRecords("timetable");
    records.push({ id: makeId("slot"), day: document.getElementById("timetableDay").value, start, end, subject: document.getElementById("timetableSubject").value, room: document.getElementById("timetableRoom").value.trim() });
    writeStore(KEYS.timetable, records);
    event.target.reset();
    renderAcademicSetup();
    showMessage(document.getElementById("timetableMessage"), "Timetable slot added.", true);
  });
  document.getElementById("examForm").addEventListener("submit", event => {
    event.preventDefault();
    const records = getAcademicRecords("exams");
    records.push({ id: makeId("exam"), subject: document.getElementById("examSubject").value, type: document.getElementById("examType").value.trim(), date: document.getElementById("examDate").value, time: document.getElementById("examTime").value, room: document.getElementById("examRoom").value.trim() });
    writeStore(KEYS.exams, records);
    event.target.reset();
    renderAcademicSetup();
    showMessage(document.getElementById("examMessage"), "Examination added.", true);
  });
  const termSettings = readStore(KEYS.settings, {});
  document.getElementById("academicYear").value = termSettings.academicYear || "2026-2027";
  document.getElementById("semesterName").value = termSettings.semesterName || CURRENT_SEMESTER;
  document.getElementById("semesterStart").value = termSettings.semesterStart || "2026-07-01";
  document.getElementById("semesterEnd").value = termSettings.semesterEnd || "2026-12-15";
  document.getElementById("termSettingsForm").addEventListener("submit", event => {
    event.preventDefault();
    const start = document.getElementById("semesterStart").value;
    const end = document.getElementById("semesterEnd").value;
    if (end <= start) return showMessage(document.getElementById("termSettingsMessage"), "Semester end date must be after its start date.");
    const current = readStore(KEYS.settings, {});
    writeStore(KEYS.settings, { ...current, academicYear: document.getElementById("academicYear").value.trim(), semesterName: document.getElementById("semesterName").value.trim(), semesterStart: start, semesterEnd: end });
    logActivity(`Updated academic period to ${document.getElementById("semesterName").value.trim()}`, session.name);
    showMessage(document.getElementById("termSettingsMessage"), "Academic period saved.", true);
  });
  const weights = getWeights();
  document.getElementById("weightInternal").value = weights.internal;
  document.getElementById("weightMid1").value = weights.mid1;
  document.getElementById("weightMid2").value = weights.mid2;
  document.getElementById("weightSemEnd").value = weights.semEnd;
  document.getElementById("examWeightsForm").addEventListener("submit", event => {
    event.preventDefault();
    const next = { internal: Number(document.getElementById("weightInternal").value), mid1: Number(document.getElementById("weightMid1").value), mid2: Number(document.getElementById("weightMid2").value), semEnd: Number(document.getElementById("weightSemEnd").value) };
    if (next.internal + next.mid1 + next.mid2 + next.semEnd !== 100) return showMessage(document.getElementById("examWeightsMessage"), "Weightage must add up to 100.");
    writeStore(KEYS.weights, next);
    logActivity("Updated examination weightage", session.name);
    showMessage(document.getElementById("examWeightsMessage"), "Weightage saved.", true);
    refreshAll();
  });
  document.getElementById("academicSetup").addEventListener("click", event => {
    const slotId = event.target.dataset.deleteSlot;
    const examId = event.target.dataset.deleteExam;
    if (slotId) writeStore(KEYS.timetable, getAcademicRecords("timetable").filter(item => item.id !== slotId));
    if (examId) writeStore(KEYS.exams, getAcademicRecords("exams").filter(item => item.id !== examId));
    if (slotId || examId) renderAcademicSetup();
  });
  document.getElementById("registrationStudent").addEventListener("change", renderRegistrationChoices);
  const renderRegistrationStatus = () => {
    const windowRecord = getRegistrationWindow();
    const state = registrationWindowState(windowRecord);
    const pill = document.getElementById("regWindowStatus");
    pill.className = `status-pill ${state === "open" ? "good" : state === "upcoming" ? "warn" : "bad"}`;
    pill.textContent = windowRecord ? `Registration ${state} · ${formatAcademicDate(windowRecord.opens)} to ${formatAcademicDate(windowRecord.closes)}` : "No window set";
    const students = getStudents();
    const departmentSelect = document.getElementById("regFilterDepartment");
    const departments = [...new Set(students.map(student => student.department).filter(Boolean))].sort();
    const departmentValue = departmentSelect.value || "all";
    departmentSelect.innerHTML = `<option value="all">All departments</option>${departments.map(department => `<option value="${escapeHtml(department)}" ${department === departmentValue ? "selected" : ""}>${escapeHtml(department)}</option>`).join("")}`;
    const filtered = students.filter(student => departmentValue === "all" || student.department === departmentValue);
    document.getElementById("regStatusBody").innerHTML = filtered.map(student => {
      const registeredAt = student.courseRegistration?.registeredAt;
      return `<tr><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.department)} · ${escapeHtml(student.section)}</td><td><span class="status-pill ${registeredAt ? "good" : "warn"}">${registeredAt ? "Registered" : "Pending"}</span></td><td>${registeredAt ? formatAcademicDate(registeredAt.slice(0, 10)) : "—"}</td></tr>`;
    }).join("");
  };
  document.getElementById("regFilterDepartment")?.addEventListener("change", renderRegistrationStatus);
  document.getElementById("bulkRegisterBtn")?.addEventListener("click", () => {
    const students = getStudents();
    let count = 0;
    students.forEach(student => {
      if (!student.courseRegistration?.registeredAt) {
        student.enrolledSubjects = student.enrolledSubjects?.length ? student.enrolledSubjects : [...SUBJECTS];
        student.courseRegistration = { registeredAt: new Date().toISOString(), selections: {} };
        count++;
      }
    });
    writeStore(KEYS.students, students);
    logActivity(`Bulk-registered ${count} pending student(s) with default subjects`, session.name);
    showMessage(document.getElementById("bulkRegisterMessage"), `${count} student(s) registered.`, true);
    renderRegistrationStatus();
  });
  const savedWindow = getRegistrationWindow();
  if (savedWindow) {
    document.getElementById("regWindowOpens").value = savedWindow.opens;
    document.getElementById("regWindowCloses").value = savedWindow.closes;
    document.getElementById("regWindowNotice").value = savedWindow.notice || "";
  }
  document.getElementById("registrationWindowForm").addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("regWindowMessage");
    const opens = document.getElementById("regWindowOpens").value;
    const closes = document.getElementById("regWindowCloses").value;
    const notice = document.getElementById("regWindowNotice").value.trim();
    if (!opens || !closes || closes < opens) return showMessage(message, "The closing date must be on or after the opening date.");
    const term = readStore(KEYS.settings, {});
    writeStore(KEYS.registrationWindow, { academicYear: term.academicYear || "2026-2027", semester: /even/i.test(term.semesterName || "") ? "Even Sem" : "Odd Sem", opens, closes, notice });
    const notices = getAcademicRecords("announcements").filter(item => item.id !== "notice_registration_window");
    notices.push({ id: "notice_registration_window", title: "Course registration window", message: `${notice ? `${notice} ` : ""}Registration is open from ${formatAcademicDate(opens)} to ${formatAcademicDate(closes)}.`, audience: "student", date: todayIso(), author: session.name });
    writeStore(KEYS.announcements, notices);
    logActivity(`Set registration window ${opens} to ${closes}`, session.name);
    showMessage(message, "Window saved and students notified.", true);
    refreshAll();
  });

  document.getElementById("adminRegistrationForm").addEventListener("submit", event => {
    event.preventDefault();
    const subjects = [...document.querySelectorAll("#adminRegistrationChoices input:checked")].map(input => input.value);
    if (!subjects.length) return showMessage(document.getElementById("adminRegistrationMessage"), "Select at least one subject.");
    const students = getStudents();
    const student = students.find(item => item.id === document.getElementById("registrationStudent").value);
    if (!student) return;
    student.enrolledSubjects = subjects;
    writeStore(KEYS.students, students);
    showMessage(document.getElementById("adminRegistrationMessage"), "Course registration saved.", true);
  });
  document.getElementById("adminAnnouncementForm").addEventListener("submit", event => {
    event.preventDefault();
    const records = getAcademicRecords("announcements");
    records.push({ id: makeId("notice"), title: document.getElementById("adminAnnouncementTitle").value.trim(), message: document.getElementById("adminAnnouncementMessage").value.trim(), audience: document.getElementById("adminAnnouncementAudience").value, date: new Date().toISOString().slice(0, 10), author: session.name });
    writeStore(KEYS.announcements, records);
    event.target.reset();
    renderAcademicSetup();
    showMessage(document.getElementById("adminAnnouncementStatus"), "Announcement published.", true);
  });
  document.getElementById("adminAnnouncementList").addEventListener("click", event => {
    if (!event.target.dataset.deleteAnnouncement) return;
    writeStore(KEYS.announcements, getAcademicRecords("announcements").filter(item => item.id !== event.target.dataset.deleteAnnouncement));
    renderAcademicSetup();
  });
  document.getElementById("publishGradesBtn").addEventListener("click", () => {
    const students = getStudents();
    const publications = readStore(KEYS.publications, []);
    const semester = readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER;
    const incompleteStudent = students.find(student => (student.enrolledSubjects || []).some(subject => !hasCompleteGrade(student.grades?.[subject])));
    if (incompleteStudent) return showMessage(document.getElementById("publishGradesMessage"), `Complete every grade component for ${incompleteStudent.name} before publishing.`);
    const requiredSubjects = [...new Set(students.flatMap(student => student.enrolledSubjects || []))];
    const submittedSubjects = new Set(readStore(KEYS.gradeSubmissions, []).filter(item => item.semester === semester && item.status === "submitted").map(item => item.subject));
    const pendingSubjects = requiredSubjects.filter(subject => !submittedSubjects.has(subject));
    if (pendingSubjects.length) return showMessage(document.getElementById("publishGradesMessage"), `Awaiting submitted gradebooks: ${pendingSubjects.map(subject => subjectConfigFor(subject)?.shortName || subject).join(", ")}.`);
    const publication = { id: makeId("publication"), semester, publishedAt: new Date().toISOString(), publishedBy: session.name, students: students.map(student => ({ id: student.id, name: student.name, universityId: student.universityId, department: student.department, section: student.section, average: averageFor(student), attendance: overallAttendanceFor(student), classRemark: student.remarks, subjects: (student.enrolledSubjects || []).map(subject => ({ subject, score: subjectPercentage(student, subject), grade: gradeFor(subjectPercentage(student, subject)), remark: student.subjectRemarks?.[subject] || "" })) })) };
    const previousIndex = publications.findIndex(item => item.semester === semester);
    if (previousIndex >= 0) publications.splice(previousIndex, 1);
    publications.unshift(publication);
    writeStore(KEYS.publications, publications);
    logActivity(`Published ${semester} results for ${students.length} students`, session.name);
    renderGradeOversight();
    showMessage(document.getElementById("publishGradesMessage"), "Current results published as a historical snapshot.", true);
  });
  document.getElementById("publicationHistory").addEventListener("click", event => {
    const publication = readStore(KEYS.publications, []).find(item => item.id === event.target.dataset.exportPublication);
    if (!publication) return;
    const rows = [["Student Name", "Student ID", "Department", "Semester", "Subject", "Score", "Grade", "Attendance"]];
    publication.students.forEach(student => student.subjects.forEach(subject => rows.push([student.name, student.universityId, student.department, publication.semester, subject.subject, Number(subject.score).toFixed(1), subject.grade, Number(student.attendance).toFixed(1)])));
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    downloadFile(csv, `${publication.semester.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}-published-results.csv`, "text/csv;charset=utf-8");
  });
  document.getElementById("facultySubmissionList").addEventListener("click", event => {
    const id = event.target.dataset.reopenSubmission;
    if (!id) return;
    const submissions = readStore(KEYS.gradeSubmissions, []);
    const submission = submissions.find(item => item.id === id);
    if (!submission) return;
    submission.status = "reopened";
    submission.reopenedAt = new Date().toISOString();
    submission.reopenedBy = session.name;
    writeStore(KEYS.gradeSubmissions, submissions);
    logActivity(`Reopened ${subjectConfigFor(submission.subject)?.shortName || submission.subject} grades`, session.name);
    renderGradeOversight();
  });

  const grading = getGrading();
  [["gradeAPlus", "aPlus"], ["gradeA", "a"], ["gradeB", "b"], ["gradeC", "c"], ["gradeD", "d"]].forEach(([elementId, key]) => { document.getElementById(elementId).value = grading[key]; });
  document.getElementById("gradingForm").addEventListener("submit", event => {
    event.preventDefault();
    const next = { aPlus: Number(document.getElementById("gradeAPlus").value), a: Number(document.getElementById("gradeA").value), b: Number(document.getElementById("gradeB").value), c: Number(document.getElementById("gradeC").value), d: Number(document.getElementById("gradeD").value) };
    if (!(next.aPlus > next.a && next.a > next.b && next.b > next.c && next.c > next.d)) return showMessage(document.getElementById("gradingMessage"), "Thresholds must decrease from A+ to D.");
    writeStore(KEYS.grading, next);
    showMessage(document.getElementById("gradingMessage"), "Grading format saved.", true);
    refreshAll();
  });
  const settings = readStore(KEYS.settings, {});
  document.getElementById("schoolName").value = settings.schoolName || "KL University";
  document.getElementById("schoolSubtitle").value = settings.reportSubtitle || "Academic Progress Report";
  document.getElementById("schoolContact").value = settings.contact || "Vaddeswaram, Andhra Pradesh";
  document.getElementById("schoolProfileForm").addEventListener("submit", event => {
    event.preventDefault();
    const current = readStore(KEYS.settings, {});
    writeStore(KEYS.settings, { ...current, schoolName: document.getElementById("schoolName").value.trim(), reportSubtitle: document.getElementById("schoolSubtitle").value.trim(), contact: document.getElementById("schoolContact").value.trim() });
    logActivity("Updated university report profile", session.name);
    showMessage(document.getElementById("schoolProfileMessage"), "University profile saved.", true);
  });
  document.getElementById("exportBackupBtn").addEventListener("click", () => {
    const backup = { version: 1, exportedAt: new Date().toISOString(), data: Object.fromEntries(Object.entries(KEYS).map(([name, key]) => [name, readStore(key, null)])) };
    downloadFile(JSON.stringify(backup, null, 2), `student-report-system-backup-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
    logActivity("Exported a full JSON backup", session.name);
  });
  document.getElementById("exportStudentsBtn").addEventListener("click", () => {
    const rows = [["Student Name", "Student ID", "Email", "Department", "Semester", "Status", "Attendance", "Average"], ...getStudents(true).map(student => [student.name, student.universityId, student.email, student.department, student.semester, student.archived ? "Archived" : "Active", Number(student.attendance).toFixed(1), averageFor(student).toFixed(1)])];
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    downloadFile(csv, "student-list.csv", "text/csv;charset=utf-8");
    logActivity("Exported the student list", session.name);
  });
  document.getElementById("importBackupInput").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (backup.version !== 1 || !backup.data || !Array.isArray(backup.data.users) || !Array.isArray(backup.data.students)) throw new Error("Invalid backup");
      Object.entries(KEYS).forEach(([name, key]) => { if (backup.data[name] !== undefined && backup.data[name] !== null) writeStore(key, backup.data[name]); });
      window.location.reload();
    } catch (_) {
      showMessage(document.getElementById("backupMessage"), "The selected file is not a valid Student Report System backup.");
      event.target.value = "";
    }
  });
  refreshAll();
}

function setupFaculty() {
  const session = protectPage("faculty");
  if (!session) return;
  setupDashboardShell(session);

  const getFaculty = () => readStore(KEYS.users, []).find(user => user.id === session.id && user.role === "faculty");
  const assignedSubjects = () => (getFaculty()?.subjects || []).filter(subject => SUBJECTS.includes(subject));
  const currentSemester = () => readStore(KEYS.settings, {}).semesterName || CURRENT_SEMESTER;
  const gradeSubmissionFor = subject => readStore(KEYS.gradeSubmissions, []).find(item => item.facultyId === session.id && item.subject === subject && item.semester === currentSemester());
  const gradebookLocked = subject => gradeSubmissionFor(subject)?.status === "submitted";
  const studentsForSubject = subject => {
    if (!assignedSubjects().includes(subject)) return [];
    return getStudents().filter(student => student.enrolledSubjects?.includes(subject));
  };
  const fillSubjectSelect = (select, selected) => {
    const subjects = assignedSubjects();
    select.innerHTML = subjects.map(subject => `<option value="${escapeHtml(subject)}" ${subject === selected ? "selected" : ""}>${escapeHtml(subjectConfigFor(subject).shortName)}</option>`).join("");
  };

  const renderOverview = () => {
    const subjects = assignedSubjects();
    const uniqueStudents = new Set(subjects.flatMap(subject => studentsForSubject(subject).map(student => student.id)));
    const records = subjects.flatMap(subject => studentsForSubject(subject).map(student => student.grades?.[subject]).filter(Boolean));
    document.getElementById("assignedSubjectCount").textContent = subjects.length;
    document.getElementById("facultyStudentCount").textContent = uniqueStudents.size;
    document.getElementById("facultyGradedCount").textContent = records.length;
    document.getElementById("facultyOverallAverage").textContent = `${(records.reduce((sum, grade) => sum + finalScoreFor(grade), 0) / (records.length || 1)).toFixed(1)}%`;
    const today = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
    const todaySlots = getAcademicRecords("timetable").filter(slot => slot.day === today && subjects.includes(slot.subject));
    document.getElementById("facultyTodaySchedule").innerHTML = todaySlots.length ? timetableHtml(subjects, false, today) : `<div class="empty-state">No classes scheduled for ${today}.</div>`;
    const pendingSubmissions = subjects.filter(subject => !gradebookLocked(subject)).length;
    const upcomingAssignments = getAcademicRecords("assignments").filter(item => subjects.includes(item.subject) && item.dueDate >= new Date().toISOString().slice(0, 10)).length;
    const lowAttendance = new Set(subjects.flatMap(subject => studentsForSubject(subject).filter(student => subjectAttendanceFor(student, subject) < 75).map(student => student.id))).size;
    document.getElementById("facultyPendingTasks").innerHTML = [[pendingSubmissions, "gradebooks awaiting submission"], [upcomingAssignments, "upcoming assignment deadlines"], [lowAttendance, "students below 75% attendance"]].map(([count, label]) => `<div class="action-item"><strong>${count}</strong><span>${label}</span></div>`).join("");
    const staffNotices = getAcademicRecords("announcements").filter(item => item.audience === "all" || item.audience === "faculty").slice(-3);
    document.getElementById("facultyRecentAnnouncements").innerHTML = announcementHtml(staffNotices);
    document.getElementById("facultySubjectCards").innerHTML = subjects.length ? subjects.map(subject => {
      const students = studentsForSubject(subject);
      const average = students.reduce((sum, student) => sum + finalScoreFor(student.grades?.[subject]), 0) / (students.length || 1);
      return `<button type="button" class="faculty-subject-card" data-open-subject="${escapeHtml(subject)}"><span>${escapeHtml(subjectConfigFor(subject).shortName)}</span><strong>${average.toFixed(1)}%</strong><small>${students.length} enrolled students</small></button>`;
    }).join("") : `<div class="panel empty-state">No teaching subjects assigned. Open Teaching Subjects to select courses.</div>`;
    document.querySelectorAll("[data-open-subject]").forEach(button => button.addEventListener("click", () => {
      fillSubjectSelect(document.getElementById("gradebookSubject"), button.dataset.openSubject);
      renderGradebook();
      document.querySelector('[data-section="facultyGradebook"]').click();
    }));
  };

  const renderGradebook = () => {
    const subject = document.getElementById("gradebookSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const query = document.getElementById("gradebookSearch").value.trim().toLowerCase();
    const locked = gradebookLocked(subject);
    const students = studentsForSubject(subject).filter(student => [student.name, student.universityId].some(value => value.toLowerCase().includes(query)));
    document.getElementById("gradebookCount").textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;
    document.getElementById("gradebookBody").innerHTML = students.length ? students.map(student => {
      const grade = student.grades?.[subject] || {};
      const components = ["assignment", "alm", "quiz", "lab", "mid1", "mid2", "semEnd"];
      const inputs = components.map(component => `<td><input class="grade-input" type="number" min="0" max="100" value="${Number(grade[component]) || 0}" data-component="${component}" aria-label="${component} for ${escapeHtml(student.name)}" ${locked ? "disabled" : ""} required></td>`);
      return `<tr data-grade-student="${student.id}"><td><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.universityId)}</small></td>${inputs.slice(0, 4).join("")}<td class="calculated" data-internal>${internalScoreFor(grade).toFixed(1)}</td>${inputs.slice(4).join("")}<td class="calculated" data-final>${finalScoreFor(grade).toFixed(1)}</td></tr>`;
    }).join("") : `<tr><td colspan="10" class="empty-state">No enrolled students match this search.</td></tr>`;
    const submission = gradeSubmissionFor(subject);
    document.getElementById("gradebookStatus").textContent = locked ? "Submitted" : submission?.status === "reopened" ? "Reopened" : "Draft";
    document.getElementById("gradebookStatus").className = `status-pill ${locked ? "good" : "warn"}`;
    document.getElementById("gradebookSubmissionInfo").textContent = locked ? `Locked after submission on ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(submission.submittedAt))}. Admin must reopen it for corrections.` : submission?.status === "reopened" ? "Admin reopened this gradebook for corrections." : "Grades are editable until submitted.";
    document.getElementById("saveGradebookBtn").disabled = locked;
    document.getElementById("submitGradebookBtn").disabled = locked;
    showMessage(document.getElementById("gradebookMessage"), "");
  };

  const updateGradeRow = input => {
    const row = input.closest("tr");
    const values = Object.fromEntries([...row.querySelectorAll("[data-component]")].map(field => [field.dataset.component, Number(field.value) || 0]));
    row.querySelector("[data-internal]").textContent = internalScoreFor(values).toFixed(1);
    row.querySelector("[data-final]").textContent = finalScoreFor(values).toFixed(1);
  };

  const renderReport = () => {
    const subject = document.getElementById("reportSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const students = studentsForSubject(subject);
    const scores = students.map(student => finalScoreFor(student.grades?.[subject]));
    const average = scores.reduce((sum, score) => sum + score, 0) / (scores.length || 1);
    const highest = scores.length ? Math.max(...scores) : 0;
    const passCount = scores.filter(score => score >= getGrading().d).length;
    document.getElementById("facultyReportSummary").innerHTML = `<article class="stat-card"><span class="stat-icon blue">%</span><div><p>Subject Average</p><strong>${average.toFixed(1)}%</strong><small>${students.length} students</small></div></article><article class="stat-card"><span class="stat-icon green">↑</span><div><p>Highest Score</p><strong>${highest.toFixed(1)}%</strong><small>Current subject</small></div></article><article class="stat-card"><span class="stat-icon amber">✓</span><div><p>Pass Rate</p><strong>${(passCount / (students.length || 1) * 100).toFixed(1)}%</strong><small>${passCount} students passed</small></div></article><article class="stat-card"><span class="stat-icon purple">G</span><div><p>Average GPA</p><strong>${(average / 10).toFixed(2)}</strong><small>10-point scale</small></div></article>`;
    const distribution = ["A+", "A", "B", "C", "D", "F"].map(grade => [grade, scores.filter(score => gradeFor(score) === grade).length]);
    document.getElementById("facultyGradeDistribution").innerHTML = `<strong>Grade distribution</strong>${distribution.map(([grade, count]) => `<span><b>${grade}</b>${count}</span>`).join("")}`;
    document.getElementById("facultyReportBody").innerHTML = students.map(student => {
      const grade = student.grades?.[subject] || {};
      const final = finalScoreFor(grade);
      return `<tr><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.semester)}</td><td>${internalScoreFor(grade).toFixed(1)}</td><td>${Number(grade.mid1) || 0}</td><td>${Number(grade.mid2) || 0}</td><td>${Number(grade.semEnd) || 0}</td><td><strong>${final.toFixed(1)}</strong></td><td>${gradeFor(final)}</td></tr>`;
    }).join("");
  };

  const renderSubjectSettings = () => {
    const selected = assignedSubjects();
    document.getElementById("facultySubjectChoices").innerHTML = SUBJECTS.map(subject => `<label><input type="checkbox" value="${escapeHtml(subject)}" ${selected.includes(subject) ? "checked" : ""} disabled>${escapeHtml(subject)}</label>`).join("");
  };

  const renderRoster = () => {
    const subject = document.getElementById("rosterSubject").value;
    const query = document.getElementById("rosterSearch").value.trim().toLowerCase();
    const students = studentsForSubject(subject).filter(student => [student.name, student.universityId, student.section || ""].some(value => value.toLowerCase().includes(query)));
    document.getElementById("rosterCount").textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;
    document.getElementById("facultyRosterBody").innerHTML = students.length ? students.map(student => `<tr><td><div class="student-cell"><span class="avatar">${escapeHtml(student.name.charAt(0))}</span><div><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.email)}</small></div></div></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.department)}</td><td>${escapeHtml(student.batch || "2025-2029")} · ${escapeHtml(student.section || `${student.department}-1`)}</td><td><span class="status-pill ${attendanceClass(subjectAttendanceFor(student, subject))}">${subjectAttendanceFor(student, subject).toFixed(1)}%</span></td><td>${subjectPercentage(student, subject).toFixed(1)}%</td><td><button type="button" class="btn secondary small" data-faculty-view-report="${student.id}">View Report</button></td></tr>`).join("") : `<tr><td colspan="7" class="empty-state">No students match this class roster.</td></tr>`;
    document.querySelectorAll("[data-faculty-view-report]").forEach(button => button.addEventListener("click", () => {
      const student = getStudents().find(item => item.id === button.dataset.facultyViewReport);
      document.getElementById("facultyReportContainer").innerHTML = reportHtml(student);
      document.getElementById("facultyReportDialog").showModal();
    }));
  };

  const renderFacultyAttendance = () => {
    const subject = document.getElementById("facultyAttendanceSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const config = subjectConfigFor(subject);
    document.getElementById("facultyPrimaryHeading").textContent = `${config.primary} (75%)`;
    document.getElementById("facultySecondaryHeading").textContent = `${config.secondary} (25%)`;
    document.getElementById("facultyAttendanceBody").innerHTML = studentsForSubject(subject).map(student => {
      const record = student.subjectAttendance?.[subject] || { primary: 0, secondary: 0 };
      return `<tr data-attendance-student="${student.id}"><td><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.universityId)} · ${escapeHtml(student.section || `${student.department}-1`)}</small></td><td><input class="attendance-input" type="number" min="0" max="100" value="${Number(record.primary) || 0}" data-attendance-period="primary" required></td><td><input class="attendance-input" type="number" min="0" max="100" value="${Number(record.secondary) || 0}" data-attendance-period="secondary" required></td><td><strong data-attendance-calculated>${subjectAttendanceFor(student, subject).toFixed(1)}%</strong></td></tr>`;
    }).join("");
    showMessage(document.getElementById("facultyAttendanceMessage"), "");
  };

  const renderRemarks = () => {
    const subject = document.getElementById("remarksSubject").value;
    document.getElementById("facultyRemarksList").innerHTML = studentsForSubject(subject).map(student => `<label class="remark-entry"><span><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.universityId)} · ${escapeHtml(student.section || `${student.department}-1`)}</small></span><textarea rows="2" maxlength="240" data-remark-student="${student.id}" placeholder="Add subject feedback">${escapeHtml(student.subjectRemarks?.[subject] || "")}</textarea></label>`).join("") || `<div class="empty-state">No students are enrolled in this subject.</div>`;
    showMessage(document.getElementById("facultyRemarksMessage"), "");
  };

  const renderFacultyHistory = () => {
    const subjects = assignedSubjects();
    const history = readStore(KEYS.publications, []).map(publication => ({ ...publication, subjectCount: new Set(publication.students.flatMap(student => student.subjects.filter(item => subjects.includes(item.subject)).map(item => item.subject))).size })).filter(item => item.subjectCount);
    document.getElementById("facultyHistory").innerHTML = history.length ? `<div class="table-wrap"><table><thead><tr><th>Published</th><th>Semester</th><th>Assigned Subjects Included</th><th>Students</th></tr></thead><tbody>${history.map(item => `<tr><td>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.publishedAt))}</td><td>${escapeHtml(item.semester)}</td><td>${item.subjectCount}</td><td>${item.students.length}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">No published history is available yet.</div>`;
  };

  const renderFacultyAcademicTools = () => {
    const subjects = assignedSubjects();
    const assignments = getAcademicRecords("assignments").filter(item => subjects.includes(item.subject));
    document.getElementById("facultyAssignmentList").innerHTML = assignmentHtml(assignments, null, true);
    document.getElementById("facultyTimetable").innerHTML = timetableHtml(subjects);
    document.getElementById("facultyExams").innerHTML = examScheduleHtml(subjects);
    const announcements = getAcademicRecords("announcements").filter(item => item.audience === "all" || item.audience === "faculty" || subjects.includes(item.subject));
    document.getElementById("facultyAnnouncementList").innerHTML = announcementHtml(announcements);
  };

  const initialize = () => {
    const selectedGradebook = document.getElementById("gradebookSubject").value || assignedSubjects()[0];
    const selectedReport = document.getElementById("reportSubject").value || assignedSubjects()[0];
    fillSubjectSelect(document.getElementById("gradebookSubject"), selectedGradebook);
    fillSubjectSelect(document.getElementById("reportSubject"), selectedReport);
    renderOverview();
    renderGradebook();
    renderReport();
    renderFacultyHistory();
    renderSubjectSettings();
    fillSubjectSelect(document.getElementById("assignmentSubject"), document.getElementById("assignmentSubject").value || assignedSubjects()[0]);
    fillSubjectSelect(document.getElementById("facultyAnnouncementSubject"), document.getElementById("facultyAnnouncementSubject").value || assignedSubjects()[0]);
    fillSubjectSelect(document.getElementById("rosterSubject"), document.getElementById("rosterSubject").value || assignedSubjects()[0]);
    fillSubjectSelect(document.getElementById("facultyAttendanceSubject"), document.getElementById("facultyAttendanceSubject").value || assignedSubjects()[0]);
    fillSubjectSelect(document.getElementById("remarksSubject"), document.getElementById("remarksSubject").value || assignedSubjects()[0]);
    renderRoster();
    renderFacultyAttendance();
    renderRemarks();
    renderFacultyAcademicTools();
    fillSubjectSelect(document.getElementById("rollSubject"), document.getElementById("rollSubject").value || assignedSubjects()[0]);
    renderRoll();
    renderSmsLog();
    renderOutcomes();
  };

  const localDateIso = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.getElementById("rollDate").value = localDateIso();
  document.getElementById("rollDate").max = localDateIso();
  document.getElementById("rollPeriod").innerHTML = PERIOD_TIMES.map((time, i) => `<option value="${i + 1}">Period ${i + 1} (${time})</option>`).join("");
  document.getElementById("rollPeriod").value = String(currentDayAndPeriod().period);

  const rollStudents = () => {
    const section = document.getElementById("rollSection").value;
    return studentsForSubject(document.getElementById("rollSubject").value).filter(student => section === "all" || student.section === section);
  };
  const rollRecord = () => {
    const subject = document.getElementById("rollSubject").value;
    const date = document.getElementById("rollDate").value;
    const period = Number(document.getElementById("rollPeriod").value);
    return readStore(KEYS.attendanceLog, []).find(item => item.subject === subject && item.date === date && Number(item.period) === period);
  };
  const updateRollSummary = () => {
    const rows = [...document.querySelectorAll("#rollBody [data-roll-student]")];
    const absent = rows.filter(row => row.querySelector("input:checked")?.value === "A").length;
    document.getElementById("rollSummary").textContent = rows.length ? `${rows.length - absent} present, ${absent} absent of ${rows.length}` : "";
  };
  const renderRoll = () => {
    const subject = document.getElementById("rollSubject").value;
    const componentSelect = document.getElementById("rollComponent");
    const rollConfig = subjectConfigFor(subject);
    const keepComponent = componentSelect.value === "secondary" ? "secondary" : "primary";
    componentSelect.innerHTML = rollConfig ? ["primary", "secondary"].map(part => `<option value="${part}" ${part === keepComponent ? "selected" : ""}>${escapeHtml(rollConfig[part])}</option>`).join("") : "";
    const sectionSelect = document.getElementById("rollSection");
    const sections = [...new Set(studentsForSubject(subject).map(student => student.section))].sort();
    const keep = sections.includes(sectionSelect.value) ? sectionSelect.value : "all";
    sectionSelect.innerHTML = `<option value="all">All sections</option>${sections.map(item => `<option value="${escapeHtml(item)}" ${item === keep ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}`;
    const saved = rollRecord()?.entries || {};
    const students = rollStudents();
    document.getElementById("rollBody").innerHTML = students.length ? students.map(student => {
      const absent = saved[student.id] === "A";
      const percent = subjectAttendanceFor(student, subject);
      return `<tr data-roll-student="${escapeHtml(student.id)}"><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.section)}</td><td>${escapeHtml(student.parentContact || "Not on record")}</td><td><span class="status-pill ${attendanceClass(percent)}">${percent.toFixed(1)}%</span></td><td class="roll-toggle"><label><input type="radio" name="roll_${escapeHtml(student.id)}" value="P" ${absent ? "" : "checked"}> Present</label><label><input type="radio" name="roll_${escapeHtml(student.id)}" value="A" ${absent ? "checked" : ""}> Absent</label></td></tr>`;
    }).join("") : `<tr><td colspan="6" class="empty-state">No students are enrolled in this subject.</td></tr>`;
    updateRollSummary();
    showMessage(document.getElementById("rollMessage"), saved && Object.keys(saved).length ? "Attendance for this period was already saved. Saving again updates it." : "", true);
  };
  const renderSmsLog = () => {
    const subjects = assignedSubjects();
    const messages = readStore(KEYS.smsOutbox, []).filter(item => subjects.includes(item.subject)).slice(0, 12);
    document.getElementById("smsLogBody").innerHTML = messages.length ? messages.map(item => `<tr><td>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.sentAt))}</td><td><strong>${escapeHtml(item.recipientType)}</strong><small>${escapeHtml(item.recipientName)}</small></td><td>${escapeHtml(item.to || "\u2014")}</td><td><small>${escapeHtml(item.message)}</small></td><td><span class="status-pill ${item.to ? "good" : "bad"}">${escapeHtml(item.status)}</span></td></tr>`).join("") : `<tr><td colspan="5" class="empty-state">No absence messages have been sent yet.</td></tr>`;
  };
  const renderOutcomes = () => {
    const select = document.getElementById("outcomeSubject");
    const subjects = assignedSubjects();
    const keep = subjects.includes(select.value) ? select.value : "all";
    select.innerHTML = `<option value="all">All my subjects</option>${subjects.map(subject => `<option value="${escapeHtml(subject)}" ${subject === keep ? "selected" : ""}>${escapeHtml(subjectConfigFor(subject).shortName)}</option>`).join("")}`;
    const students = keep === "all" ? [...new Map(subjects.flatMap(subject => studentsForSubject(subject)).map(student => [student.id, student])).values()] : studentsForSubject(keep);
    const rows = students.map(student => ({ student, outcome: studentOutcome(student, keep === "all" ? subjects.filter(subject => student.enrolledSubjects?.includes(subject)) : [keep]) }));
    const wanted = document.getElementById("outcomeStatus").value;
    const count = status => rows.filter(row => row.outcome.status === status).length;
    document.getElementById("outcomeStats").innerHTML = `<article class="stat-card"><span class="stat-icon blue">#</span><div><p>Students</p><strong>${rows.length}</strong><small>In ${keep === "all" ? "your subjects" : "this subject"}</small></div></article><article class="stat-card"><span class="stat-icon green">\u2713</span><div><p>Passed</p><strong>${count("Passed")}</strong><small>${rows.length ? (count("Passed") / rows.length * 100).toFixed(1) : "0.0"}% pass rate</small></div></article><article class="stat-card"><span class="stat-icon amber">!</span><div><p>Failed</p><strong>${count("Failed")}</strong><small>Below ${getGrading().d}% score</small></div></article><article class="stat-card"><span class="stat-icon purple">\u25cb</span><div><p>Detained</p><strong>${count("Detained")}</strong><small>Attendance below 75%</small></div></article>`;
    const order = { Detained: 0, Failed: 1, Passed: 2 };
    const visible = rows.filter(row => wanted === "all" || row.outcome.status === wanted).sort((a, b) => order[a.outcome.status] - order[b.outcome.status] || a.student.name.localeCompare(b.student.name));
    document.getElementById("outcomeBody").innerHTML = visible.length ? visible.map(({ student, outcome }) => `<tr><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.universityId)}</td><td>${escapeHtml(student.section)}</td><td>${outcome.average.toFixed(1)}%</td><td>${gradeFor(outcome.average)}</td><td><span class="status-pill ${attendanceClass(outcome.attendance)}">${outcome.attendance.toFixed(1)}%</span></td><td><span class="status-pill ${outcomeClass(outcome.status)}">${outcome.status}</span></td></tr>`).join("") : `<tr><td colspan="7" class="empty-state">No students match this filter.</td></tr>`;
  };

  ["rollSubject", "rollDate", "rollPeriod", "rollSection"].forEach(id => document.getElementById(id).addEventListener("change", renderRoll));
  document.getElementById("rollBody").addEventListener("change", updateRollSummary);
  document.getElementById("rollMarkAll").addEventListener("click", () => {
    document.querySelectorAll("#rollBody input[value='P']").forEach(input => { input.checked = true; });
    updateRollSummary();
  });
  document.getElementById("outcomeSubject").addEventListener("change", renderOutcomes);
  document.getElementById("outcomeStatus").addEventListener("change", renderOutcomes);
  document.getElementById("rollForm").addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("rollMessage");
    const subject = document.getElementById("rollSubject").value;
    const date = document.getElementById("rollDate").value;
    const period = Number(document.getElementById("rollPeriod").value);
    const component = document.getElementById("rollComponent").value === "secondary" ? "secondary" : "primary";
    if (!assignedSubjects().includes(subject)) return showMessage(message, "You are not assigned to this subject.");
    if (!date || date > localDateIso()) return showMessage(message, "Choose today or an earlier date.");
    const allowed = new Set(rollStudents().map(student => student.id));
    const entries = {};
    document.querySelectorAll("#rollBody [data-roll-student]").forEach(row => {
      if (allowed.has(row.dataset.rollStudent)) entries[row.dataset.rollStudent] = row.querySelector("input:checked").value;
    });
    if (!Object.keys(entries).length) return showMessage(message, "There are no students to mark.");
    const log = readStore(KEYS.attendanceLog, []);
    const existing = log.find(item => item.subject === subject && item.date === date && Number(item.period) === period);
    const previous = existing?.entries || {};
    if (existing) {
      existing.entries = { ...previous, ...entries };
      existing.facultyId = session.id;
      existing.component = component;
      existing.savedAt = new Date().toISOString();
    } else {
      log.push({ id: makeId("roll"), subject, date, period, component, facultyId: session.id, facultyName: session.name, entries, savedAt: new Date().toISOString() });
    }
    writeStore(KEYS.attendanceLog, log);
    migrateStudentData();
    const students = getStudents();
    const newlyAbsent = Object.keys(entries).filter(id => entries[id] === "A" && previous[id] !== "A");
    newlyAbsent.forEach(id => {
      const student = students.find(item => item.id === id);
      if (student) sendAbsenceAlerts(student, subject, date, period, session.name, subjectConfigFor(subject)[component]);
    });
    const absentTotal = Object.values(entries).filter(status => status === "A").length;
    logActivity(`Took ${subjectConfigFor(subject).shortName} attendance for ${date}, period ${period} (${absentTotal} absent)`, session.name);
    renderRoll();
    renderSmsLog();
    renderOutcomes();
    showMessage(message, `Attendance saved. ${absentTotal} absent; ${newlyAbsent.length * 2} text message${newlyAbsent.length === 1 ? "" : "s"} sent to parents and students.`, true);
  });

  document.getElementById("gradebookSubject").addEventListener("change", renderGradebook);
  document.getElementById("gradebookSearch").addEventListener("input", renderGradebook);
  document.getElementById("gradebookBody").addEventListener("input", event => { if (event.target.matches("[data-component]")) updateGradeRow(event.target); });
  document.getElementById("gradebookForm").addEventListener("submit", event => {
    event.preventDefault();
    const subject = document.getElementById("gradebookSubject").value;
    if (!assignedSubjects().includes(subject)) return showMessage(document.getElementById("gradebookMessage"), "You are not assigned to this subject.");
    if (gradebookLocked(subject)) return showMessage(document.getElementById("gradebookMessage"), "This gradebook is locked. Ask an administrator to reopen it.");
    const rows = [...document.querySelectorAll("[data-grade-student]")];
    if (rows.some(row => [...row.querySelectorAll("[data-component]")].some(input => !isValidPercentage(input.value)))) return showMessage(document.getElementById("gradebookMessage"), "Every mark must be between 0 and 100.");
    const students = getStudents();
    rows.forEach(row => {
      const student = students.find(item => item.id === row.dataset.gradeStudent && item.enrolledSubjects?.includes(subject));
      if (!student) return;
      student.grades ||= {};
      student.grades[subject] = Object.fromEntries([...row.querySelectorAll("[data-component]")].map(input => [input.dataset.component, Number(input.value)]));
    });
    writeStore(KEYS.students, students);
    logActivity(`Saved ${subjectConfigFor(subject)?.shortName || subject} grades`, session.name);
    initialize();
    showMessage(document.getElementById("gradebookMessage"), "Gradebook saved successfully.", true);
  });
  document.getElementById("submitGradebookBtn").addEventListener("click", () => {
    const subject = document.getElementById("gradebookSubject").value;
    if (!assignedSubjects().includes(subject) || gradebookLocked(subject)) return;
    const students = studentsForSubject(subject);
    if (!students.length || students.some(student => !student.grades?.[subject])) return showMessage(document.getElementById("gradebookMessage"), "Every enrolled student must have a grade record before submission.");
    const rows = [...document.querySelectorAll("[data-grade-student]")];
    if (rows.some(row => [...row.querySelectorAll("[data-component]")].some(input => !isValidPercentage(input.value)))) return showMessage(document.getElementById("gradebookMessage"), "Every mark must be between 0 and 100.");
    const allStudents = getStudents();
    rows.forEach(row => {
      const student = allStudents.find(item => item.id === row.dataset.gradeStudent && item.enrolledSubjects?.includes(subject));
      if (!student) return;
      student.grades ||= {};
      student.grades[subject] = Object.fromEntries([...row.querySelectorAll("[data-component]")].map(input => [input.dataset.component, Number(input.value)]));
    });
    writeStore(KEYS.students, allStudents);
    const submissions = readStore(KEYS.gradeSubmissions, []);
    const existing = gradeSubmissionFor(subject);
    const record = { id: existing?.id || makeId("submission"), facultyId: session.id, facultyName: session.name, subject, semester: currentSemester(), status: "submitted", submittedAt: new Date().toISOString() };
    if (existing) Object.assign(existing, record); else submissions.push(record);
    writeStore(KEYS.gradeSubmissions, submissions);
    logActivity(`Submitted ${subjectConfigFor(subject)?.shortName || subject} grades`, session.name);
    initialize();
    showMessage(document.getElementById("gradebookMessage"), "Gradebook submitted and locked.", true);
  });
  document.getElementById("reportSubject").addEventListener("change", renderReport);
  document.getElementById("rosterSubject").addEventListener("change", renderRoster);
  document.getElementById("rosterSearch").addEventListener("input", renderRoster);
  document.getElementById("closeFacultyReportDialog").addEventListener("click", () => document.getElementById("facultyReportDialog").close());
  document.getElementById("exportRosterBtn").addEventListener("click", () => {
    const subject = document.getElementById("rosterSubject").value;
    const rows = [["Student Name", "Student ID", "Email", "Department", "Batch", "Section", "Attendance", "Subject Score"], ...studentsForSubject(subject).map(student => [student.name, student.universityId, student.email, student.department, student.batch, student.section, subjectAttendanceFor(student, subject).toFixed(1), subjectPercentage(student, subject).toFixed(1)])];
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    downloadFile(csv, `${subjectConfigFor(subject)?.shortName.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}-roster.csv`, "text/csv;charset=utf-8");
  });
  document.getElementById("facultyAttendanceSubject").addEventListener("change", renderFacultyAttendance);
  document.getElementById("facultyAttendanceBody").addEventListener("input", event => {
    if (!event.target.matches("[data-attendance-period]")) return;
    const row = event.target.closest("tr");
    const primary = Number(row.querySelector('[data-attendance-period="primary"]').value) || 0;
    const secondary = Number(row.querySelector('[data-attendance-period="secondary"]').value) || 0;
    row.querySelector("[data-attendance-calculated]").textContent = `${(primary * 0.75 + secondary * 0.25).toFixed(1)}%`;
  });
  document.getElementById("facultyAttendanceForm").addEventListener("submit", event => {
    event.preventDefault();
    const subject = document.getElementById("facultyAttendanceSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const rows = [...document.querySelectorAll("[data-attendance-student]")];
    if (rows.some(row => [...row.querySelectorAll("[data-attendance-period]")].some(input => !isValidPercentage(input.value)))) return showMessage(document.getElementById("facultyAttendanceMessage"), "Attendance values must be between 0 and 100.");
    const students = getStudents();
    rows.forEach(row => {
      const student = students.find(item => item.id === row.dataset.attendanceStudent && item.enrolledSubjects?.includes(subject));
      if (!student) return;
      student.subjectAttendance ||= {};
      student.subjectAttendance[subject] = { primary: Number(row.querySelector('[data-attendance-period="primary"]').value), secondary: Number(row.querySelector('[data-attendance-period="secondary"]').value) };
      student.attendance = overallAttendanceFor(student);
    });
    writeStore(KEYS.students, students);
    logActivity(`Updated ${subjectConfigFor(subject)?.shortName || subject} attendance`, session.name);
    renderFacultyAttendance();
    showMessage(document.getElementById("facultyAttendanceMessage"), "Attendance saved.", true);
  });
  document.getElementById("remarksSubject").addEventListener("change", renderRemarks);
  document.getElementById("remarkPreset").addEventListener("change", event => {
    if (!event.target.value) return;
    document.querySelectorAll("[data-remark-student]").forEach(input => { if (!input.value.trim()) input.value = event.target.value; });
  });
  document.getElementById("facultyRemarksForm").addEventListener("submit", event => {
    event.preventDefault();
    const subject = document.getElementById("remarksSubject").value;
    if (!assignedSubjects().includes(subject)) return;
    const students = getStudents();
    document.querySelectorAll("[data-remark-student]").forEach(input => {
      const student = students.find(item => item.id === input.dataset.remarkStudent && item.enrolledSubjects?.includes(subject));
      if (!student) return;
      student.subjectRemarks ||= {};
      student.subjectRemarks[subject] = input.value.trim();
    });
    writeStore(KEYS.students, students);
    logActivity(`Updated ${subjectConfigFor(subject)?.shortName || subject} remarks`, session.name);
    showMessage(document.getElementById("facultyRemarksMessage"), "Student remarks saved.", true);
  });
  document.getElementById("exportFacultyReport").addEventListener("click", () => {
    const rows = [["Student Name", "Student ID", "Semester", "Subject", "Assignment", "ALM", "Quiz", "Lab", "Internals (40%)", "Mid 1 (15%)", "Mid 2 (15%)", "Semester End (30%)", "Final Score", "Grade", "GPA"]];
    assignedSubjects().forEach(subject => {
      studentsForSubject(subject).forEach(student => {
        const grade = student.grades?.[subject] || {};
        const final = finalScoreFor(grade);
        rows.push([student.name, student.universityId, student.semester, subject, grade.assignment || 0, grade.alm || 0, grade.quiz || 0, grade.lab || 0, internalScoreFor(grade).toFixed(2), grade.mid1 || 0, grade.mid2 || 0, grade.semEnd || 0, final.toFixed(2), gradeFor(final), (final / 10).toFixed(2)]);
      });
    });
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `${session.name.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}-assigned-subjects-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
  document.getElementById("facultySubjectsForm").addEventListener("submit", event => {
    event.preventDefault();
    showMessage(document.getElementById("facultySubjectsMessage"), "Subject assignments can only be changed by an administrator.");
  });
  document.getElementById("facultyAssignmentForm").addEventListener("submit", event => {
    event.preventDefault();
    const subject = document.getElementById("assignmentSubject").value;
    if (!assignedSubjects().includes(subject)) return showMessage(document.getElementById("assignmentMessage"), "You are not assigned to this subject.");
    const maxMarks = Number(document.getElementById("assignmentMarks").value);
    if (!Number.isFinite(maxMarks) || maxMarks <= 0 || maxMarks > 100) return showMessage(document.getElementById("assignmentMessage"), "Maximum marks must be between 1 and 100.");
    const records = getAcademicRecords("assignments");
    records.push({ id: makeId("assignment"), subject, title: document.getElementById("assignmentTitle").value.trim(), dueDate: document.getElementById("assignmentDue").value, maxMarks, facultyId: session.id });
    writeStore(KEYS.assignments, records);
    event.target.reset();
    initialize();
    showMessage(document.getElementById("assignmentMessage"), "Assignment published.", true);
  });
  document.getElementById("facultyAssignmentList").addEventListener("click", event => {
    const id = event.target.dataset.deleteAssignment;
    if (!id) return;
    const assignment = getAcademicRecords("assignments").find(item => item.id === id);
    if (!assignment || !assignedSubjects().includes(assignment.subject)) return;
    writeStore(KEYS.assignments, getAcademicRecords("assignments").filter(item => item.id !== id));
    renderFacultyAcademicTools();
  });
  document.getElementById("facultyAnnouncementForm").addEventListener("submit", event => {
    event.preventDefault();
    const subject = document.getElementById("facultyAnnouncementSubject").value;
    if (!assignedSubjects().includes(subject)) return showMessage(document.getElementById("facultyAnnouncementStatus"), "You are not assigned to this subject.");
    const records = getAcademicRecords("announcements");
    records.push({ id: makeId("notice"), title: document.getElementById("facultyAnnouncementTitle").value.trim(), message: document.getElementById("facultyAnnouncementMessage").value.trim(), subject, audience: "student", date: new Date().toISOString().slice(0, 10), author: session.name });
    writeStore(KEYS.announcements, records);
    event.target.reset();
    initialize();
    showMessage(document.getElementById("facultyAnnouncementStatus"), "Announcement published.", true);
  });
  const facultyProfile = getFaculty();
  document.getElementById("facultyProfileName").value = facultyProfile.name;
  document.getElementById("facultyProfileEmail").value = facultyProfile.email;
  document.getElementById("facultyProfileContact").value = facultyProfile.contact || "";
  document.getElementById("facultyProfileDepartment").value = facultyProfile.department || "";
  document.getElementById("facultyProfileForm").addEventListener("submit", event => {
    event.preventDefault();
    const password = document.getElementById("facultyProfilePassword").value;
    if (password && password !== document.getElementById("facultyProfilePasswordConfirm").value) return showMessage(document.getElementById("facultyProfileMessage"), "Password confirmation does not match.");
    const users = readStore(KEYS.users, []);
    const faculty = users.find(user => user.id === session.id && user.role === "faculty");
    if (!faculty) return;
    faculty.name = document.getElementById("facultyProfileName").value.trim();
    faculty.contact = document.getElementById("facultyProfileContact").value.trim();
    faculty.department = document.getElementById("facultyProfileDepartment").value.trim();
    if (password) faculty.password = password;
    writeStore(KEYS.users, users);
    writeStore(KEYS.session, { ...session, name: faculty.name });
    logActivity("Updated faculty profile", faculty.name);
    showMessage(document.getElementById("facultyProfileMessage"), "Profile saved.", true);
    document.getElementById("facultyProfilePassword").value = "";
    document.getElementById("facultyProfilePasswordConfirm").value = "";
  });
  initialize();
}

function setupStudent() {
  const session = protectPage("student");
  if (!session) return;
  setupDashboardShell(session);
  const student = getStudents().find(item => item.id === session.studentId);
  if (!student) {
    document.querySelector(".content-area").innerHTML = `<div class="panel empty-state"><h2>Profile not linked</h2><p>Ask the administrator to connect your account to a student record.</p></div>`;
    return;
  }
  const average = averageFor(student);
  const enrolledSubjects = student.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS;
  const facultyUsers = readStore(KEYS.users, []).filter(user => user.role === "faculty" && !user.archived);
  const facultyForSubject = subject => facultyUsers.find(faculty => faculty.subjects?.includes(subject));
  const studentAnnouncements = getAcademicRecords("announcements").filter(item => item.audience === "all" || item.audience === "student" && (!item.subject || enrolledSubjects.includes(item.subject)));
  const publications = readStore(KEYS.publications, []).filter(publication => publication.students?.some(item => item.id === student.id)).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const currentPublication = publications.find(publication => publication.semester === student.semester);
  const best = enrolledSubjects.slice().sort((a, b) => subjectPercentage(student, b) - subjectPercentage(student, a))[0];

  // 1. HOME DASHBOARD ELEMENTS
  const cgpaVal = (average / 10).toFixed(2);
  const sgpaVal = ((average - 3) / 10).toFixed(2);
  if (document.getElementById("studentCgpaVal")) document.getElementById("studentCgpaVal").textContent = cgpaVal;
  if (document.getElementById("studentGrade")) document.getElementById("studentGrade").textContent = `SGPA: ${sgpaVal} · Grade ${gradeFor(average)}`;
  if (document.getElementById("studentAttendance")) document.getElementById("studentAttendance").textContent = `${Number(student.attendance) || 88.4}%`;
  if (document.getElementById("studentCredits")) document.getElementById("studentCredits").textContent = "21";

  renderBarChart(document.getElementById("studentSubjectChart"), enrolledSubjects, enrolledSubjects.map(subject => subjectPercentage(student, subject)), "linear-gradient(#0b74b8, #0288d1)");

  const recentUpdates = [
    { title: "25EC2206 grades published", detail: "In-Sem Exam 1 marks finalized and verified by Examination Cell", time: "2026-10-02" },
    { title: "Counselling Diary entry updated", detail: "Counsellor Dr. Killi Chandra Bhushana Rao added attendance review", time: "2026-09-29" },
    { title: "Hallticket generated for Odd Sem 2026-2027", detail: "Eligible for Regular semester end examinations", time: "2026-09-25" },
    { title: "Academic & Exam Clearance verified", detail: "Institutional clearances signed off with zero pending dues", time: "2026-09-20" }
  ];
  if (document.getElementById("studentRecentUpdates")) {
    document.getElementById("studentRecentUpdates").innerHTML = recentUpdates.map(item => `<div class="activity-item"><span>${escapeHtml(item.title)}</span><small>${escapeHtml(item.detail)}</small></div>`).join("");
  }

  // 2. EXAM DROPDOWN TOGGLE
  const examToggle = document.getElementById("examNavToggle");
  const examSubItems = document.getElementById("examNavSubItems");
  if (examToggle && examSubItems) {
    examToggle.addEventListener("click", () => {
      examSubItems.classList.toggle("open");
      const caret = examToggle.querySelector(".nav-caret");
      if (caret) caret.textContent = examSubItems.classList.contains("open") ? "▴" : "▾";
    });
  }

  // 3. GLOBAL SEARCH (Beta version)
  const globalSearchInput = document.getElementById("globalErpSearch");
  const globalDropdown = document.getElementById("globalSearchResults");
  if (globalSearchInput && globalDropdown) {
    const searchableItems = [
      { name: "Attendance register", section: "myAttendance" },
      { name: "End Exam Result", section: "endExamResults" },
      { name: "Exam Seating Room", section: "examSeating" },
      { name: "In Sem Answer Scripts (QP)", section: "inSemScripts" },
      { name: "My CGPA", section: "myCgpa" },
      { name: "Hallticket", section: "hallTicketSection" },
      { name: "Time Tables (11-Period)", section: "mySchedule" },
      { name: "Exam Clearance & No-Due", section: "academicClearance" },
      { name: "Counselling Diary", section: "counsellingDiary" },
      { name: "Feedback", section: "studentFeedback" },
      { name: "Courses & Handouts", section: "myCourses" },
      { name: "Target SGPA Simulator", section: "targetSimulator" },
      { name: "25SC2006 - Java", section: "myCourses" },
      { name: "25EC2206 - IoT", section: "myCourses" },
      { name: "25CS2102 - OS", section: "myCourses" }
    ];
    globalSearchInput.addEventListener("input", e => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        globalDropdown.hidden = true;
        return;
      }
      const matches = searchableItems.filter(item => item.name.toLowerCase().includes(q));
      if (!matches.length) {
        globalDropdown.innerHTML = `<div class="search-drop-item empty">No results found for "${escapeHtml(q)}"</div>`;
      } else {
        globalDropdown.innerHTML = matches.map(item => `<button type="button" class="search-drop-item" data-goto="${item.section}">${escapeHtml(item.name)}</button>`).join("");
      }
      globalDropdown.hidden = false;
    });
    globalDropdown.addEventListener("click", e => {
      const btn = e.target.closest("[data-goto]");
      if (btn) {
        const sec = btn.dataset.goto;
        document.querySelector(`.nav-link[data-section="${sec}"]`)?.click();
        globalDropdown.hidden = true;
        globalSearchInput.value = "";
      }
    });
  }

  // 4. THEME GEAR SETTINGS
  const themeBtn = document.getElementById("themeToggleBtn");
  const themeMenu = document.getElementById("themePaletteMenu");
  if (themeBtn && themeMenu) {
    themeBtn.addEventListener("click", () => {
      themeMenu.hidden = !themeMenu.hidden;
    });
    themeMenu.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        themeMenu.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        document.documentElement.style.setProperty("--blue", dot.dataset.color);
        document.documentElement.style.setProperty("--kl-blue", dot.dataset.color);
        themeMenu.hidden = true;
      });
    });
  }

  // 5. ACADEMIC COURSE REGISTRATION (Photos 5 & 6)
  const regSelections = readStore(KEYS.courseRegSelections, {
    "25EC2206": { lecture: "S-10-MA", skilling: "S-10-B" },
    "25AD2102": { lecture: "S-12-MA", practical: "S-12-A" },
    "25CS2102": { lecture: "S-12-MA", practical: "S-12-B" },
    "25CS2101": { practical: "S-7-C", skilling: "S-7-B" },
    "25MT1306": { lecture: "S-9-MA", tutorial: "S-9-MA" },
    "25SC2006": { lecture: "S-9-MA", skilling: "S-9-B" },
    "25SP2101": { skilling: "S-3-MA" }
  });

  const renderCourseRegistration = () => {
    const regBody = document.getElementById("courseRegBody");
    if (!regBody) return;
    const coursesToRegister = [
      ...SUBJECT_CONFIG,
      { code: "25SP2101", name: "ATHLETICS (SPORTS SKILLING)", primary: "", secondary: "Skill", ltps: "0-0-0-2", credits: 1, offeredBy: "FED-SPORTS", section: "S-3-MA" }
    ];
    regBody.innerHTML = coursesToRegister.map((c, idx) => {
      const cur = regSelections[c.code] || {};
      const hasL = c.ltps.startsWith("3") || c.ltps.startsWith("2");
      const hasT = c.ltps.split("-")[1] === "1";
      const hasP = c.ltps.split("-")[2] !== "0";
      const hasS = c.ltps.endsWith("2") || c.secondary === "Skill";

      return `<tr>
        <td>${idx + 1}</td>
        <td><strong>${c.code} - ${escapeHtml(c.name)}</strong></td>
        <td>${hasL ? `<select class="kl-sec-select" data-code="${c.code}" data-type="lecture">
          <option value="${c.section || 'S-10-MA'}" ${cur.lecture ? "selected" : ""}>${c.section || 'S-10-MA'}</option>
          <option value="S-11-MA">S-11-MA</option>
          <option value="S-12-MA">S-12-MA</option>
        </select>` : "—"}</td>
        <td>${hasT ? `<select class="kl-sec-select" data-code="${c.code}" data-type="tutorial">
          <option value="S-9-MA" selected>S-9-MA</option>
          <option value="S-10-MA">S-10-MA</option>
        </select>` : "—"}</td>
        <td>${hasP ? `<select class="kl-sec-select" data-code="${c.code}" data-type="practical">
          <option value="S-12-A" selected>S-12-A</option>
          <option value="S-7-C">S-7-C</option>
        </select>` : "—"}</td>
        <td>${hasS ? `<select class="kl-sec-select" data-code="${c.code}" data-type="skilling">
          <option value="${cur.skilling || 'S-10-B'}" selected>${cur.skilling || 'S-10-B'}</option>
          <option value="S-9-B">S-9-B</option>
          <option value="S-7-B">S-7-B</option>
          <option value="S-3-MA">S-3-MA</option>
        </select>` : "—"}</td>
        <td><button type="button" class="btn secondary small reset-sec-btn" data-reset-code="${c.code}">Reset</button></td>
      </tr>`;
    }).join("");
  };
  renderCourseRegistration();

  const regTableElem = document.getElementById("courseRegTable");
  if (regTableElem) {
    regTableElem.addEventListener("click", e => {
      const resetBtn = e.target.closest(".reset-sec-btn");
      if (resetBtn) {
        const code = resetBtn.dataset.resetCode;
        delete regSelections[code];
        writeStore(KEYS.courseRegSelections, regSelections);
        renderCourseRegistration();
      }
    });
    regTableElem.addEventListener("change", e => {
      if (e.target.classList.contains("kl-sec-select")) {
        const code = e.target.dataset.code;
        const type = e.target.dataset.type;
        regSelections[code] = regSelections[code] || {};
        regSelections[code][type] = e.target.value;
        writeStore(KEYS.courseRegSelections, regSelections);
      }
    });
  }
  const saveRegBtn = document.getElementById("saveCourseRegBtn");
  if (saveRegBtn) {
    saveRegBtn.addEventListener("click", () => {
      showMessage(document.getElementById("studentRegistrationMessage"), "Course Registration saved successfully! Timetable updated.", true);
    });
  }

  // 6. ATTENDANCE REGISTER TABLE (Matching 12-column KL ERP format)
  const renderAttendanceRegister = () => {
    const attBody = document.getElementById("studentAttendanceTableBody");
    if (!attBody) return;
    attBody.innerHTML = enrolledSubjects.map((subject, idx) => {
      const cfg = subjectConfigFor(subject) || { code: "25CS2102", ltps: "L", section: "S-10-MA" };
      const { conducted: total, attended, absent, percent } = attendanceSummaryFor(student, subject);
      const pct = percent.toFixed(2);
      const pillClass = percent >= 85 ? "good" : percent >= 75 ? "warn" : "bad";
      return `<tr>
        <td>${idx + 1}</td>
        <td><strong>${cfg.code}</strong></td>
        <td>${escapeHtml(subject)}</td>
        <td>${escapeHtml(cfg.ltps.charAt(0))}</td>
        <td>${escapeHtml(cfg.section)}</td>
        <td>2</td>
        <td>Odd Sem</td>
        <td>${total}</td>
        <td>${attended}</td>
        <td>${absent}</td>
        <td>0</td>
        <td><span class="status-pill ${pillClass}">${pct}%</span></td>
        <td><a href="#" class="view-register-link" data-subject="${escapeHtml(subject)}">Attendance Register</a></td>
      </tr>`;
    }).join("");
  };
  renderAttendanceRegister();
  const alertsBox = document.getElementById("studentSmsAlerts");
  if (alertsBox) {
    const alerts = readStore(KEYS.smsOutbox, []).filter(item => item.studentId === student.id && item.recipientType === "Student");
    alertsBox.innerHTML = alerts.length ? `<div class="activity-list">${alerts.slice(0, 8).map(item => `<div class="activity-item"><span>${escapeHtml(item.message)}</span><small>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.sentAt))} · to ${escapeHtml(item.to || "no number")}</small></div>`).join("")}</div>` : `<div class="empty-state compact-empty">No absence alerts. You have not been marked absent since roll call started.</div>`;
  }
  setupEmptyRoomViewer("studentRooms");
  document.getElementById("applyAttFilterBtn")?.addEventListener("click", renderAttendanceRegister);
  document.getElementById("resetAttFilterBtn")?.addEventListener("click", renderAttendanceRegister);
  document.getElementById("printAttendanceBtn")?.addEventListener("click", () => window.print());

  // 7. COURSES & COURSE HANDOUT MODAL
  const renderCourseCatalog = () => {
    const body = document.getElementById("courseHandoutTableBody");
    if (!body) return;
    body.innerHTML = SUBJECT_CONFIG.map((c, idx) => `<tr>
      <td>${idx + 1}</td>
      <td><strong>${c.code}</strong></td>
      <td>${escapeHtml(c.name)}</td>
      <td><span class="ltps-badge">${c.ltps}</span></td>
      <td><strong>${c.credits}</strong></td>
      <td>${c.offeredBy}</td>
      <td><button type="button" class="btn primary small view-handout-btn" data-code="${c.code}">View Handout</button></td>
    </tr>`).join("");
  };
  renderCourseCatalog();

  const handoutDialog = document.getElementById("courseHandoutDialog");
  document.getElementById("courseHandoutTableBody")?.addEventListener("click", e => {
    const btn = e.target.closest(".view-handout-btn");
    if (!btn) return;
    const code = btn.dataset.code;
    const cfg = SUBJECT_CONFIG.find(c => c.code === code) || SUBJECT_CONFIG[0];
    document.getElementById("handoutModalTitle").textContent = `${cfg.code} - ${cfg.name} (Course Handout)`;
    document.getElementById("handoutModalBody").innerHTML = `
      <div class="handout-spec-grid">
        <div><strong>Course Code:</strong> ${cfg.code}</div>
        <div><strong>Course Title:</strong> ${cfg.name}</div>
        <div><strong>Structure (L-T-P-S):</strong> ${cfg.ltps}</div>
        <div><strong>Credits:</strong> ${cfg.credits}</div>
        <div><strong>Course Coordinator:</strong> Dr. Killi Chandra Bhushana Rao</div>
        <div><strong>Department:</strong> ${cfg.offeredBy}</div>
      </div>
      <div class="handout-section mt-16">
        <h4>1. Course Outcomes (COs)</h4>
        <ul class="co-list">
          <li><strong>CO1:</strong> Understand fundamental principles, syntax, and computational concepts.</li>
          <li><strong>CO2:</strong> Apply data structures and algorithmic abstraction to engineering scenarios.</li>
          <li><strong>CO3:</strong> Analyze modular decomposition, memory management, and execution latency.</li>
          <li><strong>CO4:</strong> Design and test scalable software components for distributed systems.</li>
          <li><strong>CO5:</strong> Demonstrate skilling proficiency in continuous laboratory exercises.</li>
        </ul>
      </div>
      <div class="handout-section mt-16">
        <h4>2. Evaluation Plan & Weightages</h4>
        <div class="table-wrap">
          <table class="kl-grid-table">
            <thead>
              <tr><th>Component</th><th>Max Marks</th><th>Weightage</th><th>Target COs</th></tr>
            </thead>
            <tbody>
              <tr><td>Semester In-Exam I (QP-Wise)</td><td>50</td><td>17%</td><td>CO1, CO2</td></tr>
              <tr><td>Semester In-Exam II</td><td>50</td><td>17%</td><td>CO3, CO4</td></tr>
              <tr><td>Continuous Lab Evaluation</td><td>100</td><td>16%</td><td>CO5</td></tr>
              <tr><td>Home Assignment & ALM</td><td>25</td><td>10%</td><td>CO1, CO3</td></tr>
              <tr><td>Semester End Examination</td><td>100</td><td>40%</td><td>CO1, CO2, CO3, CO4, CO5</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
    handoutDialog.showModal();
  });
  document.getElementById("closeHandoutDialog")?.addEventListener("click", () => handoutDialog.close());
  document.getElementById("closeHandoutBtn")?.addEventListener("click", () => handoutDialog.close());
  document.getElementById("printHandoutBtn")?.addEventListener("click", () => window.print());

  // 8. END EXAM RESULTS TABLE
  const renderEndExamResults = () => {
    const body = document.getElementById("endExamResultsBody");
    if (!body) return;
    const grades = [
      { code: "25SC2006", name: "OBJECT ORIENTED PROGRAMMING USING JAVA", grade: "A+", gp: 10, credits: 4 },
      { code: "25EC2206", name: "EMBEDDED SYSTEM DESIGN AND IOT", grade: "A", gp: 9, credits: 4 },
      { code: "25AD2102", name: "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING", grade: "B+", gp: 8, credits: 4 },
      { code: "25CS2102", name: "OPERATING SYSTEMS", grade: "A", gp: 9, credits: 4 },
      { code: "25CS2101", name: "FRONT END DEVELOPMENT FRAMEWORKS FOR WEB APPLICATIONS", grade: "O", gp: 10, credits: 3 },
      { code: "25MT1306", name: "MATHEMATICS FOR DATA SCIENCE AND ANALYTICS", grade: "B", gp: 7, credits: 4 }
    ];
    body.innerHTML = grades.map((g, idx) => `<tr>
      <td>${idx + 1}</td>
      <td><strong>${g.code}</strong></td>
      <td>${escapeHtml(g.name)}</td>
      <td><span class="status-pill good">${g.grade}</span></td>
      <td><strong>${g.gp}</strong></td>
      <td>${g.credits}</td>
      <td><strong class="good-text">P</strong></td>
    </tr>`).join("");
  };
  renderEndExamResults();
  document.getElementById("fetchExamResultBtn")?.addEventListener("click", renderEndExamResults);

  // 9. EXAM SEATING ROOM ALLOTMENT (From screenshots)
  const renderExamSeating = () => {
    const body = document.getElementById("examSeatingBody");
    if (!body) return;
    const seatings = [
      { id: "10567", date: "2026-10-14", type: "Semester In-Exam I", slot: "am (09:30-11:30)", code: "25SC2006", desc: "OBJECT ORIENTED PROGRAMMING USING JAVA", room: "S813", created: "2026-10-01" },
      { id: "10568", date: "2026-10-16", type: "Semester In-Exam I", slot: "am (09:30-11:30)", code: "25EC2206", desc: "EMBEDDED SYSTEM DESIGN AND IOT", room: "SK011", created: "2026-10-01" },
      { id: "10569", date: "2026-10-18", type: "Semester In-Exam I", slot: "pm (01:30-03:30)", code: "25AD2102", desc: "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING", room: "M304", created: "2026-10-01" },
      { id: "10570", date: "2026-10-20", type: "Semester In-Exam I", slot: "am (09:30-11:30)", code: "25CS2102", desc: "OPERATING SYSTEMS", room: "C506", created: "2026-10-01" },
      { id: "10571", date: "2026-10-22", type: "Semester In-Exam I", slot: "pm (01:30-03:30)", code: "25MT1306", desc: "MATHEMATICS FOR DATA SCIENCE AND ANALYTICS", room: "R204", created: "2026-10-01" }
    ];
    body.innerHTML = seatings.map((s, idx) => `<tr>
      <td>${idx + 1}</td>
      <td>${s.id}</td>
      <td>${s.date}</td>
      <td>${s.type}</td>
      <td><span class="slot-badge">${s.slot}</span></td>
      <td><strong>${s.code}</strong></td>
      <td>${escapeHtml(s.desc)}</td>
      <td><strong class="room-pill">${s.room}</strong></td>
      <td>${s.created}</td>
    </tr>`).join("");
  };
  renderExamSeating();

  // 10. IN-SEM ANSWER SCRIPTS & QP-WISE MODAL (Exact KL ERP modal from screenshots)
  const qpModal = document.getElementById("qpWiseMarksDialog");
  const renderInSemScripts = () => {
    const body = document.getElementById("inSemScriptsBody");
    if (!body) return;
    body.innerHTML = SUBJECT_CONFIG.map((c, idx) => `<tr>
      <td>${idx + 1}</td>
      <td><strong>${c.code}</strong></td>
      <td>${escapeHtml(c.name)}</td>
      <td>Semester In-Exam I (MCQ)</td>
      <td>50</td>
      <td><strong>42</strong></td>
      <td><strong>14.28</strong></td>
      <td><a href="#" class="view-booklet-link">Booklet</a></td>
      <td><button type="button" class="btn primary small view-qp-btn" data-code="${c.code}" data-name="${escapeHtml(c.name)}">View QP Wise Marks</button></td>
    </tr>`).join("");
  };
  renderInSemScripts();

  document.getElementById("inSemScriptsBody")?.addEventListener("click", e => {
    const btn = e.target.closest(".view-qp-btn");
    if (!btn) return;
    const code = btn.dataset.code;
    const name = btn.dataset.name;
    document.getElementById("qpCourseHeader").innerHTML = `
      <p>Course: <strong>${code} - ${name}</strong> | Student ID: <strong>2500032283</strong> | Name: <strong>Pujari Santhosh</strong></p>
    `;
    document.getElementById("qpWiseMarksBody").innerHTML = `
      <tr>
        <td>2.5</td><td>3.0</td><td>3.0</td><td>2.5</td><td>3.0</td><td>3.0</td>
        <td>4.0</td><td>3.5</td><td>4.0</td><td>3.5</td>
        <td>4.0</td><td>4.5</td><td>3.5</td><td>4.0</td><td>4.0</td><td>4.0</td><td>3.5</td><td>3.5</td>
        <td><strong>50</strong></td>
        <td><strong>17</strong></td>
        <td><strong>42.5</strong></td>
        <td><strong class="good-text">14.45</strong></td>
      </tr>
    `;
    qpModal.showModal();
  });
  document.getElementById("closeQpDialog")?.addEventListener("click", () => qpModal.close());

  // 11. MY CGPA TABLE
  const renderCgpaHistory = () => {
    const body = document.getElementById("cgpaHistoryTableBody");
    if (!body) return;
    const history = [
      { term: "2025-2026 Odd Sem", code: "25SC1101", title: "PROBLEM SOLVING THROUGH PROGRAMMING IN C", credits: 4, grade: "A+", gp: 10 },
      { term: "2025-2026 Odd Sem", code: "25EC1101", title: "DIGITAL ELECTRONICS AND LOGIC DESIGN", credits: 4, grade: "A", gp: 9 },
      { term: "2025-2026 Odd Sem", code: "25MT1101", title: "SINGLE VARIABLE CALCULUS AND MATRIX ALGEBRA", credits: 4, grade: "A", gp: 9 },
      { term: "2025-2026 Odd Sem", code: "25EN1101", title: "COMMUNICATION SKILLS IN ENGLISH", credits: 3, grade: "O", gp: 10 },
      { term: "2025-2026 Even Sem", code: "25SC1202", title: "DATA STRUCTURES AND ALGORITHMS", credits: 4, grade: "A+", gp: 10 },
      { term: "2025-2026 Even Sem", code: "25CS1201", title: "COMPUTER ORGANIZATION AND ARCHITECTURE", credits: 4, grade: "A", gp: 9 },
      { term: "2025-2026 Even Sem", code: "25MT1202", title: "MULTIVARIATE CALCULUS AND DIFFERENTIAL EQUATIONS", credits: 4, grade: "B+", gp: 8 },
      { term: "2025-2026 Even Sem", code: "25PH1201", title: "PHYSICS FOR COMPUTING SCIENCES", credits: 4, grade: "A", gp: 9 },
      { term: "2026-2027 Odd Sem", code: "25SC2006", title: "OBJECT ORIENTED PROGRAMMING USING JAVA", credits: 4, grade: "A+", gp: 10 },
      { term: "2026-2027 Odd Sem", code: "25EC2206", title: "EMBEDDED SYSTEM DESIGN AND IOT", credits: 4, grade: "A", gp: 9 },
      { term: "2026-2027 Odd Sem", code: "25AD2102", title: "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING", credits: 4, grade: "B+", gp: 8 }
    ];
    body.innerHTML = history.map((item, idx) => `<tr>
      <td>${idx + 1}</td>
      <td>${item.term}</td>
      <td><strong>${item.code}</strong></td>
      <td>${escapeHtml(item.title)}</td>
      <td>${item.credits}</td>
      <td><span class="status-pill good">${item.grade}</span></td>
      <td><strong>${item.gp}</strong></td>
      <td><span class="status-pill good">Pass</span></td>
    </tr>`).join("");
  };
  renderCgpaHistory();

  // 12. OFFICIAL HALLTICKET GENERATOR (Matching KL format)
  const htContainer = document.getElementById("hallTicketContainer");
  const generateHallTicket = () => {
    if (!htContainer) return;
    const current = getStudents(true).find(s => s.id === student.id) || student;
    const cl = current.clearance || { overall: "Eligible" };
    const isHold = cl.overall === "On Hold";

    htContainer.innerHTML = `
      ${isHold ? `
        <div class="attendance-alert danger" style="margin-bottom:16px;">
          <strong>⚠️ EXAMINATION HALL TICKET WITHHELD</strong>
          <span>Your hall ticket is withheld due to institutional dues or clearance hold (${escapeHtml(cl.note || "Tuition / Exam fee pending")}). Please contact the Accounts / Examination Cell.</span>
        </div>
      ` : `
        <div class="attendance-alert success" style="margin-bottom:16px;">
          <strong>✓ HALL TICKET AUTHORIZED</strong>
          <span>Student is academically and financially cleared. Eligible for all scheduled examinations.</span>
        </div>
      `}
      <div class="official-hallticket-sheet ${isHold ? 'hallticket-withheld' : ''}">
        <div class="ht-header-strip">
          <div class="ht-logo">
            <span class="ht-circle-badge">KL</span>
          </div>
          <div class="ht-title-text">
            <h2>KONERU LAKSHMAIAH EDUCATION FOUNDATION</h2>
            <p>(Deemed to be University estd. u/s 3 of UGC Act, 1956)</p>
            <h3>END SEMESTER REGULAR EXAMINATION HALL TICKET - ODD SEM 2026-2027</h3>
          </div>
          <div class="ht-barcode">
            <div class="barcode-lines">||| | || |||| | ||| |||| | ||</div>
            <small>2500032283</small>
          </div>
        </div>

        <div class="ht-student-info-grid">
          <div><span>University ID:</span> <strong>2500032283</strong></div>
          <div><span>Student Name:</span> <strong>Pujari Santhosh</strong></div>
          <div><span>Program / Branch:</span> <strong>B.Tech - Computer Science & Engineering</strong></div>
          <div><span>Academic Year / Sem:</span> <strong>2026-2027 / Odd Sem</strong></div>
          <div><span>Campus / Centre:</span> <strong>KLEF Vaddeswaram Main Campus</strong></div>
          <div><span>Exam Status:</span> <strong class="${isHold ? 'warn-text' : 'good-text'}">${isHold ? 'WITHHELD (Dues Pending)' : 'Eligible (Cleared & Attendance > 75%)'}</strong></div>
        </div>

        <div class="table-wrap mt-16">
          <table class="kl-grid-table ht-course-table">
            <thead>
              <tr>
                <th>Date of Exam</th>
                <th>Session & Time</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Room Allotment</th>
                <th>Invigilator Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>2026-11-10</td><td>FN: 09:30 AM - 12:30 PM</td><td>25SC2006</td><td>OBJECT ORIENTED PROGRAMMING USING JAVA</td><td>S813</td><td>_____________</td></tr>
              <tr><td>2026-11-12</td><td>FN: 09:30 AM - 12:30 PM</td><td>25EC2206</td><td>EMBEDDED SYSTEM DESIGN AND IOT</td><td>SK011</td><td>_____________</td></tr>
              <tr><td>2026-11-14</td><td>AN: 01:30 PM - 04:30 PM</td><td>25AD2102</td><td>ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING</td><td>M304</td><td>_____________</td></tr>
              <tr><td>2026-11-17</td><td>FN: 09:30 AM - 12:30 PM</td><td>25CS2102</td><td>OPERATING SYSTEMS</td><td>C506</td><td>_____________</td></tr>
              <tr><td>2026-11-19</td><td>AN: 01:30 PM - 04:30 PM</td><td>25MT1306</td><td>MATHEMATICS FOR DATA SCIENCE AND ANALYTICS</td><td>R204</td><td>_____________</td></tr>
            </tbody>
          </table>
        </div>

        <div class="ht-instructions mt-16">
          <h4>Instructions to Candidates:</h4>
          <ol>
            <li>Candidate must carry the University Identity Card along with this authorized Hallticket.</li>
            <li>No candidate will be allowed inside the examination hall 15 minutes after the commencement of the exam.</li>
            <li>Possession of mobile phones, smartwatches, programmable calculators, or unauthorized materials is strictly prohibited.</li>
            <li>Verify all answers and ensure the barcode sticker is firmly affixed to the first page of the main answer booklet.</li>
          </ol>
        </div>

        <div class="ht-signature-strip">
          <div class="sig-box">Student Signature</div>
          <div class="sig-box">Dean Examinations / Controller of Examinations</div>
        </div>
      </div>
    `;
  };
  generateHallTicket();
  document.getElementById("getHallticketBtn")?.addEventListener("click", generateHallTicket);
  document.getElementById("printHallticketBtn")?.addEventListener("click", () => window.print());

  // 13. OFFICIAL 11-PERIOD DAY ORDER TIMETABLE (Photo 4)
  const renderElevenPeriodTimetable = () => {
    const body = document.getElementById("elevenPeriodBody");
    if (!body) return;
    const schedule = [
      {
        day: "Mon",
        slots: [
          "25SC2006-L<br><small>S-9 · C421A</small>",
          "25EC2206-L<br><small>S-10 · C523</small>",
          "25AD2102-L<br><small>S-12 · C018</small>",
          "25MT1306-L<br><small>S-9 · C421B</small>",
          "—",
          "—",
          "25CS2102-L<br><small>S-12 · C506</small>",
          "25SC2006-S<br><small>S-9 · Lab-3</small>",
          "25SC2006-S<br><small>S-9 · Lab-3</small>",
          "—",
          "—"
        ]
      },
      {
        day: "Tue",
        slots: [
          "—",
          "25CS2102-L<br><small>S-12 · C506</small>",
          "25SC2006-L<br><small>S-9 · C421A</small>",
          "25EC2206-L<br><small>S-10 · C523</small>",
          "—",
          "—",
          "25EC2206-S<br><small>S-10 · IoT Lab</small>",
          "25EC2206-S<br><small>S-10 · IoT Lab</small>",
          "—",
          "25SP2101-S<br><small>S-3 · Ground</small>",
          "—"
        ]
      },
      {
        day: "Wed",
        slots: [
          "25MT1306-L<br><small>S-9 · C421B</small>",
          "25AD2102-L<br><small>S-12 · C018</small>",
          "—",
          "25CS2101-P<br><small>S-7 · Web Lab</small>",
          "25CS2101-P<br><small>S-7 · Web Lab</small>",
          "—",
          "—",
          "25CS2102-P<br><small>S-12 · OS Lab</small>",
          "25CS2102-P<br><small>S-12 · OS Lab</small>",
          "—",
          "—"
        ]
      },
      {
        day: "Thu",
        slots: [
          "25EC2206-L<br><small>S-10 · C523</small>",
          "—",
          "25SC2006-L<br><small>S-9 · C421A</small>",
          "25AD2102-P<br><small>S-12 · AI Lab</small>",
          "25AD2102-P<br><small>S-12 · AI Lab</small>",
          "—",
          "25MT1306-T<br><small>S-9 · C421B</small>",
          "25CS2101-S<br><small>S-7 · Web Lab</small>",
          "—",
          "—",
          "—"
        ]
      },
      {
        day: "Fri",
        slots: [
          "25AD2102-L<br><small>S-12 · C018</small>",
          "25MT1306-L<br><small>S-9 · C421B</small>",
          "25CS2102-L<br><small>S-12 · C506</small>",
          "—",
          "—",
          "—",
          "25EC2206-S<br><small>S-10 · IoT Lab</small>",
          "25EC2206-S<br><small>S-10 · IoT Lab</small>",
          "—",
          "25SP2101-S<br><small>S-3 · Ground</small>",
          "—"
        ]
      }
    ];
    body.innerHTML = schedule.map(row => `<tr>
      <td class="sticky-col"><strong>${row.day}</strong></td>
      ${row.slots.map(s => `<td class="${s === '—' ? 'empty-cell' : 'filled-cell'}">${s}</td>`).join("")}
    </tr>`).join("");
  };
  renderElevenPeriodTimetable();
  document.getElementById("printTimetableBtn")?.addEventListener("click", () => window.print());

  // 14. ACADEMIC & EXAM CLEARANCE (NO-DUE)
  const renderAcademicClearanceDetails = () => {
    const current = getStudents(true).find(s => s.id === student.id) || student;
    const cl = current.clearance || {
      tuition: "Cleared",
      examFee: "Cleared",
      library: "Cleared",
      department: "Cleared",
      overall: "Eligible",
      note: "All tuition, exam fees, and library dues verified. Authorized for examination hall ticket."
    };
    const isHold = cl.overall === "On Hold";

    const overallBadge = document.getElementById("studentOverallClearanceBadge");
    if (overallBadge) {
      overallBadge.className = `status-pill ${isHold ? 'bad' : 'good'}`;
      overallBadge.textContent = isHold ? "Clearance On Hold (Dues Pending)" : "Eligible for Examinations";
    }

    const homeStatus = document.getElementById("homeClearanceStatus");
    const homeSub = document.getElementById("homeClearanceSub");
    if (homeStatus) {
      homeStatus.className = isHold ? "warn-text" : "good-text";
      homeStatus.textContent = isHold ? "ON HOLD" : "CLEARED";
    }
    if (homeSub) {
      homeSub.textContent = isHold ? "Clearance Pending at Accounts" : "All Fees & Dues Clean";
    }

    const tStatus = document.getElementById("tuitionClearanceStatus");
    const tRemarks = document.getElementById("tuitionClearanceRemarks");
    if (tStatus) {
      tStatus.className = cl.tuition === "Due" ? "warn-text" : "good-text";
      tStatus.textContent = cl.tuition === "Due" ? "FEE DUE" : "CLEARED";
    }
    if (tRemarks) {
      tRemarks.textContent = cl.tuition === "Due" ? "Pending clearance at Accounts" : "Accounts Office: Verified Nil Balance";
    }

    const eStatus = document.getElementById("examFeeClearanceStatus");
    const eRemarks = document.getElementById("examFeeClearanceRemarks");
    if (eStatus) {
      eStatus.className = cl.examFee === "Due" ? "warn-text" : "good-text";
      eStatus.textContent = cl.examFee === "Due" ? "DUE PENDING" : "PAID & CLEARED";
    }
    if (eRemarks) {
      eRemarks.textContent = cl.examFee === "Due" ? "Regular exam fee unpaid" : "Examination Cell: Receipt Verified";
    }

    const lStatus = document.getElementById("libraryClearanceStatus");
    const lRemarks = document.getElementById("libraryClearanceRemarks");
    if (lStatus) {
      lStatus.className = cl.library === "Due" ? "warn-text" : "good-text";
      lStatus.textContent = cl.library === "Due" ? "BOOK OVERDUE" : "CLEARED";
    }
    if (lRemarks) {
      lRemarks.textContent = cl.library === "Due" ? "Books overdue at Central Library" : "0 Books Due · All Labs Clean";
    }

    const hStatus = document.getElementById("hallticketReleaseStatus");
    const hRemarks = document.getElementById("hallticketReleaseRemarks");
    if (hStatus) {
      hStatus.className = isHold ? "warn-text" : "good-text";
      hStatus.textContent = isHold ? "WITHHELD" : "AUTHORIZED";
    }
    if (hRemarks) {
      hRemarks.textContent = isHold ? "Withheld by Academic Office" : "Cleared for Exam Hall Entry";
    }

    const body = document.getElementById("clearanceDetailsBody");
    if (!body) return;

    const departmentSignoffs = [
      { dept: "Finance & Accounts Wing", scope: "Tuition Fee & Semester Institutional Dues", status: cl.tuition === "Due" ? "Payment Due" : "Cleared", auth: "Finance Officer", date: "2026-09-20", remarks: cl.tuition === "Due" ? "Fee installment pending" : "Nil balance verified (Receipt Cleared)" },
      { dept: "Examination Cell", scope: "Semester Regular Exam Fee & Exam Registration", status: cl.examFee === "Due" ? "Fee Unpaid" : "Cleared", auth: "Controller of Examinations", date: "2026-09-22", remarks: cl.examFee === "Due" ? "Exam challan not submitted" : "Exam registration confirmed" },
      { dept: "Central University Library", scope: "Issued Books, Fines & Digital Access", status: cl.library === "Due" ? "Books Due" : "Cleared", auth: "Chief Librarian", date: "2026-09-24", remarks: cl.library === "Due" ? "1 book pending return" : "Zero books pending / No overdue fines" },
      { dept: "Department Laboratories", scope: "CSE Labs, Tool Licenses & Hardware Kits", status: "Cleared", auth: "Lab Superintendent", date: "2026-09-24", remarks: "All lab exercises and kit returns certified" },
      { dept: "Head of Department (CSE)", scope: "Academic Minimum Attendance & Condonation", status: Number(current.attendance || 0) >= 75 ? "Cleared" : "Condonation Required", auth: "Dr. Priya Rao (HOD)", date: "2026-09-25", remarks: Number(current.attendance || 0) >= 75 ? "Satisfactory attendance (>75%)" : "Attendance below 75%, condonation review" }
    ];

    body.innerHTML = departmentSignoffs.map(item => {
      const isBad = item.status.includes("Due") || item.status.includes("Required") || item.status.includes("Unpaid");
      return `<tr>
        <td><strong>${escapeHtml(item.dept)}</strong></td>
        <td>${escapeHtml(item.scope)}</td>
        <td><span class="status-pill ${isBad ? 'bad' : 'good'}">${escapeHtml(item.status)}</span></td>
        <td>${escapeHtml(item.auth)}</td>
        <td>${escapeHtml(item.date)}</td>
        <td><small>${escapeHtml(item.remarks)}</small></td>
      </tr>`;
    }).join("");
  };
  renderAcademicClearanceDetails();

  // 15. COUNSELLING DIARY (From photo 1 in new set)
  const renderCounselling = () => {
    const body = document.getElementById("counsellingDiaryBody");
    if (!body) return;
    const diary = [
      { ref: "978329", year: "2026-2027", sem: "Odd Sem", name: "KILLI CHANDRA BHUSHANA RAO", cat: "Academic", withWho: "Student", prob: "Submit Accommodation Form & Inform to SEM-II EXAMINATIONS", remarks: "Dear Parents, I am pleased to inform the Y25 II Year B.Tech (Regular) In-Sem-II Examinations are scheduled from 28-09-2026.", date: "2026-09-29" },
      { ref: "950669", year: "2026-2027", sem: "Odd Sem", name: "KILLI CHANDRA BHUSHANA RAO", cat: "Academic", withWho: "Parent", prob: "Attendance Status and SEM-1 Marks", remarks: "Dear Parents, I am pleased to inform, to Shared August Attendance and SEM-1 marks.", date: "2026-09-13" },
      { ref: "913175", year: "2026-2027", sem: "Odd Sem", name: "KILLI CHANDRA BHUSHANA RAO", cat: "Academic", withWho: "Parent", prob: "NO", remarks: "Informed to parents and students regarding attendance maintenance of month Aug(16th-30th).", date: "2026-08-21" },
      { ref: "841161", year: "2025-2026", sem: "Summer Term", name: "Yamini Tondepu", cat: "Academic", withWho: "Parent", prob: "Received Second Semester result.", remarks: "Sent second semester result and he got SGPA of 8.73", date: "2026-05-22" }
    ];
    body.innerHTML = diary.map((d, idx) => `<tr>
      <td>${idx + 1}</td>
      <td>${d.ref}</td>
      <td>${d.year}</td>
      <td>${d.sem}</td>
      <td><strong>${escapeHtml(d.name)}</strong></td>
      <td>${d.cat}</td>
      <td>${d.withWho}</td>
      <td>${escapeHtml(d.prob)}</td>
      <td><small>${escapeHtml(d.remarks)}</small></td>
      <td>${d.date}</td>
    </tr>`).join("");
  };
  renderCounselling();

  // 16. FEEDBACK SURVEY
  const renderFeedback = () => {
    const body = document.getElementById("studentFeedbackBody");
    if (!body) return;
    const items = [
      { code: "25CS2101", fac: "Sivudu Macherla", q: "Overall rating of your skill teacher.", r: "5 - Excellent" },
      { code: "25CS2101", fac: "Satya Gouri Arunasri Pabbisetti", q: "How the teacher allowing hands-on executions through examples?", r: "5 - Excellent" },
      { code: "25EC2206", fac: "Dr. Killi Chandra Bhushana Rao", q: "Is the teacher encouraging interaction to get doubts clarified?", r: "4 - Very Good" },
      { code: "25SC2006", fac: "Dayanidhi Mohapatra", q: "Overall rating of your lab teacher.", r: "5 - Excellent" }
    ];
    body.innerHTML = items.map((f, idx) => `<tr>
      <td>${idx + 1}</td>
      <td>2026-2027</td>
      <td>Odd Sem</td>
      <td><strong>${f.code}</strong></td>
      <td>${escapeHtml(f.fac)}</td>
      <td>${escapeHtml(f.q)}</td>
      <td><strong>${f.r}</strong></td>
      <td><span class="status-pill good">Submitted</span></td>
    </tr>`).join("");
  };
  renderFeedback();

  // 17. TARGET SGPA WHAT-IF SIMULATOR (Value-add feature)
  const simInputList = document.getElementById("simulatorInputList");
  if (simInputList) {
    simInputList.innerHTML = SUBJECT_CONFIG.map(c => `
      <div class="sim-row">
        <label><strong>${c.code}</strong> - ${c.shortName} (${c.credits} cr):</label>
        <div class="sim-slider-wrap">
          <input type="range" class="sim-range" data-code="${c.code}" min="40" max="100" value="85">
          <span class="sim-val" id="val_${c.code}">85</span>
        </div>
      </div>
    `).join("");

    const updateSimulation = () => {
      let totalPoints = 0;
      let totalCreds = 0;
      let totalMarks = 0;
      document.querySelectorAll(".sim-range").forEach(r => {
        const val = Number(r.value);
        const code = r.dataset.code;
        const cfg = SUBJECT_CONFIG.find(c => c.code === code) || { credits: 4 };
        document.getElementById(`val_${code}`).textContent = val;
        let gp = 10;
        if (val < 50) gp = 0;
        else if (val < 60) gp = 6;
        else if (val < 70) gp = 7;
        else if (val < 80) gp = 8;
        else if (val < 90) gp = 9;
        totalPoints += gp * cfg.credits;
        totalCreds += cfg.credits;
        totalMarks += val;
      });
      const projectedSgpa = (totalPoints / totalCreds).toFixed(2);
      const projectedAvg = (totalMarks / SUBJECT_CONFIG.length).toFixed(1);
      if (document.getElementById("simEstimatedSgpa")) document.getElementById("simEstimatedSgpa").textContent = projectedSgpa;
      if (document.getElementById("simEstimatedAvg")) document.getElementById("simEstimatedAvg").textContent = `${projectedAvg}%`;
      const gradeTitle = projectedSgpa >= 9.0 ? "Outstanding / O Grade" : projectedSgpa >= 8.0 ? "Distinction / A+ Grade" : "First Class / A Grade";
      if (document.getElementById("simEstimatedGrade")) document.getElementById("simEstimatedGrade").textContent = gradeTitle;
    };
    simInputList.addEventListener("input", updateSimulation);
    updateSimulation();
  }

  // 18. REPORT CARD DOWNLOAD & PROFILE
  const publishedStudent = currentPublication?.students.find(item => item.id === student.id);
  if (document.getElementById("studentReportContainer")) {
    document.getElementById("studentReportContainer").innerHTML = reportHtml(publishedStudent ? { ...publishedStudent, semester: currentPublication.semester } : student);
  }
  document.getElementById("printStudentReport")?.addEventListener("click", () => window.print());
  document.getElementById("downloadStudentReport")?.addEventListener("click", () => {
    downloadReportPdf(publishedStudent || student, student.semester, Boolean(publishedStudent));
  });

  const profilePicture = student.profilePicture?.startsWith("data:image/") ? student.profilePicture : "";
  if (document.getElementById("profileCard")) {
    document.getElementById("profileCard").innerHTML = `
      ${profilePicture ? `<img class="profile-avatar profile-photo" src="${escapeHtml(profilePicture)}" alt="${escapeHtml(student.name)}">` : `<div class="profile-avatar">${escapeHtml(student.name.charAt(0))}</div>`}
      <div>
        <h2>${escapeHtml(student.name)}</h2>
        <p class="muted">K L Deemed to be University - Department of Computer Science & Engineering</p>
        <div class="profile-details">
          <div class="info-item"><span>University ID</span><strong>${escapeHtml(student.universityId || "2500032283")}</strong></div>
          <div class="info-item"><span>Registered Email</span><strong>${escapeHtml(student.email)}</strong></div>
          <div class="info-item"><span>Program & Branch</span><strong>B.Tech - CSE</strong></div>
          <div class="info-item"><span>Academic Year</span><strong>2026-2027 (Odd Sem)</strong></div>
          <div class="info-item"><span>Counsellor</span><strong>Dr. Killi Chandra Bhushana Rao</strong></div>
          <div class="info-item"><span>Hostel / Day Scholar</span><strong>Day Scholar (Bus Route KLVZA)</strong></div>
        </div>
      </div>
    `;
  }

  document.getElementById("studentSecurityForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.getElementById("studentSecurityMessage");
    const password = document.getElementById("studentProfilePassword").value;
    const confirmation = document.getElementById("studentProfilePasswordConfirm").value;
    if (password && password !== confirmation) return showMessage(message, "Password confirmation does not match.");
    const picture = document.getElementById("studentProfilePicture").files[0];
    if (picture && !["image/png", "image/jpeg", "image/webp"].includes(picture.type)) return showMessage(message, "Choose a PNG, JPEG, or WebP image.");
    if (picture && picture.size > 500000) return showMessage(message, "Choose an image smaller than 500 KB.");
    const students = getStudents();
    const current = students.find(item => item.id === student.id);
    if (picture) current.profilePicture = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(picture); });
    writeStore(KEYS.students, students);
    if (password) {
      const users = readStore(KEYS.users, []);
      const user = users.find(item => item.id === session.id);
      if (user) user.password = password;
      writeStore(KEYS.users, users);
    }
    logActivity("Updated student account settings", student.name);
    showMessage(message, "Account settings saved successfully.", true);
    event.target.reset();
  });
}

seedData();
migrateUserPasswords();
migrateCorrectedUniversityIds();
ensureAcademicData();
migrateStudentData();
setupAuthPages();
if (document.body.dataset.role === "admin") setupAdmin();
if (document.body.dataset.role === "faculty") setupFaculty();
// The student portal is driven by student.js.
