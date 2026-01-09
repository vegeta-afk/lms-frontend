// pages/frontoffice/admission/AdmissionList.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  MoreVertical,
  Phone,
  Calendar,
  CheckCircle,
  UserCheck,
  CalendarDays,
  MessageCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./AdmissionList.css";
import { admissionAPI } from "../../../services/api";

const AdmissionList = () => {
  // State variables
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "admissionNo",
    direction: "desc",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [stats, setStats] = useState({
    total: 0,
    facultyAllotted: 0,
    differentCourses: 0,
    activeStudents: 0,
  });

  // Course options
  const courseOptions = [
    "All Courses",
    "B.Tech Computer Science",
    "MBA",
    "MCA",
    "BBA",
    "BCA",
    "M.Tech",
    "Ph.D",
  ];

  const batchOptions = [
    "All Batches",
    "Morning",
    "Afternoon",
    "Evening",
    "Weekend",
  ];

  const facultyOptions = [
    "All Faculty",
    "Dr. Sharma",
    "Prof. Gupta",
    "Dr. Singh",
    "Prof. Patel",
    "Dr. Kumar",
    "Prof. Reddy",
    "Dr. Joshi",
    "Prof. Mishra",
    "Not Allotted",
  ];

  // Fetch admissions from backend
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);

        // Prepare API params
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };

        // Add search if available
        if (searchTerm) params.search = searchTerm;

        // Add filters
        if (selectedCourse !== "all") params.course = selectedCourse;
        if (selectedBatch !== "all") params.batch = selectedBatch;
        if (selectedFaculty !== "all") params.faculty = selectedFaculty;
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        if (sortConfig.key) params.sortBy = sortConfig.key;
        if (sortConfig.direction) params.sortOrder = sortConfig.direction;

        const response = await admissionAPI.getAdmissions(params);

        if (response.data.success) {
          const admissionData = response.data.data || [];
          const transformedAdmissions = admissionData.map((admission) => ({
            id: admission._id,
            studentId:
              admission.admissionNo || `ADM${admission._id.substring(0, 8)}`,
            name: admission.fullName || admission.applicantName || "N/A",
            mobileNumber:
              admission.mobileNumber || admission.contactNo || "N/A",
            whatsappNumber:
              admission.mobileNumber || admission.contactNo || "N/A",
            course: admission.course || admission.courseInterested || "N/A",
            admissionDate: admission.admissionDate || admission.createdAt,
            batch: admission.batchTime || admission.batch || "Not specified",
            facultyAllot: admission.facultyAllot || "Not Allotted",
            aadharNumber: admission.aadharNumber || "Not provided",
            admissionStatus: admission.status || "confirmed",
            email: admission.email || "N/A",
          }));

          setAdmissions(transformedAdmissions);
          setFilteredAdmissions(transformedAdmissions);

          // Calculate stats
          const total = transformedAdmissions.length;
          const facultyAllotted = transformedAdmissions.filter(
            (a) => a.facultyAllot !== "Not Allotted"
          ).length;
          const differentCourses = new Set(
            transformedAdmissions.map((a) => a.course)
          ).size;
          const activeStudents = transformedAdmissions.filter(
            (a) =>
              a.admissionStatus === "admitted" ||
              a.admissionStatus === "confirmed"
          ).length;

          setStats({
            total,
            facultyAllotted,
            differentCourses,
            activeStudents,
          });

          setPagination({
            ...pagination,
            total: response.data.total || total,
            totalPages:
              response.data.totalPages ||
              Math.ceil((response.data.total || total) / pagination.limit),
          });

          setError(null);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch admissions"
          );
        }
      } catch (err) {
        console.error("Error fetching admissions:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load admissions"
        );
        setAdmissions([]);
        setFilteredAdmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [
    pagination.page,
    selectedCourse,
    selectedBatch,
    selectedFaculty,
    dateRange,
    sortConfig,
  ]);

  // Local filtering for search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAdmissions(admissions);
      return;
    }

    const filtered = admissions.filter(
      (admission) =>
        admission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.mobileNumber.includes(searchTerm) ||
        admission.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.aadharNumber.includes(searchTerm) ||
        admission.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredAdmissions(filtered);
  }, [searchTerm, admissions]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  const applyThisMonthFilter = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setDateRange({
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    });
  };

  const applyTodayFilter = () => {
    const today = new Date().toISOString().split("T")[0];
    setDateRange({ startDate: today, endDate: today });
  };

  const getAdmissionStatusBadge = (status) => {
    const statusMap = {
      confirmed: {
        color: "adm-badge-green",
        label: "Confirmed",
        icon: <CheckCircle size={12} />,
      },
      admitted: {
        color: "adm-badge-green",
        label: "Admitted",
        icon: <CheckCircle size={12} />,
      },
      pending: {
        color: "adm-badge-yellow",
        label: "Pending",
        icon: <CheckCircle size={12} />,
      },
      provisional: {
        color: "adm-badge-blue",
        label: "Provisional",
        icon: <CheckCircle size={12} />,
      },
      cancelled: {
        color: "adm-badge-red",
        label: "Cancelled",
        icon: <CheckCircle size={12} />,
      },
      completed: {
        color: "adm-badge-gray",
        label: "Completed",
        icon: <CheckCircle size={12} />,
      },
      new: {
        color: "adm-badge-blue",
        label: "New",
        icon: <CheckCircle size={12} />,
      },
      under_process: {
        color: "adm-badge-yellow",
        label: "Under Process",
        icon: <CheckCircle size={12} />,
      },
      approved: {
        color: "adm-badge-green",
        label: "Approved",
        icon: <CheckCircle size={12} />,
      },
      rejected: {
        color: "adm-badge-red",
        label: "Rejected",
        icon: <CheckCircle size={12} />,
      },
    };

    const config = statusMap[status] || statusMap.confirmed;
    return (
      <span className={`adm-status-badge ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const openWhatsApp = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === "N/A") {
      alert("No WhatsApp number available");
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length >= 10) {
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    } else {
      alert("Invalid phone number");
    }
  };

  const handleDeleteAdmission = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to delete admission for ${name}?`)
    ) {
      try {
        const response = await admissionAPI.deleteAdmission(id);
        if (response.data.success) {
          alert("Admission deleted successfully!");
          // Refresh the list
          const newAdmissions = admissions.filter(
            (admission) => admission.id !== id
          );
          setAdmissions(newAdmissions);
          setFilteredAdmissions(newAdmissions);
        }
      } catch (err) {
        console.error("Error deleting admission:", err);
        alert(err.response?.data?.message || "Failed to delete admission");
      }
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch (e) {
      return "Invalid Date";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleExport = () => {
    alert("Export feature coming soon!");
  };

  const handleRefresh = () => {
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="adm-list-container">
      {/* Header */}
      <div className="adm-header">
        <div>
          <h1>Admission List</h1>
          <p>View all student admissions converted from enquiries</p>
        </div>
        <div className="adm-header-actions">
          <button
            onClick={handleRefresh}
            className="adm-btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "adm-spinning" : ""} />
            Refresh
          </button>
          <button className="adm-btn-secondary" onClick={handleExport}>
            <Download size={18} />
            Export List
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="adm-loading-overlay">
          <div className="adm-loading-spinner"></div>
          <p>Loading admissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="adm-error-alert">
          <AlertCircle size={20} />
          <div>
            <strong>Error loading admissions:</strong>
            <p>{error}</p>
          </div>
          <button onClick={handleRefresh} className="adm-btn-retry">
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="adm-stats-cards">
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-icon-blue">
              <UserCheck size={24} />
            </div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Admissions</p>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-icon-green">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3>{stats.facultyAllotted}</h3>
              <p>Faculty Allotted</p>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-icon-purple">
              <Calendar size={24} />
            </div>
            <div>
              <h3>{stats.differentCourses}</h3>
              <p>Different Courses</p>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-icon-orange">
              <UserCheck size={24} />
            </div>
            <div>
              <h3>{stats.activeStudents}</h3>
              <p>Active Students</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      {!loading && !error && (
        <div className="adm-filters-section">
          {/* Search Box */}
          <div className="adm-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, student ID, phone, or Aadhar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleRefresh()}
              disabled={loading}
            />
          </div>

          {/* Date Range Filter */}
          <div className="adm-date-filter-section">
            <button
              className="adm-date-filter-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowDateFilter(!showDateFilter);
              }}
              disabled={loading}
            >
              <CalendarDays size={18} />
              {dateRange.startDate && dateRange.endDate ? (
                <span>
                  {formatDate(dateRange.startDate)} -{" "}
                  {formatDate(dateRange.endDate)}
                </span>
              ) : (
                <span>Date Range</span>
              )}
              <ChevronDown size={16} />
            </button>

            {showDateFilter && (
              <div
                className="adm-date-filter-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="adm-date-filter-header">
                  <h4>Filter by Admission Date</h4>
                  <button
                    className="adm-close-btn"
                    onClick={() => setShowDateFilter(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="adm-date-range-inputs">
                  <div className="adm-date-input-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      max={
                        dateRange.endDate ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>

                  <div className="adm-date-input-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                      min={dateRange.startDate}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="adm-quick-date-buttons">
                  <button
                    onClick={applyTodayFilter}
                    className="adm-quick-date-btn"
                  >
                    Today
                  </button>
                  <button
                    onClick={applyThisMonthFilter}
                    className="adm-quick-date-btn"
                  >
                    This Month
                  </button>
                  <button
                    onClick={clearDateFilter}
                    className="adm-quick-date-btn adm-clear"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Course Filter */}
          <div className="adm-filter-select">
            <Filter size={16} />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={loading}
            >
              {courseOptions.map((course) => (
                <option
                  key={course}
                  value={course === "All Courses" ? "all" : course}
                >
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div className="adm-filter-select">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={loading}
            >
              {batchOptions.map((batch) => (
                <option
                  key={batch}
                  value={batch === "All Batches" ? "all" : batch}
                >
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Filter */}
          <div className="adm-filter-select">
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              disabled={loading}
            >
              {facultyOptions.map((faculty) => (
                <option
                  key={faculty}
                  value={faculty === "All Faculty" ? "all" : faculty}
                >
                  {faculty}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="adm-table-container">
        <table className="adm-data-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("admissionNo")}
                className="adm-sortable"
              >
                Student ID{" "}
                {sortConfig.key === "admissionNo" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("fullName")}
                className="adm-sortable"
              >
                Student Name{" "}
                {sortConfig.key === "fullName" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Contact Info</th>
              <th onClick={() => handleSort("course")} className="adm-sortable">
                Course{" "}
                {sortConfig.key === "course" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("admissionDate")}
                className="adm-sortable"
              >
                Admission Date{" "}
                {sortConfig.key === "admissionDate" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Batch</th>
              <th>Faculty Allot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && filteredAdmissions.length > 0 ? (
              filteredAdmissions.map((admission) => (
                <tr key={admission.id}>
                  <td className="adm-student-id">{admission.studentId}</td>
                  <td>
                    <div className="adm-student-info">
                      <div className="adm-avatar">
                        {admission.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{admission.name}</strong>
                        <small>Aadhar: {admission.aadharNumber}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="adm-contact-info">
                      <div>
                        <Phone size={14} /> {admission.mobileNumber}
                      </div>
                      <div>
                        <MessageCircle
                          size={14}
                          className="adm-whatsapp-icon"
                        />
                        {admission.whatsappNumber}
                      </div>
                    </div>
                  </td>
                  <td>{admission.course}</td>
                  <td>
                    <div className="adm-date-info">
                      <Calendar size={14} />
                      {formatDate(admission.admissionDate)}
                    </div>
                  </td>
                  <td>
                    <span className="adm-batch-badge">{admission.batch}</span>
                  </td>
                  <td>
                    <span
                      className={`adm-faculty-badge ${
                        admission.facultyAllot === "Not Allotted"
                          ? "adm-not-allotted"
                          : ""
                      }`}
                    >
                      {admission.facultyAllot}
                    </span>
                  </td>
                  <td>{getAdmissionStatusBadge(admission.admissionStatus)}</td>
                  <td>
                    <div className="adm-action-buttons">
                      <Link
                        to={`/admin/front-office/admissions/view/${admission.id}`}
                        className="adm-action-btn adm-view"
                        title="View Admission"
                      >
                        <Eye size={16} />
                      </Link>

                      <div className="adm-dropdown-container">
                        <button
                          className="adm-action-btn adm-more"
                          onClick={(e) => toggleDropdown(admission.id, e)}
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openDropdown === admission.id && (
                          <div className="adm-dropdown-menu">
                            <Link
                              to={`/admin/front-office/admissions/edit/${admission.id}`}
                              className="adm-dropdown-item"
                            >
                              <Edit size={14} />
                              <span>Edit Admission</span>
                            </Link>
                            <button
                              className="adm-dropdown-item"
                              onClick={() =>
                                openWhatsApp(admission.whatsappNumber)
                              }
                            >
                              <MessageCircle size={14} />
                              <span>Chat on WhatsApp</span>
                            </button>
                            <button
                              className="adm-dropdown-item adm-delete-option"
                              onClick={() =>
                                handleDeleteAdmission(
                                  admission.id,
                                  admission.name
                                )
                              }
                            >
                              <Trash2 size={14} />
                              <span>Delete Admission</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="adm-empty-row">
                  <div className="adm-empty-state">
                    <UserCheck size={48} />
                    <h3>No admissions found</h3>
                    <p>
                      {loading
                        ? "Loading..."
                        : "Try adjusting your search or filter criteria."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="adm-pagination">
          <div className="adm-pagination-info">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} admissions
          </div>
          <div className="adm-pagination-controls">
            <button
              className="adm-pagination-btn"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </button>
            <span className="adm-pagination-page-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="adm-pagination-btn"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionList;
