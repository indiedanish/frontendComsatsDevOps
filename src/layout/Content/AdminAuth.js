import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const AdminAuth = (props) => {
  const { auth } = useAuth();

  const location = useLocation();

  return (
    auth.Role == props.role
      ? <Outlet />
      : auth?.Role
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  );

};

export default AdminAuth;
