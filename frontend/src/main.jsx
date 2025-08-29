import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootLayout from './components/user/RootLayout'
import Index from './components/admin/Index'
import Home from './components/user/Home'
import AdminLayout from './components/admin/AdminLayout'
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
    ],
  },


]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={browserRouterObj}/>
  </StrictMode>,
)
