// App.jsx - FIXED VERSION
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
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Protected admin routes with layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Front Office Routes */}
        <Route path="front-office/enquiries" element={<EnquiryList />} />
        <Route path="front-office/enquiries/add" element={<NewEnquiry />} />
        <Route
          path="front-office/enquiries/view/:id"
          element={<ViewEnquiry />}
        />

        <Route path="front-office/admissions" element={<AdmissionList />} />
        <Route path="front-office/admissions/add" element={<AddAdmission />} />
        <Route
          path="front-office/admissions/view/:id"
          element={<ViewAdmission />}
        />
        <Route
          path="front-office/admissions/edit/:id"
          element={<AddAdmission />}
        />

        {/* Setup Routes */}
        <Route path="setup/courses" element={<CourseList />} />
        <Route path="setup/courses/add" element={<AddCourse />} />
        <Route path="setup/management" element={<SetupList />} />

        {/* Faculty Routes */}
        <Route path="faculty" element={<FacultyList />} />
        <Route path="faculty/add" element={<AddFaculty />} />

        {/* Student Routes */}
        <Route path="students" element={<StudentList />} />
        <Route path="students/import" element={<ImportStudents />} />
        <Route path="students/view/:id" element={<ViewStudent />} />
        <Route path="students/edit/:id" element={<AddAdmission />} />
        <Route path="students/attendance" element={<StudentAttendance />} />
        <Route path="students/attendance/:id" element={<StudentAttendance />} />
        <Route path="students/fees" element={<StudentFees />} />
        <Route path="students/fees/:id" element={<StudentFees />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
