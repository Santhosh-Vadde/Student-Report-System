// Data and calculations behind the student portal. Everything here is read-only
// and deterministic, so the same student always sees the same figures.

const PAST_COURSES = {
  "2025-2026_Odd Sem": [
    { code: "25SC1101", name: "PROBLEM SOLVING THROUGH PROGRAMMING IN C", shortName: "C Programming", ltps: "3-0-2-0", credits: 4, primary: "Lecture", secondary: "Practical", section: "S-4-MA", offeredBy: "CSE" },
    { code: "25EC1101", name: "DIGITAL ELECTRONICS AND LOGIC DESIGN", shortName: "Digital Electronics", ltps: "3-0-2-0", credits: 4, primary: "Lecture", secondary: "Practical", section: "S-4-MA", offeredBy: "ECE" },
    { code: "25MT1101", name: "SINGLE VARIABLE CALCULUS AND MATRIX ALGEBRA", shortName: "Calculus & Matrices", ltps: "3-1-0-0", credits: 4, primary: "Lecture", secondary: "Tutorial", section: "S-4-MA", offeredBy: "FED" },
    { code: "25EN1101", name: "COMMUNICATION SKILLS IN ENGLISH", shortName: "English", ltps: "2-0-0-2", credits: 3, primary: "Lecture", secondary: "Skill", section: "S-4-B", offeredBy: "FED" }
  ],
  "2025-2026_Even Sem": [
    { code: "25SC1202", name: "DATA STRUCTURES AND ALGORITHMS", shortName: "Data Structures", ltps: "3-0-2-0", credits: 4, primary: "Lecture", secondary: "Practical", section: "S-6-MA", offeredBy: "CSE" },
    { code: "25CS1201", name: "COMPUTER ORGANIZATION AND ARCHITECTURE", shortName: "Computer Organization", ltps: "3-0-2-0", credits: 4, primary: "Lecture", secondary: "Practical", section: "S-6-MA", offeredBy: "CSE" },
    { code: "25MT1202", name: "MULTIVARIATE CALCULUS AND DIFFERENTIAL EQUATIONS", shortName: "Multivariate Calculus", ltps: "3-1-0-0", credits: 4, primary: "Lecture", secondary: "Tutorial", section: "S-6-MA", offeredBy: "FED" },
    { code: "25PH1201", name: "PHYSICS FOR COMPUTING SCIENCES", shortName: "Physics", ltps: "3-0-2-0", credits: 4, primary: "Lecture", secondary: "Practical", section: "S-6-MA", offeredBy: "FED" }
  ]
};

const CLASS_LETTER = { Lecture: "L", Tutorial: "T", Practical: "P", Skill: "S" };

const TIMETABLE = {
  Monday: [[3, 4, "25EC2206", "S", "S-10", "C523"], [5, 6, "25CS2101", "S", "S-6", "C219"], [8, 9, "25AD2102", "P", "S-12", "C018"], [10, 11, "25SC2006", "L", "S-9", "C421A"]],
  Tuesday: [[3, 4, "25CS2101", "P", "S-6", "C617"], [5, 6, "25SC2006", "S", "S-9", "C219"], [8, 9, "25AD2102", "L", "S-12", "C411"]],
  Wednesday: [[3, 4, "25MT1306", "L", "S-9", "C623"], [5, 5, "25CS2102", "L", "S-12", "C511"], [6, 6, "25AD2102", "L", "S-12", "M206"], [10, 11, "25EC2206", "S", "S-10", "R104A"]],
  Thursday: [[3, 4, "25CS2102", "P", "S-12", "C219"], [5, 6, "25SC2006", "S", "S-9", "C421B1"], [8, 9, "25MT1306", "T", "S-9", "C421B1"]],
  Friday: [[3, 4, "25EC2206", "L", "S-10", "C421B2"], [5, 6, "25CS2102", "L", "S-12", "C411"], [8, 9, "25CS2101", "S", "S-6", "C218"], [10, 11, "25SP2101", "S", "S-3", "Athletic track"]]
};

