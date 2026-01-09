import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowLeft,
  Loader2,
  UserCheck,
  XCircle,
} from "lucide-react";

const ImportStudents = () => {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [selectedAdmissions, setSelectedAdmissions] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversionStatus, setConversionStatus] = useState({}); // Track which admissions are already converted

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // Fetch ALL admissions
      const response = await fetch("/api/admissions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 All admissions response:", data);

      if (data.success && data.data) {
        console.log(`✅ Found ${data.data.length} total admissions`);
        setAdmissions(data.data);
        checkConversionStatus(data.data);
      } else {
        setAdmissions([]);
      }

      setImportStatus(null);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      setImportStatus({
        type: "error",
        message: "Failed to load admissions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkConversionStatus = async (admissionsList) => {
    try {
      const admissionIds = admissionsList.map((a) => a._id);

      const response = await fetch("/api/admissions/check-bulk-conversion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` || "",
        },
        body: JSON.stringify({ admissionIds }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Create a map of conversion status
          const statusMap = {};
          data.data.forEach((item) => {
            statusMap[item.admissionId] = {
              isConverted: item.isConverted,
              studentId: item.studentCode,
            };
          });
          setConversionStatus(statusMap);
        }
      }
    } catch (error) {
      console.error("Error checking conversion status:", error);
    }
  };

  const toggleSelectAdmission = (admissionId) => {
    // Don't allow selection if already converted
    if (conversionStatus[admissionId]?.isConverted) {
      return;
    }

    setSelectedAdmissions((prev) =>
      prev.includes(admissionId)
        ? prev.filter((id) => id !== admissionId)
        : [...prev, admissionId]
    );
  };

  const selectAllAdmissions = () => {
    // Only select admissions that are not already converted
    const convertibleAdmissions = filteredAdmissions
      .filter((a) => !conversionStatus[a._id]?.isConverted)
      .map((a) => a._id);

    if (selectedAdmissions.length === convertibleAdmissions.length) {
      setSelectedAdmissions([]);
    } else {
      setSelectedAdmissions(convertibleAdmissions);
    }
  };

  const handleImport = async () => {
    if (selectedAdmissions.length === 0) {
      setImportStatus({
        type: "warning",
        message: "Please select at least one admission to import.",
      });
      return;
    }

    setImporting(true);
    setImportStatus({
      type: "info",
      message: `Importing ${selectedAdmissions.length} students...`,
    });

    try {
      const response = await fetch("/api/students/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` || "",
        },
        body: JSON.stringify({ admissionIds: selectedAdmissions }),
      });

      const data = await response.json();

      if (data.success) {
        setImportStatus({
          type: "success",
          message: `Successfully imported ${
            data.results?.successful || 0
          } students.`,
          details: data.results,
        });

        // Clear selection
        setSelectedAdmissions([]);

        // Refresh admissions list and conversion status
        setTimeout(() => {
          fetchAdmissions();
          // Navigate back to student list after 2 seconds
          setTimeout(() => navigate("/admin/students"), 2000);
        }, 1000);
      } else {
        setImportStatus({
          type: "error",
          message: data.message || "Import failed",
          details: data.results,
        });
      }
    } catch (error) {
      console.error("Error importing students:", error);
      setImportStatus({
        type: "error",
        message: "Failed to import students. Please try again.",
      });
    } finally {
      setImporting(false);
    }
  };

  const filteredAdmissions = admissions.filter(
    (admission) =>
      admission.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count convertible admissions (not already converted)
  const convertibleCount = filteredAdmissions.filter(
    (a) => !conversionStatus[a._id]?.isConverted
  ).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/students")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <Users className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-bold">
              Import Students from Admissions
            </h1>
            <p className="text-gray-600">
              Select approved admissions to create student profiles
            </p>
          </div>
        </div>

        {/* Status Message */}
        {importStatus && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              importStatus.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : importStatus.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : importStatus.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {importStatus.type === "success" ? (
                <CheckCircle size={20} />
              ) : importStatus.type === "error" ? (
                <AlertCircle size={20} />
              ) : (
                <Loader2 className="animate-spin" size={20} />
              )}
              <span className="font-medium">{importStatus.message}</span>
            </div>

            {importStatus.details && (
              <div className="mt-2 text-sm">
                {importStatus.details.errors &&
                  importStatus.details.errors.length > 0 && (
                    <div className="mt-2">
                      <strong>Errors:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {importStatus.details.errors
                          .slice(0, 5)
                          .map((error, index) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                        {importStatus.details.errors.length > 5 && (
                          <li className="text-sm">
                            ...and {importStatus.details.errors.length - 5} more
                            errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={
                convertibleCount > 0 &&
                selectedAdmissions.length === convertibleCount
              }
              onChange={selectAllAdmissions}
              disabled={convertibleCount === 0}
              className="h-5 w-5"
            />
            <label htmlFor="selectAll" className="font-medium">
              Select All ({convertibleCount} available,{" "}
              {filteredAdmissions.length - convertibleCount} already imported)
            </label>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search admissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 md:flex-none md:w-64 px-4 py-2 border rounded-lg"
            />
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={18} />
              Filter
            </button>
            <button
              onClick={handleImport}
              disabled={selectedAdmissions.length === 0 || importing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Importing...
                </>
              ) : (
                <>Import Selected ({selectedAdmissions.length})</>
              )}
            </button>
          </div>
        </div>

        {/* Admissions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Select</th>
                <th className="px-4 py-3 text-left">Admission No</th>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Admission Date</th>
                <th className="px-4 py-3 text-left">Total Fees</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>No approved admissions found.</p>
                    <p className="text-sm mt-1">
                      Only admissions with status "approved" are shown here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((admission) => {
                  const isConverted =
                    conversionStatus[admission._id]?.isConverted;
                  const studentId = conversionStatus[admission._id]?.studentId;

                  return (
                    <tr key={admission._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {!isConverted ? (
                          <input
                            type="checkbox"
                            checked={selectedAdmissions.includes(admission._id)}
                            onChange={() =>
                              toggleSelectAdmission(admission._id)
                            }
                            className="h-5 w-5"
                          />
                        ) : (
                          <div className="flex justify-center">
                            <UserCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-mono text-sm font-medium">
                            {admission.admissionNo}
                          </span>
                          {isConverted && studentId && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <CheckCircle size={10} />
                              Imported as: {studentId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">
                            {admission.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admission.mobileNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{admission.course}</td>
                      <td className="px-4 py-3">
                        {new Date(admission.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₹{admission.totalFees || 0}
                      </td>
                      <td className="px-4 py-3">
                        {isConverted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                            <UserCheck size={12} />
                            Already Imported
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                            <CheckCircle size={12} />
                            Ready to Import
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm font-medium">
                Total Admissions
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {filteredAdmissions.length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">
                Ready to Import
              </div>
              <div className="text-2xl font-bold text-green-600">
                {convertibleCount}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">
                Already Imported
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {filteredAdmissions.length - convertibleCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudents;
