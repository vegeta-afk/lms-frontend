// components/layout/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>IMS Dashboard</h2>
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <span>Admin User</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;