const EXAM_KINDS = [
  { id: "mid1", label: "Mid exam 1", max: 50, scoreKey: "mid1", structure: [["1A", 2], ["1B", 2], ["1C", 2], ["1D", 2], ["1E", 2], ["1F", 2], ["2A", 4], ["2B", 4], ["3A", 6], ["3B", 6], ["4A", 6], ["4B", 6], ["5A", 6]] },
  { id: "mid2", label: "Mid exam 2", max: 50, scoreKey: "mid2", structure: [["1A", 2], ["1B", 2], ["1C", 2], ["1D", 2], ["1E", 2], ["1F", 2], ["2A", 4], ["2B", 4], ["3A", 6], ["3B", 6], ["4A", 6], ["4B", 6], ["5A", 6]] },
  { id: "end", label: "Semester end exam", max: 100, scoreKey: "semEnd", structure: [["1A", 2], ["1B", 2], ["1C", 2], ["1D", 2], ["1E", 2], ["1F", 2], ["2A", 8], ["2B", 8], ["3A", 8], ["3B", 8], ["4A", 8], ["4B", 8], ["5A", 8], ["5B", 8], ["6A", 8], ["6B", 8], ["7A", 8]] }
];

const SEATING = [
  { id: "10567", date: "2026-10-14", type: "Mid exam 1", slot: "Morning", code: "25SC2006", room: "S813" },
  { id: "10568", date: "2026-10-16", type: "Mid exam 1", slot: "Morning", code: "25EC2206", room: "SK011" },
  { id: "10569", date: "2026-10-18", type: "Mid exam 1", slot: "Afternoon", code: "25AD2102", room: "M304" },
  { id: "10570", date: "2026-10-20", type: "Mid exam 1", slot: "Morning", code: "25CS2102", room: "C506" },
  { id: "10571", date: "2026-10-22", type: "Mid exam 1", slot: "Afternoon", code: "25MT1306", room: "R210A" },
  { id: "10640", date: "2026-11-10", type: "Semester end", slot: "Morning", code: "25SC2006", room: "S813" },
  { id: "10641", date: "2026-11-12", type: "Semester end", slot: "Morning", code: "25EC2206", room: "SK011" },
  { id: "10642", date: "2026-11-14", type: "Semester end", slot: "Afternoon", code: "25AD2102", room: "M304" },
  { id: "10643", date: "2026-11-17", type: "Semester end", slot: "Morning", code: "25CS2102", room: "C506" },
  { id: "10644", date: "2026-11-19", type: "Semester end", slot: "Afternoon", code: "25MT1306", room: "R210A" }
];

const SAMPLE_ANSWERS = {
  "25SC2006": [
    ["Differentiate between an abstract class and an interface in Java.", "An abstract class can hold state and constructors and supports single inheritance, whereas an interface declares behaviour that many classes can implement. Since Java 8 an interface may carry default methods, but it still cannot hold instance state."],
    ["Explain the try-catch-finally flow with an example.", "try holds code that may fail, catch handles a matching exception and finally always runs, for example to close a file. try { int x = a / b; } catch (ArithmeticException e) { System.out.println(\"b is zero\"); } finally { System.out.println(\"done\"); }"],
    ["State the difference between ArrayList and LinkedList.", "ArrayList is backed by a resizable array, so get is O(1) but inserting in the middle is O(n). LinkedList is a doubly linked list, so insertion at a known node is O(1) but get is O(n)."]
  ],
  "25EC2206": [
    ["List the layers of a typical IoT architecture.", "Perception layer with sensors and actuators, network layer using Wi-Fi, BLE, LoRa or MQTT, processing layer at the edge or in the cloud, and the application layer with dashboards and alerts."],
    ["Compare MQTT and HTTP for constrained devices.", "MQTT is publish-subscribe with a very small header and a persistent connection, so it suits low-bandwidth sensors. HTTP is request-response with heavier headers and a new connection per request."],
    ["What is the role of an ADC in an embedded system?", "An ADC converts the analog voltage from a sensor into a digital value the microcontroller can process. A 10-bit ADC gives 1024 levels, so with a 5 V reference each step is about 4.9 mV."]
  ],
  "25AD2102": [
    ["Differentiate supervised and unsupervised learning.", "Supervised learning trains on labelled data to predict outputs, for example spam detection. Unsupervised learning finds structure in unlabelled data, for example clustering customers by behaviour."],
    ["What is overfitting and how can it be reduced?", "Overfitting is when a model memorises the training data and fails on new data. It is reduced with more data, regularisation, cross validation and early stopping."],
    ["Define precision and recall.", "Precision = TP / (TP + FP), the share of predicted positives that are correct. Recall = TP / (TP + FN), the share of actual positives that were found."]
  ],
  "25CS2102": [
    ["Explain the difference between a process and a thread.", "A process has its own address space and resources. Threads inside a process share code, data and open files but keep their own stack and registers, so switching between them is cheaper."],
    ["Describe the four necessary conditions for deadlock.", "Mutual exclusion, hold and wait, no preemption and circular wait must all hold together. Breaking any one of them prevents deadlock."],
    ["Compare FCFS and Round Robin scheduling.", "FCFS runs jobs in arrival order and can cause the convoy effect. Round Robin gives each job a time quantum, which improves response time at the cost of more context switches."]
  ],
  "25CS2101": [
    ["What is the virtual DOM in React?", "A lightweight copy of the DOM kept in memory. React compares the new tree with the previous one and updates only the nodes that changed."],
    ["Explain the CSS box model.", "Every element is a box made of content, padding, border and margin. With box-sizing: border-box the declared width already includes padding and border."],
    ["Differentiate props and state.", "Props are read-only inputs passed down from a parent. State is data owned by a component that can change and trigger a re-render."]
  ],
  "25MT1306": [
    ["Define the rank of a matrix.", "The rank is the maximum number of linearly independent rows or columns, which equals the number of non-zero rows in row echelon form."],
    ["State Bayes theorem.", "P(A|B) = P(B|A) P(A) / P(B). It updates the probability of a cause A after observing the evidence B."],
    ["What are the mean and variance of a binomial distribution?", "For n trials with success probability p, the mean is np and the variance is np(1 - p)."]
  ]
};

