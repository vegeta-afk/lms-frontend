// App.jsx - CORRECTED VERSION
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Import Admission components
import AdmissionList from "./pages/frontoffice/admission/AdmissionList";
import AddAdmission from "./pages/frontoffice/admission/AddAdmission";
import ViewAdmission from "./pages/frontoffice/admission/ViewAdmission";

// Import Enquiry components
import EnquiryList from "./pages/frontoffice/enquiry/EnquiryList";
import NewEnquiry from "./pages/frontoffice/enquiry/NewEnquiry";
import ViewEnquiry from "./pages/frontoffice/enquiry/ViewEnquiry";

// Import Course components
import CourseList from "./pages/frontoffice/setup/Courses/CourseList";
import AddCourse from "./pages/frontoffice/setup/Courses/AddCourse";
import SetupList from "./pages/frontoffice/setup/SetupList";

// Import Faculty components
import FacultyList from "./pages/Faculty/FacultyList";
import AddFaculty from "./pages/Faculty/AddFaculty";

// Import Student components
import StudentList from "./pages/students/StudentList";
import ViewStudent from "./pages/students/ViewStudent";
import StudentAttendance from "./pages/students/StudentAttendance";
import StudentFees from "./pages/students/StudentFees";
import ImportStudents from "./pages/students/ImportStudents";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ✅ ALL ADMIN ROUTES MUST BE INSIDE THIS AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Front Office Routes */}
        <Route path="front-office">
          {/* ENQUIRY ROUTES */}
          <Route path="enquiries" element={<EnquiryList />} />
          <Route path="enquiries/add" element={<NewEnquiry />} />
          <Route path="enquiries/view/:id" element={<ViewEnquiry />} />

          {/* ADMISSION ROUTES */}
          <Route path="admissions" element={<AdmissionList />} />
          <Route path="admissions/add" element={<AddAdmission />} />
          <Route path="admissions/view/:id" element={<ViewAdmission />} />
          <Route path="admissions/edit/:id" element={<AddAdmission />} />
        </Route>

        {/* Setup Routes */}
        <Route path="setup">
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="management" element={<SetupList />} />
        </Route>

        {/* ✅ FACULTY ROUTES */}
        <Route path="faculty">
          <Route index element={<FacultyList />} />
          <Route path="add" element={<AddFaculty />} />
        </Route>

        {/* ✅ STUDENT ROUTES - MOVED INSIDE /admin */}
        <Route path="students">
          <Route index element={<StudentList />} />
          <Route path="import" element={<ImportStudents />} />
          <Route path="view/:id" element={<ViewStudent />} />
          <Route path="edit/:id" element={<AddAdmission />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="attendance/:id" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="fees/:id" element={<StudentFees />} />
        </Route>
      </Route>
      {/* Closing tag for AdminLayout route - NO ROUTES SHOULD BE HERE */}

      {/* ✅ Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ✅ 404 Page */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
