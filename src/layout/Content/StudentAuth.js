
import React , {useState,useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const StudentAuth = () => {
  const { auth } = useAuth();
  

  const location = useLocation();
  console.log("I AM A GOOD BOY", auth.Role);

  return (

    //auth.Role == "Student"
    true
    ? <Outlet />
    :
         <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default StudentAuth
