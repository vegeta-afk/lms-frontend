import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";

const StudentAttendance = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSingleStudent();
    } else {
      fetchAllStudents();
    }
  }, [id]);

  const fetchAllStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const result = await response.json();

      const studentsData = result.data || [];
      setStudents(studentsData);

      const initialAttendance = {};
      studentsData.forEach((student) => {
        initialAttendance[student._id] = "present";
      });

      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      const result = await response.json();
      const student = result.data;

      setStudents([student]);
      setAttendance({ [student._id]: "present" });
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const saveAttendance = async () => {
    try {
      const promises = Object.entries(attendance).map(([studentId, status]) =>
        fetch(`/api/students/${studentId}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            status,
            remarks: "",
          }),
        })
      );

      await Promise.all(promises);
      alert("Attendance saved successfully!");
    } catch (error) {
      alert("Error saving attendance");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Attendance</h1>
            <p className="text-gray-600">Mark attendance for students</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Total Students</div>
              <div className="text-2xl font-bold">{students.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold">Present Today</div>
              <div className="text-2xl font-bold">
                {
                  Object.values(attendance).filter(
                    (status) => status === "present"
                  ).length
                }
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 font-semibold">Absent Today</div>
              <div className="text-2xl font-bold">
                {
                  Object.values(attendance).filter(
                    (status) => status === "absent"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Student ID</th>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Attendance Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono">{student.studentId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full mr-3"
                        src={student.photo || "/default-avatar.png"}
                        alt={student.fullName}
                      />
                      <div>
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {student.batchTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{student.course}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        attendance[student._id] === "present"
                          ? "bg-green-100 text-green-800"
                          : attendance[student._id] === "absent"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {attendance[student._id]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateAttendance(student._id, "present")}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                          attendance[student._id] === "present"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <CheckCircle size={14} />
                        Present
                      </button>
                      <button
                        onClick={() => updateAttendance(student._id, "absent")}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                          attendance[student._id] === "absent"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <XCircle size={14} />
                        Absent
                      </button>
                      <button
                        onClick={() => updateAttendance(student._id, "leave")}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                          attendance[student._id] === "leave"
                            ? "bg-yellow-600 text-white"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <Clock size={14} />
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveAttendance}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
