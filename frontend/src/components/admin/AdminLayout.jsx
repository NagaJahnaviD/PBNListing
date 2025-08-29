import React from 'react'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router-dom'
function AdminLayout() {
  return (
    <div>
        <AdminHeader/>
        <div style={{ minHeight: "90vh" }}>
          <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout