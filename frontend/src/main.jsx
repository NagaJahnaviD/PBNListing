import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootLayout from './components/user/RootLayout'
import Index from './components/admin/Index'
import Home from './components/user/Home'
import AdminLayout from './components/admin/AdminLayout'
import BlockManagement from './components/admin/BlockManagement'
import AdminHeader from './components/admin/AdminHeader'
import ConfigurationManagenment from './components/admin/ConfigurationManagenment'
import TestimonialManagement from './components/admin/TestimonialManagement'
import "bootstrap/dist/css/bootstrap.css"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const browserRouterObj = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "block-list",
        element: <BlockManagement />,
      },
      {
        path: "testimonial-list",
        element: <TestimonialManagement />,
      },
      {
        path: "configuration",
        element: <ConfigurationManagenment />,
      },
    ],
  },


]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={browserRouterObj}/>
  </StrictMode>,
)
