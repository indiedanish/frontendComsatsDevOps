
import React , {useState,useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  

  const location = useLocation();
  console.log("Login Auth", auth.Role);
 

  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    auth?.Role
   
    ? <Navigate to="/sales/sales-list" state={{ from: location }} replace />
    :
    //  auth?.user
    //     ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //:
        <Outlet />
  )
}

export default RequireAuth
