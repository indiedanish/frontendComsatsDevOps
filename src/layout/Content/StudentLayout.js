import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import StudentSidebar from "../Aside/studentSidebar";
const Layout = () => {
    return (
      <>
            <StudentSidebar/>
            <Outlet />
      </>
       
       
    )
}

export default Layout
