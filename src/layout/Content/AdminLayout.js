import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import AdminSidebar from "../Aside/adminSidebar";
const Layout = () => {
    return (
      <>
            <AdminSidebar/>
            <Outlet />
      </>
       
       
    )
}

export default Layout
