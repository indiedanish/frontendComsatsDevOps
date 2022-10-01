
import React , {useState,useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const StudentAuth = () => {
  const { auth } = useAuth();
  

  const location = useLocation();
  console.log("Studeent auth", auth.Role);


  return (

   auth.Role == "TeamMember"
  
    ? <Outlet />
    :
         <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default StudentAuth
