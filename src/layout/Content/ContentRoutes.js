import React, { lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import contents from "../../routes/contentRoutes";

const PAGE_404 = lazy(() => import("../../pages/presentation/auth/Page404"));

import { useLocation, Navigate, Outlet } from "react-router-dom";
import Login from "../../pages/presentation/auth/Login";
import RequireAuth from "./RequireAuth";

import LoginAuth from "./LoginAuth";
import AdminSidebar from "../Aside/adminSidebar";
import AdminLayout from "./AdminLayout";
import StudentLayout from "./TeamLeadLayout";
import useAuth from "../../hooks/useAuth";
import AdminRoutes from "./AdminRoutes";

import Page404 from "../../pages/presentation/auth/Page404";
import TeamLeadRoutes from "./TeadLeadRoutes";
const ContentRoutes = () => {
  const { auth } = useAuth();
  // const auth = {Role: "Admin"}

  const location = useLocation();

  return (
    <>
      <Routes path="/">

      <Route element={<LoginAuth />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<LoginAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RequireAuth role="Admin" />}>
          <Route path="/admin/*" element={<AdminRoutes/>} />

        </Route>

        <Route element={<RequireAuth role="TeamLead" />}>
          <Route path="/teamlead/*" element={<TeamLeadRoutes/>} />

        </Route>


        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default ContentRoutes;

{
  /* <Route path="*" element={<PAGE_404 />} /> */
}
