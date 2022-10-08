import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import TeamLeadSidebar from "../../Aside/TeamLeadSidebar";
const Layout = () => {
  return (
    <div className="w-full  h-screen ml-[85px] ">
      <TeamLeadSidebar />
      <Outlet />
    </div>


  )
}

export default Layout
