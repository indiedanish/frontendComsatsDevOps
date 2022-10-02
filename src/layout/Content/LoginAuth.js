
import React , {useState,useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  

  const location = useLocation();

 

  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    auth?.Role
   
    ? <Navigate to="/dashboard" state={{ from: location }} replace />
    :
    //  auth?.user
    //     ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //:
        <Outlet />
  )
}

export default RequireAuth
