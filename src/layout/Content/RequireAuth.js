import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireAuth = (props) => {
  const { auth } = useAuth();

  const location = useLocation();

  console.log("PROPS.ROLE: ", props.role, "AUTH: ", auth.Role);


  return (
    auth.Role == props.role
      ? <Outlet />
      : auth.Role == "Admin" ? <Navigate to="/admin/dashboard" replace />
      : auth.Role == "TeamLead" ? <Navigate to="/teamlead/dashboard" replace />
        : auth.Role == "TeamMember" ? <Navigate to="/teammember/dashboard" replace />
     
            : auth.Role == "Committee" ? <Navigate to="/committee/dashboard" replace />
            : auth.Role == "Supervisor" ? <Navigate to="/supervisor/dashboard" replace />
              : <Navigate to="/login" state={{ from: location }} replace />
  );

};

export default RequireAuth;
//