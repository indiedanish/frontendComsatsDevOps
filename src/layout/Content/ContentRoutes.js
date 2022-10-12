import React, { lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";


const PAGE_404 = lazy(() => import("../../pages/presentation/auth/Page404"));

import { useLocation, Navigate, Outlet } from "react-router-dom";
import Login from "../../pages/presentation/auth/Login";
import RequireAuth from "./RequireAuth";

import LoginAuth from "./LoginAuth";

import useAuth from "../../hooks/useAuth";
import AdminRoutes from "./AdminRoutes/AdminRoutes";
import TeamLeadRoutes from "./TeamLeadRoutes/TeadLeadRoutes";
import TeamMemberRoutes from "./TeamMemberRoutes/TeamMemberRoutes";
import SupervisorRoutes from "./SupervisorRoutes/SupervisorRoutes";
import CommitteeRoutes from './CommitteeRoutes/CommitteeRoutes'
import Page404 from "../../pages/presentation/auth/Page404";

const ContentRoutes = () => {
  const { auth } = useAuth();
  // const auth = {Role: "Admin"}

  const location = useLocation();

  console.log("IM AT CON ROUTES: ", auth.Role);

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
          <Route path="/admin/*" element={<AdminRoutes />} />

        </Route>

        <Route element={<RequireAuth role="TeamLead" />}>
          <Route path="/teamlead/*" element={<TeamLeadRoutes />} />

        </Route>

            <Route element={<RequireAuth role="TeamMember" />}>
          <Route path="/teammember/*" element={<TeamMemberRoutes />} />

        </Route>

        <Route element={<RequireAuth role="Committee" />}>
          <Route path="/committee/*" element={<CommitteeRoutes />} />

        </Route>

        <Route element={<RequireAuth role="Supervisor" />}>
          <Route path="/supervisor/*" element={<SupervisorRoutes />} />

        </Route>

       
        {/* teammember */}

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default ContentRoutes;

{
  /* <Route path="*" element={<PAGE_404 />} /> */
}
