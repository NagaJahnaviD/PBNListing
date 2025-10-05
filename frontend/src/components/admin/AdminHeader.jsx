// components/AdminHeader.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminHeader() {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBase}/admin/logout`, {}, { withCredentials: true });
      alert("Logged out successfully");
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="header d-flex justify-content-between align-items-center p-2 bg-light shadow-sm">
      {/* Logo */}
      <div>
        <Link to="/admin" className="fw-bold text-decoration-none">
          LOGO
        </Link>
      </div>

      {/* Navigation */}
      <ul className="d-flex align-items-center list-unstyled m-0">
        {/* Content Management Dropdown */}
        <li className="nav-item me-3 position-relative">
          <button
            className="btn btn-outline-primary"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Content Management
          </button>
          {dropdownOpen && (
            <ul
              className="dropdown-menu show position-absolute"
              style={{ top: "100%", left: 0 }}
            >
              <li>
                <Link to="block-list" className="dropdown-item">
                  Blocks
                </Link>
                <Link to="/admin" className="dropdown-item">
                  Pages
                </Link>
              </li>
              <li>
                <Link to="testimonial-list" className="dropdown-item">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="blog-list" className="dropdown-item">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="client-list" className="dropdown-item">
                  Clients
                </Link>
              </li>
              <li>
                <Link to="banner-list" className="dropdown-item">
                  Banners
                </Link>
              </li>
              <li>
                <Link to="menu" className="dropdown-item">
                  Menus
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Other Links */}
        <li className="me-3">
          <Link to="configuration" className="btn btn-outline-secondary">
            Configuration
          </Link>
        </li>
        <li className="me-3">
          <Link to="change-password" className="btn btn-outline-secondary">
            Change Password
          </Link>
        </li>

        {/* Logout */}
        <li>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
