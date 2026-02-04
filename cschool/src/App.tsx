import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AdmissionVerification } from './pages/admission/AdmissionVerification';
import { AdmissionForm } from './pages/admission/AdmissionForm';
import { TeacherApplicationForm } from './pages/staff/TeacherApplicationForm';
import { HeadTeacherTimetableManager } from './pages/teacher/head/HeadTeacherTimetableManager';
import { HeadTeacherClassTimetableManager } from './pages/teacher/head/HeadTeacherClassTimetableManager';
import { HeadTeacherResultsManager } from './pages/teacher/head/HeadTeacherResultsManager';
import { HeadTeacherFeesManager } from './pages/teacher/head/HeadTeacherFeesManager';
import { HeadTeacherClassesManager } from './pages/teacher/head/HeadTeacherClassesManager';
import { HeadTeacherStaffManager } from './pages/teacher/head/HeadTeacherStaffManager';
import { StudentLogin } from './pages/StudentLogin';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ContactPage } from './pages/ContactPage';
import { StaffPage } from './pages/StaffPage';
import { StudentForgotPassword } from './pages/StudentForgotPassword';
import { StudentLayout } from './components/layout/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentResults } from './pages/student/StudentResults';
import { StudentNotices } from './pages/student/StudentNotices';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentFees } from './pages/student/StudentFees';
import { StudentClearance } from './pages/student/StudentClearance';
import { StudentHelp } from './pages/student/StudentHelp';
import { StudentAccount } from './pages/student/StudentAccount';
import { TeacherLayout } from './components/layout/TeacherLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentManager } from './pages/admin/users/AdminStudentManager';
import { AdminTeacherManager } from './pages/admin/users/AdminTeacherManager';
import { AdminStaffManager } from './pages/admin/users/AdminStaffManager';
import { AdminAcademicYears } from './pages/admin/academics/AdminAcademicYears';
import { AdminClassManager } from './pages/admin/academics/AdminClassManager';
import { AdminVoucherManager } from './pages/admin/admissions/AdminVoucherManager';
import AdminEnrollmentManager from './pages/admin/admissions/AdminEnrollmentManager';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherProfile } from './pages/teacher/TeacherProfile';
import { TeacherPayments } from './pages/teacher/TeacherPayments';
import { TeacherAnnouncements } from './pages/teacher/TeacherAnnouncements';
import { TeacherResults } from './pages/teacher/TeacherResults';
import { TeacherUploadResults } from './pages/teacher/TeacherUploadResults';
import { TeacherViewResults } from './pages/teacher/TeacherViewResults';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { NotFound } from './pages/NotFound';

import { TeacherClassDashboard } from './pages/teacher/TeacherClassDashboard';
import { TeacherStudentDetail } from './pages/teacher/TeacherStudentDetail';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { TeacherTimetable } from './pages/teacher/TeacherTimetable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/forgot-password" element={<StudentForgotPassword />} />

        {/* Admission Routes */}
        <Route path="/admission/verification" element={<AdmissionVerification />} />
        <Route path="/admission/form" element={<AdmissionForm />} />
        <Route path="/staff/apply" element={<TeacherApplicationForm />} />

        {/* Student Portal Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="clearance" element={<StudentClearance />} />
          <Route path="account" element={<StudentAccount />} />
          <Route path="help" element={<StudentHelp />} />
          {/* Add other student routes here as they are created */}
        </Route>

        {/* Teacher Portal Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="head/teacher-timetables" element={<HeadTeacherTimetableManager />} />
          <Route path="head/class-timetables" element={<HeadTeacherClassTimetableManager />} />
          <Route path="head/results" element={<HeadTeacherResultsManager />} />
          <Route path="head/fees" element={<HeadTeacherFeesManager />} />
          <Route path="head/classes" element={<HeadTeacherClassesManager />} />
          <Route path="head/teachers" element={<HeadTeacherStaffManager />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="timetable" element={<TeacherTimetable />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="payments" element={<TeacherPayments />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="results/upload" element={<TeacherUploadResults />} />
          <Route path="results/view" element={<TeacherViewResults />} />
          <Route path="classes/:classId" element={<TeacherClassDashboard />} />
          <Route path="classes/:classId/:studentId" element={<TeacherStudentDetail />} />
          {/* Add other teacher routes here */}
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="users/students" element={<AdminStudentManager />} />
          <Route path="users/teachers" element={<AdminTeacherManager />} />
          <Route path="users/staff" element={<AdminStaffManager />} />

          <Route path="academics/years" element={<AdminAcademicYears />} />
          <Route path="academics/classes" element={<AdminClassManager />} />
          <Route path="admissions/vouchers" element={<AdminVoucherManager />} />
          <Route path="admissions/enrollment" element={<AdminEnrollmentManager />} />
          {/* Add other admin routes here */}
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
