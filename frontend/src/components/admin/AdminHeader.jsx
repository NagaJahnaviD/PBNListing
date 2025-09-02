import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function AdminHeader() {
  return (
    <div>
      <nav className='header d-flex justify-content-between align-items-center'>
        <div className="d-flex justify-content-center">
          <Link to='/admin'>LOGO</Link>
        </div>
          <ul className='d-flex justify-content-around list-unstyled header-links'>  
              <li>
                <Link to="configuration">Configuration</Link>
              </li> 
            
              <li>
                <Link to="">Pages</Link>
              </li>
              <li>
                <Link to="block-list">Blocks</Link>
              </li>    
              <li>
                <Link to="testimonial-list">Testimonials</Link>
              </li>       
          </ul>
      </nav>
    </div>
  )
}

export default AdminHeader