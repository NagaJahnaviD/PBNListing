import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootLayout from './components/user/RootLayout'
import Index from './components/admin/Index'
import Home from './components/user/Home'
import AdminLayout from './components/admin/AdminLayout'
import BlockManagement from './components/admin/BlockManagement'
import ChangeAdminPassword from './components/admin/ChangeAdminPassword'
import ConfigurationManagenment from './components/admin/ConfigurationManagenment'
import TestimonialManagement from './components/admin/TestimonialManagement'
import AdminLogin from './components/admin/AdminLogin'
import AddTestimonial from './components/admin/AddTestimonial'
import AddPage from './components/admin/AddPage'
import AddBlock from './components/admin/AddBlock'
import BlogManagement from './components/admin/BlogManagement'
import AddBlog from './components/admin/AddBlog'
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
        path: "login",
        element: <AdminLogin />,
      },
      {
        path: "change-password",
        element: <ChangeAdminPassword />,
      },
      {
        path: "add-page",
        element: <AddPage />,
      },
      {
        path: "block-list",
        element: <BlockManagement />,
      },
      {
        path: "add-block",
        element: <AddBlock />,
      },
      {
        path: "testimonial-list",
        element: <TestimonialManagement />,
      },
      {
        path: "add-testimonial",
        element: <AddTestimonial />,
      },
      {
        path: "blog-list",
        element: <BlogManagement />,
      },
      {
        path: "add-blog",
        element: <AddBlog />,
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