const LIBRARY_BOOKS = [
  { id: "512346", title: "Fundamentals of Optics", author: "Francis A. Jenkins", course: "", copies: 4, available: 2 },
  { id: "537349", title: "Digital Logic and Computer Design", author: "M. Morris Mano", course: "25EC1101", copies: 6, available: 3 },
  { id: "537354", title: "Data Communications and Networking", author: "Behrouz A. Forouzan", course: "", copies: 5, available: 1 },
  { id: "540101", title: "Java: The Complete Reference", author: "Herbert Schildt", course: "25SC2006", copies: 8, available: 4 },
  { id: "540102", title: "Head First Java", author: "Kathy Sierra, Bert Bates", course: "25SC2006", copies: 5, available: 0 },
  { id: "540203", title: "Embedded Systems: Architecture, Programming and Design", author: "Raj Kamal", course: "25EC2206", copies: 6, available: 2 },
  { id: "540204", title: "IoT Fundamentals", author: "David Hanes et al.", course: "25EC2206", copies: 4, available: 3 },
  { id: "540305", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", course: "25AD2102", copies: 7, available: 2 },
  { id: "540306", title: "Pattern Recognition and Machine Learning", author: "Christopher M. Bishop", course: "25AD2102", copies: 3, available: 1 },
  { id: "540407", title: "Operating System Concepts", author: "Abraham Silberschatz et al.", course: "25CS2102", copies: 9, available: 5 },
  { id: "540408", title: "Modern Operating Systems", author: "Andrew S. Tanenbaum", course: "25CS2102", copies: 4, available: 0 },
  { id: "540509", title: "Learning React", author: "Alex Banks, Eve Porcello", course: "25CS2101", copies: 5, available: 3 },
  { id: "540510", title: "JavaScript: The Good Parts", author: "Douglas Crockford", course: "25CS2101", copies: 4, available: 2 },
  { id: "540611", title: "Higher Engineering Mathematics", author: "B. S. Grewal", course: "25MT1306", copies: 10, available: 6 },
  { id: "540612", title: "Probability and Statistics for Engineers", author: "Richard A. Johnson", course: "25MT1306", copies: 5, available: 1 },
  { id: "540613", title: "Linear Algebra and Its Applications", author: "Gilbert Strang", course: "25MT1306", copies: 4, available: 2 },
  { id: "540714", title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", course: "25SC1202", copies: 6, available: 2 },
  { id: "540715", title: "Computer Organization and Embedded Systems", author: "Carl Hamacher et al.", course: "25CS1201", copies: 5, available: 3 },
  { id: "540816", title: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", course: "25MT1202", copies: 8, available: 4 },
  { id: "540817", title: "Clean Code", author: "Robert C. Martin", course: "", copies: 4, available: 1 },
  { id: "540918", title: "Database System Concepts", author: "Abraham Silberschatz et al.", course: "", copies: 6, available: 4 },
  { id: "540919", title: "Computer Networks", author: "Andrew S. Tanenbaum", course: "", copies: 5, available: 0 }
];

const FEEDBACK_QUESTIONS = [
  "The teacher explains concepts clearly.",
  "The teacher encourages questions and clears doubts.",
  "The lesson plan is followed on schedule.",
  "Examples and hands-on work are used well.",
  "Overall rating of the teacher."
];

function seededRandom(seed) {
  const text = String(seed);
  let hash = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pass mark follows the admin grading settings; points follow the 10-point scale.
function gradePointFor(percent) {
  if (percent < getGrading().d) return { point: 0, letter: "F" };
  const bands = [[90, 10, "O"], [80, 9, "A+"], [70, 8, "A"], [60, 7, "B+"], [55, 6, "B"], [0, 5, "C"]];
  const [, point, letter] = bands.find(([min]) => percent >= min);
  return { point, letter };
}

// Lowest score that earns a grade point, used by the target planner (linear between grade bands).
function percentForPoint(point) {
  if (point <= 0) return 0;
  const steps = [[5, getGrading().d], [6, 55], [7, 60], [8, 70], [9, 80], [10, 90]];
  if (point <= 5) return steps[0][1];
  if (point >= 10) return 90;
  const upper = steps.findIndex(([grade]) => grade >= point);
  const [lowGrade, lowScore] = steps[upper - 1];
  const [highGrade, highScore] = steps[upper];
  return lowScore + (highScore - lowScore) * (point - lowGrade) / (highGrade - lowGrade);
}

function currentAcademicTerm() {
  const settings = readStore(KEYS.settings, {});
  const academicYear = /^\d{4}-\d{4}$/.test(settings.academicYear || "") ? settings.academicYear : "2026-2027";
  const semester = /even/i.test(settings.semesterName || "") ? "Even Sem" : "Odd Sem";
  return { academicYear, semester };
}

function studentTerms(student) {
  const now = currentAcademicTerm();
  const currentStart = Number(now.academicYear.slice(0, 4));
  const batchStart = Number(String(student.batch || "").slice(0, 4)) || currentStart - 1;
  const terms = [];
  for (let year = Math.min(batchStart, currentStart); year <= currentStart; year++) {
    ["Odd Sem", "Even Sem"].forEach(semester => {
      if (year === currentStart && semester === "Even Sem" && now.semester === "Odd Sem") return;
      const yearOfStudy = year - batchStart + 1;
      terms.push({
        academicYear: `${year}-${year + 1}`, semester, yearOfStudy,
        semesterNo: (yearOfStudy - 1) * 2 + (semester === "Odd Sem" ? 1 : 2),
        isCurrent: year === currentStart && semester === now.semester,
        key: `${year}-${year + 1}_${semester}`
      });
    });
  }
  return terms;
}

function termCourses(student, term) {
  if (term.isCurrent) return (student.enrolledSubjects?.length ? student.enrolledSubjects : SUBJECTS).map(subjectConfigFor).filter(Boolean);
  return PAST_COURSES[term.key] || [];
}

function courseHasLab(course) {
  return ["Practical", "Skill"].includes(course.secondary) || course.primary === "Practical";
}

function scoresFor(student, term, course) {
  if (term.isCurrent) return student.grades?.[course.name] || seededGrade(75, 0);
  const random = seededRandom(`${student.id}|${term.key}|${course.code}`);
  const base = 62 + random() * 28;
  const pick = () => Math.max(38, Math.min(99, Math.round(base + random() * 16 - 8)));
  return { assignment: pick(), alm: pick(), quiz: pick(), lab: pick(), mid1: pick(), mid2: pick(), semEnd: pick() };
}

function courseResult(student, term, course) {
  const percent = finalScoreFor(scoresFor(student, term, course));
  return { code: course.code, name: course.name, shortName: course.shortName, credits: course.credits, percent, ...gradePointFor(percent) };
}

function termResult(student, term) {
  const courses = termCourses(student, term).map(course => courseResult(student, term, course));
  const credits = courses.reduce((sum, course) => sum + course.credits, 0);
  const earned = courses.filter(course => course.point > 0).reduce((sum, course) => sum + course.credits, 0);
  const points = courses.reduce((sum, course) => sum + course.point * course.credits, 0);
  return { term, courses, credits, earned, points, sgpa: credits ? points / credits : 0 };
}

function cumulativeResults(student) {
  let totalCredits = 0;
  let totalPoints = 0;
  return studentTerms(student).map(term => {
    const result = termResult(student, term);
    totalCredits += result.credits;
    totalPoints += result.points;
    return { ...result, cgpa: totalCredits ? totalPoints / totalCredits : 0, cumulativeCredits: totalCredits };
  }).filter(result => result.courses.length);
}

function internalsFor(student, term, course) {
  const scores = scoresFor(student, term, course);
  const lab = courseHasLab(course);
  const tutorial = course.secondary === "Tutorial";
  const rows = [
    { key: "assignment", label: "Home assignment", max: 25 },
    { key: "alm", label: "ALM", max: 25 },
    { key: "quiz", label: tutorial ? "Tutorial" : "Quiz", max: 25 },
    { key: "lab", label: lab ? "Lab internal" : "Continuous evaluation", max: 50 }
  ].map(row => {
    const marks = Math.round(scores[row.key] * row.max / 100 * 2) / 2;
    return { ...row, marks, weight: 10, earned: marks / row.max * 10 };
  });
  const total = rows.reduce((sum, row) => sum + row.earned, 0);
  const random = seededRandom(`${student.id}|${term.key}|${course.code}|external`);
  const external = lab ? { max: 50, marks: Math.round(Math.max(20, Math.min(50, scores.lab / 2 + random() * 8 - 4)) * 2) / 2 } : null;
  return { rows, total, weight: 40, percent: total / 40 * 100, external };
}

function componentAttendanceFor(student, term, course, component) {
  if (term.isCurrent) return componentAttendanceSummary(student, course.name, component);
  const random = seededRandom(`${student.id}|${term.key}|${course.code}|${component}`);
  const conducted = 30 + Math.floor(random() * 12);
  const attended = Math.round(conducted * (0.72 + random() * 0.26));
  return { conducted, attended, absent: conducted - attended, percent: attended / conducted * 100 };
}

function termStartDate(term) {
  const [startYear] = term.academicYear.split("-").map(Number);
  return term.semester === "Odd Sem" ? `${startYear}-07-20` : `${startYear + 1}-01-12`;
}

function addWorkingDays(isoDate, count) {
  const date = new Date(`${isoDate}T00:00:00`);
  let remaining = count;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) remaining -= 1;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Baseline classes get stable dates; faculty roll calls are appended with their real dates.
function attendanceHistory(student, term, course, component) {
  const summary = term.isCurrent ? componentAttendanceSummary(student, course.name, component) : componentAttendanceFor(student, term, course, component);
  const loggedCount = term.isCurrent ? loggedAttendanceCounts(student.id, course.name, component).conducted : 0;
  const baseCount = summary.conducted - loggedCount;
  const loggedPresent = term.isCurrent ? loggedAttendanceCounts(student.id, course.name, component).attended : 0;
  const baseAbsent = baseCount - (summary.attended - loggedPresent);
  const random = seededRandom(`${student.id}|${term.key}|${course.code}|${component}|days`);
  const order = [...Array(baseCount).keys()].sort(() => random() - 0.5);
  const absentSet = new Set(order.slice(0, Math.max(0, baseAbsent)));
  const period = 3 + Math.floor(random() * 7);
  const start = termStartDate(term);
  const entries = [...Array(baseCount).keys()].map(i => ({ date: addWorkingDays(start, i + 1), period, status: absentSet.has(i) ? "A" : "P" }));
  if (term.isCurrent) {
    readStore(KEYS.attendanceLog, []).forEach(record => {
      if (record.subject === course.name && (record.component || "primary") === component && student.id in record.entries) entries.push({ date: record.date, period: record.period, status: record.entries[student.id] });
    });
  }
  return entries.sort((a, b) => a.date.localeCompare(b.date) || a.period - b.period);
}

// Spreads a total over the paper's questions in half-mark steps, keeping the sum exact.
function questionMarks(total, structure, seed) {
  const random = seededRandom(seed);
  const maxSum = structure.reduce((sum, [, max]) => sum + max, 0);
  const target = Math.round(Math.min(total, maxSum) * 2) / 2;
  const marks = structure.map(([, max]) => Math.max(0, Math.min(max, Math.round(max * (target / maxSum) * (0.8 + 0.4 * random()) * 2) / 2)));
  let difference = target - marks.reduce((sum, value) => sum + value, 0);
  for (let guard = 0; Math.abs(difference) >= 0.25 && guard < 4000; guard++) {
    const index = guard % marks.length;
    const step = difference > 0 ? 0.5 : -0.5;
    if (marks[index] + step < 0 || marks[index] + step > structure[index][1]) continue;
    marks[index] += step;
    difference -= step;
  }
  return structure.map(([question, max], i) => ({ question, max, marks: marks[i] }));
}

function reevalOverridesFor(studentId, courseCode, examKindId) {
  const all = readStore(KEYS.qpOverrides, {});
  return all[`${studentId}|${courseCode}|${examKindId}`] || {};
}

// A faculty member can adjust one question's marks after a re-evaluation request; the
// adjusted mark overlays the deterministic baseline so totals and the booklet stay in sync.
function examMarks(student, term, course, kind) {
  const scores = scoresFor(student, term, course);
  const baseScored = Math.round(scores[kind.scoreKey] / 100 * kind.max * 2) / 2;
  const baseQuestions = questionMarks(baseScored, kind.structure, `${student.id}|${term.key}|${course.code}|${kind.id}`);
  const overrides = reevalOverridesFor(student.id, course.code, kind.id);
  const questions = baseQuestions.map(item => item.question in overrides ? { ...item, marks: overrides[item.question], adjusted: true } : item);
  const scored = questions.reduce((sum, item) => sum + item.marks, 0);
  return { kind, scored, percent: scored / kind.max * 100, questions, hasAdjustment: Object.keys(overrides).length > 0 };
}

function libraryLoansFor(student) {
  const key = "klu_library_loans";
  let loans = readStore(key, []);
  if (!loans.some(loan => loan.studentId === student.id)) {
    const random = seededRandom(`${student.id}|library`);
    const wanted = SUBJECTS.slice(0, 3).map(name => subjectConfigFor(name).code);
    const picks = LIBRARY_BOOKS.filter(book => wanted.includes(book.course)).sort(() => random() - 0.5).slice(0, 2);
    const today = new Date(`${todayIso()}T00:00:00`);
    const iso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const created = picks.map((book, index) => {
      const issued = new Date(today);
      issued.setDate(today.getDate() - (index === 0 ? 27 : 9));
      const due = new Date(issued);
      due.setDate(issued.getDate() + 21);
      return { id: makeId("loan"), studentId: student.id, bookId: book.id, issued: iso(issued), due: iso(due), renewals: 0 };
    });
    loans = [...loans, ...created];
    writeStore(key, loans);
  }
  return loans.filter(loan => loan.studentId === student.id && !loan.returned);
}

function renewLibraryLoan(loanId) {
  const loans = readStore("klu_library_loans", []);
  const loan = loans.find(item => item.id === loanId);
  if (!loan || loan.due < todayIso() || loan.renewals >= 2) return false;
  const due = new Date(`${loan.due}T00:00:00`);
  due.setDate(due.getDate() + 14);
  loan.due = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}`;
  loan.renewals += 1;
  writeStore("klu_library_loans", loans);
  return true;
}

function ensureSampleAssignments() {
  const records = getAcademicRecords("assignments");
  const today = new Date(`${todayIso()}T00:00:00`);
  const iso = offset => { const d = new Date(today); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const topics = {
    "25SC2006": ["Inheritance and polymorphism problems", "Collections framework mini project"],
    "25EC2206": ["Sensor interfacing report", "MQTT publisher and subscriber exercise"],
    "25AD2102": ["Regression model worksheet", "Feature engineering notebook"],
    "25CS2102": ["CPU scheduling simulation", "Deadlock detection problems"],
    "25CS2101": ["Responsive layout exercise", "React component library"],
    "25MT1306": ["Matrix decomposition problem set", "Probability distributions worksheet"]
  };
  let changed = false;
  SUBJECT_CONFIG.forEach(config => {
    (topics[config.code] || []).forEach((title, index) => {
      const id = `asg_sample_${config.code}_${index + 1}`;
      if (records.some(item => item.id === id)) return;
      records.push({ id, subject: config.name, title, dueDate: index === 0 ? iso(4 + (config.code.charCodeAt(7) % 5)) : iso(-6), maxMarks: index === 0 ? 20 : 25 });
      changed = true;
    });
  });
  if (changed) writeStore(KEYS.assignments, records);
}
