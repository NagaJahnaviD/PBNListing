import React from 'react'
import UserHeader from './UserHeader'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
        <UserHeader/>
        <div className="container-fluid flex-grow-1 p-4 w-50">
          <Outlet />
        </div>
    </div>
  )
}

export default RootLayout