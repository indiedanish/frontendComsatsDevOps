import React from 'react'
import AdminAuth from "./RequireAuth";
import AdminLayout from "./AdminLayout";
import { Route, Routes } from "react-router-dom";
import contents from "../../routes/contentRoutes";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
            {contents.admin.map((page) => (
              <Route key={page.path} {...page} />
              ))}
          
          </Route> 
    </Routes>
  )
}

export default AdminRoutes
