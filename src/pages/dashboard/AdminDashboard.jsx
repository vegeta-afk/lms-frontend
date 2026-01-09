// pages/dashboard/AdminDashboard.jsx
import React from 'react';
import './AdminDashboard.css';
import { 
  Users, 
  UserCircle, 
  BookOpen, 
  Calendar,
  Bell,
  TrendingUp,
  MoreVertical
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - replace with API data
  const stats = {
    totalStudents: 2500,
    totalTeachers: 150,
    exams: 12,
    events: 8
  };

  const genderData = {
    boys: 1500,
    girls: 1000
  };

  const attendanceData = [
    { day: 'Mon', present: 200 },
    { day: 'Tue', present: 300 },
    { day: 'Wed', present: 250 },
    { day: 'Thu', present: 180 },
    { day: 'Fri', present: 220 },
    { day: 'Sat', present: 0 }
  ];

  const notices = [
    { title: 'School annual sports day celebration 2023', date: '05 July, 2023' },
    { title: 'Annual Function celebration 2023-24', date: '15 June, 2023' },
    { title: 'Mid term examination routine published', date: '18 May, 2023' },
    { title: 'Inter school annual painting competition', date: '10 May, 2023' }
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>IMS Dashboard</h1>
          <p>Welcome back, Admin! Here's your overview.</p>
        </div>
        <div className="header-right">
          <button className="notification-btn">
            <Bell size={22} />
            <span className="badge">3</span>
          </button>
          <button className="profile-btn">
            <UserCircle size={22} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#4f46e5' }}>
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalStudents}</h3>
                <p>Total Students</p>
              </div>
              <MoreVertical className="more-icon" />
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalTeachers}</h3>
                <p>Teachers</p>
              </div>
              <MoreVertical className="more-icon" />
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
                <BookOpen size={24} />
              </div>
              <div className="stat-info">
                <h3>{stats.exams}</h3>
                <p>Exam</p>
              </div>
              <MoreVertical className="more-icon" />
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#8b5cf6' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <h3>{stats.events}</h3>
                <p>Events</p>
              </div>
              <MoreVertical className="more-icon" />
            </div>
          </div>

          {/* Analytics Card */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Analytics</h3>
              <TrendingUp size={20} />
            </div>
            <div className="analytics-content">
              {/* Add analytics chart here */}
              <div className="chart-placeholder">
                Analytics Chart
              </div>
            </div>
          </div>

          {/* Help Center */}
          <div className="help-center">
            <h3>Help center</h3>
            <p>Get help and documentation</p>
            <button className="help-btn">Visit Help Center</button>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Gender Distribution */}
          <div className="gender-card">
            <h3>Total Students by Gender</h3>
            <div className="gender-stats">
              <div className="gender-item">
                <div className="gender-label">
                  <span className="dot" style={{ backgroundColor: '#3b82f6' }}></span>
                  <span>Boys</span>
                </div>
                <span className="gender-count">{genderData.boys}</span>
              </div>
              <div className="gender-item">
                <div className="gender-label">
                  <span className="dot" style={{ backgroundColor: '#ec4899' }}></span>
                  <span>Girls</span>
                </div>
                <span className="gender-count">{genderData.girls}</span>
              </div>
            </div>
            <div className="gender-chart">
              <div className="chart-bar" style={{ width: '60%', backgroundColor: '#3b82f6' }}>
                Boys {Math.round((genderData.boys / (genderData.boys + genderData.girls)) * 100)}%
              </div>
              <div className="chart-bar" style={{ width: '40%', backgroundColor: '#ec4899' }}>
                Girls {Math.round((genderData.girls / (genderData.boys + genderData.girls)) * 100)}%
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="attendance-card">
            <h3>Attendance</h3>
            <div className="attendance-grid">
              {attendanceData.map((item, index) => (
                <div key={index} className="attendance-day">
                  <div className="attendance-count">{item.present}</div>
                  <div className="attendance-label">{item.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Board */}
          <div className="notice-card">
            <div className="card-header">
              <h3>Notice Board</h3>
              <span className="view-all">View All</span>
            </div>
            <div className="notice-list">
              {notices.map((notice, index) => (
                <div key={index} className="notice-item">
                  <div className="notice-content">
                    <h4>{notice.title}</h4>
                    <span className="notice-date">{notice.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Calendar */}
          <div className="calendar-card">
            <div className="calendar-header">
              <h3>Event Calendar</h3>
              <span>July 2023</span>
            </div>
            <div className="calendar-weekdays">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {calendarDays.map((day) => (
                <div key={day} className={`calendar-day ${day === 15 ? 'event-day' : ''}`}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;