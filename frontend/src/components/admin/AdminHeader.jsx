import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminHeader() {
  const navigate = useNavigate();
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
    <div>
      <nav className="header d-flex justify-content-between align-items-center p-2 bg-light shadow-sm">
        <div>
          <Link to="/admin" className="fw-bold text-decoration-none">
            LOGO
          </Link>
        </div>

        <ul className="d-flex align-items-center list-unstyled m-0">
          {/* Content Management Dropdown */}
          <li className="nav-item dropdown me-3">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              id="contentDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Content Management
            </button>
            <ul className="dropdown-menu" aria-labelledby="contentDropdown">
              <li>
                <Link to="block-list" className="dropdown-item">
                  Blocks
                </Link>
                <Link to="" className="dropdown-item">
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
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminHeader;
