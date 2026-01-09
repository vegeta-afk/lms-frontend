import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  DollarSign,
  Calendar,
  BookOpen,
  FileText,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Clock,
  TrendingUp,
  Download,
  Printer,
} from "lucide-react";

const ViewStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Student not found</h2>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <User size={18} /> },
    { id: "fees", label: "Fees", icon: <DollarSign size={18} /> },
    { id: "attendance", label: "Attendance", icon: <Calendar size={18} /> },
    { id: "academic", label: "Academic", icon: <BookOpen size={18} /> },
    { id: "documents", label: "Documents", icon: <FileText size={18} /> },
  ];

  // Calculate attendance stats
  const attendanceStats = {
    present: student.attendance?.filter(a => a.status === "present").length || 0,
    absent: student.attendance?.filter(a => a.status === "absent").length || 0,
    leave: student.attendance?.filter(a => a.status === "leave").length || 0,
    total: student.attendance?.length || 0,
  };

  const attendancePercentage = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
    : 0;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              src={student.photo || "/default-avatar.png"}
              alt={student.fullName}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.fullName}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    <GraduationCap size={16} />
                    {student.course}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    <Clock size={16} />
                    {student.batchTime}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.status === "active"
                      ? "bg-green-100 text-green-800"
                      : student.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Printer size={18} />
                  Print
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 font-semibold">Student ID</div>
                <div className="text-xl font-bold">{student.studentId}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 font-semibold">Attendance</div>
                <div className="text-xl font-bold">{attendancePercentage}%</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 font-semibold">Fees Paid</div>
                <div className="text-xl font-bold">₹{student.paidAmount}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 font-semibold">Balance</div>
                <div className="text-xl font-bold">₹{student.balanceAmount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    <span className="font-medium">Name:</span>
                    <span>{student.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span>{student.mobileNumber}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">Address:</div>
                      <div>{student.address}</div>
                      <div>{student.city}, {student.state} - {student.pincode}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Fee Schedule</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add Payment
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Monthly Fee</th>
                      <th className="px-4 py-3 text-left">Exam Fee</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.feeSchedule?.map((fee, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{fee.month}</td>
                        <td className="px-4 py-3">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">₹{fee.amount}</td>
                        <td className="px-4 py-3">
                          {fee.isExamMonth ? `₹${fee.examFee}` : "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{fee.amount + (fee.isExamMonth ? fee.examFee : 0)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fee.status === "paid" 
                              ? "bg-green-100 text-green-800"
                              : fee.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {fee.status === "pending" && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
              
              {/* Attendance Chart */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold">{attendancePercentage}%</div>
                    <div className="text-gray-600">Overall Attendance</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-green-600 font-bold">{attendanceStats.present}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-bold">{attendanceStats.absent}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-600 font-bold">{attendanceStats.leave}</div>
                      <div className="text-sm text-gray-600">Leave</div>
                    </div>
                  </div>
                </div>
                
                {/* Attendance Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly Attendance Table */}
              <div>
                <h4 className="font-semibold mb-3">Monthly Attendance (Last 3 Months)</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Month</th>
                        <th className="px-4 py-2 text-left">Present</th>
                        <th className="px-4 py-2 text-left">Absent</th>
                        <th className="px-4 py-2 text-left">Leave</th>
                        <th className="px-4 py-2 text-left">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* You would populate this with actual monthly data */}
                      <tr>
                        <td className="px-4 py-2">January 2024</td>
                        <td className="px-4 py-2 text-green-600 font-medium">22</td>
                        <td className="px-4 py-2 text-red-600 font-medium">2</td>
                        <td className="px-4 py-2 text-yellow-600 font-medium">1</td>
                        <td className="px-4 py-2">
                          <span className="font-bold">88%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Course Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Course:</span> {student.course}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> 15 months
                    </div>
                    <div>
                      <span className="font-medium">Batch Time:</span> {student.batchTime}
                    </div>
                    <div>
                      <span className="font-medium">Faculty:</span> {student.facultyAllot}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Exam Schedule</h4>
                  {/* This would come from course.examMonths */}
                  <div className="space-y-2">
                    <div>Mid-term: Month 6</div>
                    <div>Final Exam: Month 15</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;