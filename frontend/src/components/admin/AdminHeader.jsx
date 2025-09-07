import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function AdminHeader() {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const handleLogout = async () => {
    try {
      axios.post("http://localhost:3000/admin/logout", {}, {
        withCredentials: true
      });
      console.log("Logout request sent");
      // clears cookie on backend
      alert("logged out successfully");
      navigate("/admin/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <nav className="header d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-center">
          <Link to="/admin">LOGO</Link>
        </div>
        <ul className="d-flex justify-content-around list-unstyled header-links">  
          <li><Link to="configuration">Configuration</Link></li> 
          <li><Link to="">Pages</Link></li>
          <li><Link to="block-list">Blocks</Link></li>    
          <li><Link to="testimonial-list">Testimonials</Link></li>   
          <li><Link to="blog-list">Blogs</Link></li>   
          <li><Link to="change-password">ChangePassword</Link></li> 
          <li>
            <button 
              onClick={handleLogout} 
              className="btn btn-danger btn-sm"
            >
              Logout
            </button>
          </li>      
        </ul>
      </nav>
    </div>
  )
}

export default AdminHeader
