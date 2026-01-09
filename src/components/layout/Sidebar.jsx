import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Building,
  Phone,
  AlertCircle,
  Mail,
  Settings,
  List,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Briefcase,
  UserPlus,
  Calendar,
  FileText,
  CreditCard,
  BarChart,
  Clock,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({
    frontOffice: true,
    students: true, // Add this
    faculty: true,
    setup: false,
  });

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: "frontOffice",
      label: "Front Office",
      icon: <Building size={20} />,
      isDropdown: true,
      subItems: [
        {
          path: "/admin/front-office/enquiries",
          label: "Enquiry List",
          icon: <List size={16} />,
        },
        {
          path: "/admin/front-office/admissions",
          label: "Admission List",
          icon: <UsersIcon size={16} />,
        },
        {
          path: "/admin/front-office/visitors",
          label: "Visitors",
          icon: <UsersIcon size={16} />,
        },
        {
          path: "/admin/front-office/calls",
          label: "Call Logs",
          icon: <Phone size={16} />,
        },
        {
          path: "/admin/front-office/complaints",
          label: "Complaints",
          icon: <AlertCircle size={16} />,
        },
        {
          path: "/admin/front-office/postal",
          label: "Postal",
          icon: <Mail size={16} />,
        },
        {
          key: "setup",
          label: "Setup",
          icon: <Settings size={16} />,
          isDropdown: true,
          subItems: [
            {
              path: "/admin/setup/courses",
              label: "Course Management",
              icon: <GraduationCap size={14} />,
            },
            {
              path: "/admin/setup/management",
              label: "Setup Management",
              icon: <Briefcase size={14} />,
            },
          ],
        },
      ],
    },
    {
      key: "students", // Changed from path to key
      label: "Students",
      icon: <UsersIcon size={20} />,
      isDropdown: true,
      subItems: [
        {
          path: "/admin/students",
          label: "Student List",
          icon: <UsersIcon size={16} />,
        },
        {
          path: "/admin/students/attendance",
          label: "Attendance",
          icon: <Calendar size={16} />,
        },
        {
          path: "/admin/students/fees",
          label: "Fee Management",
          icon: <CreditCard size={16} />,
        },
        {
          path: "/admin/students/exams",
          label: "Exam Results",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      key: "faculty",
      label: "Faculty",
      icon: <Briefcase size={20} />,
      isDropdown: true,
      subItems: [
        {
          path: "/admin/faculty",
          label: "Faculty List",
          icon: <UsersIcon size={16} />,
        },
        {
          path: "/admin/faculty/add",
          label: "Add Faculty",
          icon: <UserPlus size={16} />,
        },
        {
          path: "/admin/faculty/attendance",
          label: "Attendance",
          icon: <Calendar size={16} />,
        },
        {
          path: "/admin/faculty/leave",
          label: "Leave Management",
          icon: <Clock size={16} />,
        },
        {
          path: "/admin/faculty/salary",
          label: "Salary/Payroll",
          icon: <CreditCard size={16} />,
        },
        {
          path: "/admin/faculty/schedule",
          label: "Schedule/Timetable",
          icon: <FileText size={16} />,
        },
        {
          path: "/admin/faculty/performance",
          label: "Performance",
          icon: <BarChart size={16} />,
        },
      ],
    },
  ];

  const renderMenuItems = (items, level = 0) => {
    return items.map((item, index) => {
      if (item.isDropdown) {
        const isOpen = openDropdowns[item.key];

        return (
          <div key={item.key || index} className="menu-item">
            <button
              className={
                level === 0 ? "dropdown-toggle" : "nested-dropdown-toggle"
              }
              onClick={() => toggleDropdown(item.key)}
            >
              <span className={level === 0 ? "nav-icon" : "sub-nav-icon"}>
                {item.icon}
              </span>
              <span className={level === 0 ? "nav-label" : "sub-nav-label"}>
                {item.label}
              </span>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && item.subItems && (
              <div className={level === 0 ? "sub-menu" : "nested-sub-menu"}>
                {renderMenuItems(item.subItems, level + 1)}
              </div>
            )}
          </div>
        );
      }

      // Regular link item
      const isActive = location.pathname === item.path;

      if (level === 0) {
        // Main level link (Dashboard only)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      } else if (level === 1) {
        // First level sub-link (Enquiry List, Admission List, etc.)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`sub-nav-link ${isActive ? "active" : ""}`}
          >
            <span className="sub-nav-icon">{item.icon}</span>
            <span className="sub-nav-label">{item.label}</span>
          </Link>
        );
      } else {
        // Second level sub-link (Setup -> Course Management, etc.)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nested-sub-nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nested-sub-nav-icon">{item.icon}</span>
            <span className="nested-sub-nav-label">{item.label}</span>
          </Link>
        );
      }
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>IMS Menu</h3>
      </div>
      <nav className="sidebar-nav">{renderMenuItems(menuItems)}</nav>
    </aside>
  );
};

export default Sidebar;
