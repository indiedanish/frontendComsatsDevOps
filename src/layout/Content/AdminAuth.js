import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const AdminAuth = () => {
  const { auth } = useAuth();

  const location = useLocation();
  console.log("Admin Auth", auth.Role);

  return auth.Role == "Admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AdminAuth;
