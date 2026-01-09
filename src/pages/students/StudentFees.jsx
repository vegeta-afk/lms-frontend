import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
} from "lucide-react";

const StudentFees = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    monthNumber: "",
    paymentDate: new Date().toISOString().split("T")[0],
    receiptNo: "",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSingleStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      const data = await response.json();
      setStudents([data]);
      setSelectedStudent(data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(
        `/api/students/${selectedStudent._id}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      if (response.ok) {
        alert("Payment recorded successfully!");
        setShowPaymentModal(false);
        setPaymentData({
          amount: "",
          monthNumber: "",
          paymentDate: new Date().toISOString().split("T")[0],
          receiptNo: "",
        });
        fetchSingleStudent(); // Refresh data
      }
    } catch (error) {
      alert("Error recording payment");
      console.error(error);
    }
  };

  const calculateFeeSummary = (student) => {
    const totalFee = student.totalCourseFee || 0;
    const paid = student.paidAmount || 0;
    const balance = student.balanceAmount || 0;
    const pendingMonths =
      student.feeSchedule?.filter((f) => f.status === "pending").length || 0;
    const overdueMonths =
      student.feeSchedule?.filter((f) => f.status === "overdue").length || 0;

    return { totalFee, paid, balance, pendingMonths, overdueMonths };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Fee Management</h1>
            <p className="text-gray-600">Manage student fees and payments</p>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} />
            Add Payment
          </button>
        </div>

        {/* Student Selector (only when viewing all students) */}
        {!id && (
          <div className="mb-6">
            <select
              value={selectedStudent?._id || ""}
              onChange={(e) => {
                const student = students.find((s) => s._id === e.target.value);
                setSelectedStudent(student);
              }}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select a student...</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.studentId} - {student.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Fee Summary */}
        {selectedStudent && (
          <>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-semibold">
                    Total Course Fee
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{calculateFeeSummary(selectedStudent).totalFee}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-semibold">
                    Paid Amount
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{calculateFeeSummary(selectedStudent).paid}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-600 font-semibold">
                    Balance Amount
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{calculateFeeSummary(selectedStudent).balance}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-yellow-600 font-semibold">
                    Pending Months
                  </div>
                  <div className="text-2xl font-bold">
                    {calculateFeeSummary(selectedStudent).pendingMonths}
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Schedule Table */}
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
                    <th className="px-4 py-3 text-left">Payment Date</th>
                    <th className="px-4 py-3 text-left">Receipt No</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.feeSchedule?.map((fee, index) => (
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            fee.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : fee.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {fee.paymentDate
                          ? new Date(fee.paymentDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">{fee.receiptNo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Record Payment</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student
                  </label>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    {selectedStudent.fullName} ({selectedStudent.studentId})
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    For Month
                  </label>
                  <select
                    value={paymentData.monthNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        monthNumber: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select month...</option>
                    {selectedStudent.feeSchedule
                      ?.filter((f) => f.status === "pending")
                      .map((fee) => (
                        <option key={fee.monthNumber} value={fee.monthNumber}>
                          {fee.month} - ₹
                          {fee.amount + (fee.isExamMonth ? fee.examFee : 0)}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.receiptNo}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        receiptNo: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter receipt number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFees;
