import React from 'react'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router-dom'
import Footer from '../common/Footer'
// Make sure to install and import Bootstrap in your project's entry file (e.g., index.js or App.js)
// npm install bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css';

function AdminLayout() {
  return (
    // Use flexbox to ensure the layout takes up the full viewport height
    <div className="d-flex flex-column min-vh-100">
        <AdminHeader/>
        <div className="container-fluid flex-grow-1 p-4 w-50">
          <Outlet />
        </div>
        <Footer/>
    </div>
  )
}

export default AdminLayout