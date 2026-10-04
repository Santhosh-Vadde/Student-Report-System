# Student Report System

A college-level front-end project built using only HTML, CSS, and JavaScript. It stores accounts, student records, grades, attendance, schedules, assignments, announcements, course registrations, grading rules, and the current login session in the browser's Local Storage.

## Run in VS Code

1. Open this `Student-Report-System` folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open the `frontend` folder, right-click `index.html`, and select **Open with Live Server**.
4. Use the URL opened by Live Server. Do not open individual dashboard pages first.

Alternatively, run the following command from the project root and open `http://localhost:56008`:

```powershell
npx --yes serve -l 56008 frontend
```

## Project structure

```text
Student-Report-System/
|-- frontend/
|   |-- index.html              (redirect stub -> login/index.html, so the bare root still works)
|   |-- styles.css               (shared admin/faculty stylesheet)
|   |-- login/
|   |   |-- index.html           (the actual sign-in page)
|   |   |-- login.css
|   |   |-- login.js
|   |   `-- logout.js            (shared logout handler used by every dashboard page)
|   |-- registration/
|   |   `-- signup.html
|   |-- admin/
|   |   `-- admin.html
|   |-- faculty/
|   |   `-- faculty.html
|   |-- user/
|   |   |-- student.html
|   |   |-- student.js
|   |   `-- portal.css
|   |-- modules/                 (shared/additive logic - the "functional modules")
|   |   |-- app.js               (shared data/helpers + setupAdmin/setupFaculty/login logic)
|   |   |-- admin-plus.js
|   |   |-- faculty-plus.js
|   |   |-- student-data.js
|   |   `-- student-more.js
|   |-- SAMPLE-GRADE-REPORT.csv
|   |-- legacy/                  (old pages kept for reference only, not linked from anywhere)
|   `-- screenshots/
|-- README.md
`-- TEST-RESULTS.md
```

There is no backend folder because this project intentionally uses Browser Local Storage instead of a server or database.

## Demo accounts & Authentication

Every login needs a username, a password, and the captcha. Faculty and admin accounts then enter a fixed 4-digit MFA code (issued to that account, not a changing one-time code) and get 3 attempts. The code is shown on the login page in demo mode since there is no real IT office to issue it.

- **Student**: `2500032283` / `2500032283` (captcha only)
- **Faculty**: `2500032294` or `2500032295` / `Faculty@KLU2026` (captcha + MFA code `4821` or `5732`)
- **Admin**: `admin_klu` / `Admin@KLU#2026` (captcha + MFA code `9046`)

Absence texts to parents and students are also simulated: they are written to a local outbox that faculty and students can read, and parent/student numbers are demo values.

## Main demonstration flow

1. Log in as Faculty 1 and open **Gradebook**.
2. Select one of the three assigned subjects and edit student components.
3. Open **Reports** to view distribution or export all assigned subjects as CSV.
4. Log in as Faculty 2 to verify that only the other three subjects are available.
5. Log in as a student and open **My Grades** to view the read-only results.

## Modules

### Admin module

- Dashboard analytics
- Student add, edit, search, archive, restore, and password reset
- Faculty account management, subject assignment, archive, restore, and password reset
- Batch, section, and academic-period management
- Marks, attendance, and remarks entry
- Six-subject attendance with 75% primary-period and 25% secondary-period weighting
- Student report preview and printing
- Custom grade thresholds
- Timetable and examination schedule management
- Student course-registration management
- Academic and examination clearance (no-due) authorization and hold controls
- Classroom allotment: see empty rooms by day and period, allot rooms, move or remove a class
- Branch and section results: pass, fail, detained counts and average pass percentage
- Academic announcements
- Pending-action and recent-activity dashboard
- Grade publication history and historical CSV export
- Publication requires complete grades and submitted faculty gradebooks
- One immutable finalized snapshot per semester; republishing replaces that term
- Official student date-of-birth and parent/guardian detail maintenance
- Institution report profile
- Full JSON backup/restore and student-list CSV export

### Faculty module

- Faculty registration with administrator approval and subject assignment
- Subject-scoped student lists and grade entry
- Assignment, ALM, quiz, lab, Mid 1, Mid 2, and semester-end marks
- Automatic weighted final score and grade distribution
- Consolidated Excel-compatible CSV export for assigned subjects
- Teaching-subject assignment settings
- Assignment publishing for assigned subjects
- Subject-filtered timetable and examination schedule
- Subject announcements
- Action-focused dashboard with today's schedule, pending work, and staff notices
- Save-draft, submit, lock, and administrator-reopen grade workflow
- Assigned-class rosters with CSV export
- Subject attendance entry with weighted calculation
- Individual and predefined subject remarks included in reports
- Published semester history
- Faculty contact details and password changes
- Period-wise roll call with present/absent marking; absentees' parents and students are texted (simulated)
- Passed, failed, and detained student report for assigned subjects
- Administrator-controlled subject assignments

### User module

The student portal (`user/student.html`, `user/student.js`, `modules/student-more.js`, `modules/student-data.js`, `user/portal.css`) is organised as Semester, Examinations, Plan and respond, Campus and Account.

- Home with CGPA, attendance, credits, clearance, open items, notices and recent absences
- Course registration that follows the window the administrator sets: open, upcoming, completed or pending
- Attendance per class type (lecture, tutorial, practical, skill) for every course, a register for each, and the most recent absent periods
- Academic year and semester filters on courses, attendance, internals, answer scripts, seating, end exam result and the hall ticket, so students from any year see their own records
- Internals: home assignment, ALM, tutorial or quiz, lab internal and lab external marks, with the weightage earned out of 40%
- Answer scripts for mid exam 1, mid exam 2 and the semester end exam, with question-wise marks and sample evaluated booklets
- Hall ticket with photo, barcode and exam schedule; withheld automatically when clearance is on hold
- End exam result and My CGPA, both printable or savable as PDF
- Target SGPA planner with a per-course graph and a list of what to do
- Assignments (pending, overdue, submitted), feedback forms for pending teachers, library (catalogue and borrowed books)
- Timetable, empty classrooms, counselling diary, exam clearance, report card and profile with password and photo settings

## Included modules

1. Student dashboard
2. Academic records
3. Attendance register
4. Courses and subjects
5. Faculty gradebook
6. Reports
7. Student profile
8. Timetable
9. Assignments
10. Examination schedule
11. Announcements
12. Performance analytics
13. Course registration

## Grade calculation

Each component is entered out of 100. Internals are the average of assignment, ALM, quiz, and lab.

`Final = (Internals × 0.40) + (Mid 1 × 0.15) + (Mid 2 × 0.15) + (Semester End × 0.30)`

The application seeds 2 faculty, 10 students, and 6 subjects. `SAMPLE-GRADE-REPORT.csv` shows the exported format and opens directly in Excel.

## Reset sample data

Open the browser developer tools, go to **Application > Local Storage**, clear the site data, and refresh the login page. The original sample data will be created again.

## Important note

This project uses Local Storage because the assignment permits only HTML, CSS, and JavaScript. Public signup cannot create administrators, faculty accounts require administrator approval, and active sessions are revalidated against account status. However, Local Storage remains client-controlled and passwords are stored in the browser, so this is not production-grade security. A real deployment requiring secure authentication, cross-device access, or tamper-proof official records must use a backend and database.
