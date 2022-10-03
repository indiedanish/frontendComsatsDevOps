import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const LoginAuth = () => {
  const { auth } = useAuth();

  const location = useLocation();

  return auth?.Role ? (
    auth.Role == "Admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) :
    auth.Role == "TeamLead" ? (
      <Navigate to="/teamlead/dashboard" replace />
    ) : auth.Role == "TeamMember" ? (
      <Navigate to="/teammember/dashboard" replace />
    ) : auth.Role == "Supervisor" ? (
      <Navigate to="/supervisor/dashboard" replace />
    ) : auth.Role == "Committee" ? (
      <Navigate to="/committee/dashboard" replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  ) : (
    <Outlet />
  );
};

export default LoginAuth;
