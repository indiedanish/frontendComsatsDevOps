import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import TeamLeadSidebar from "../Aside/TeamLeadSidebar";
const Layout = () => {
    return (
      <>
            <TeamLeadSidebar/>
            <Outlet />
      </>
       
       
    )
}

export default Layout
