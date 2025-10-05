import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // needed for dropdown
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
import AddClient from './components/admin/AddClient'
import AddBanner from './components/admin/AddBanner'
import BannerManagement from './components/admin/BannerManagement'
import ClientManagement from './components/admin/ClientManagement'
import MenuManagement from './components/admin/MenuManagement';
import UserHeader from './components/user/UserHeader';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PageView from './components/user/PageView'
const browserRouterObj = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      { path: ":pageUrl",
        element: <PageView /> },
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
        path: "menu",
        element: <MenuManagement />,
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
        path: "client-list",
        element: <ClientManagement />,
      },
      {
        path: "add-client",
        element: <AddClient />,
      },
      {
        path: "banner-list",
        element: <BannerManagement />,
      },
      {
        path: "add-banner",
        element: <AddBanner />,
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
