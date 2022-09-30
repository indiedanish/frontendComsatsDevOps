import React, { lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import contents from "../../routes/contentRoutes";

const PAGE_404 = lazy(() => import("../../pages/presentation/auth/Page404"));

import { useLocation, Navigate, Outlet } from "react-router-dom";
import Login from "../../pages/presentation/auth/Login";
import AdminAuth from "./AdminAuth";
import StudentAuth from "./StudentAuth";
import LoginAuth from "./LoginAuth";
import AdminSidebar from "../Aside/adminSidebar";
import AdminLayout from "./AdminLayout";
import StudentLayout from "./StudentLayout";
import useAuth from "../../hooks/useAuth";
import Page404 from "../../pages/presentation/auth/Page404";

const ContentRoutes = () => {
  const { auth } = useAuth();
  // const auth = {Role: "Admin"}
  console.log("Content contents: ", contents);

  const location = useLocation();
  return (
    <>
      <Routes>
        <Route element={<LoginAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>

      {auth.Role == "Admin" ? (
        <Routes>
          <Route element={<AdminAuth />}>
            <Route element={<AdminLayout />}>
              {contents.presentation.map((page) => (
                <Route key={page.path} {...page} />
              ))}
            
            </Route>
          </Route>
        </Routes>
      ) : auth.Role == "Student" ? (
        <Routes>
          <Route element={<StudentAuth />}>
            <Route element={<StudentLayout />}>
              {contents.student.map((page) => (
                <Route key={page.path} {...page} />
              ))}
              <Route path="*"
            element={
              <Page404/>
            }
          />
            </Route>
            
          </Route>
        </Routes>
      ) : auth.Role == "Teacher" ? (
        <Routes>
          <Route element={<StudentAuth />}>
            <Route element={<StudentLayout />}>
              {contents.student.map((page) => (
                <Route key={page.path} {...page} />
              ))}
            </Route>
            <Route path="*"
            element={
              <Page404/>
            }
          />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="*"
            element={
              <Navigate to="/login"  replace />
            }
          />
        </Routes>
      )}
    </>
  );
};

export default ContentRoutes;

{
  /* <Route path="*" element={<PAGE_404 />} /> */
}
