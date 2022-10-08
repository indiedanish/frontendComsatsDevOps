import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import SupervisorSidebar from "../../Aside/SupervisorSidebar";
const SupervisorLayout = () => {
  return (
    <div className="w-full  h-screen ml-[85px] ">
      <SupervisorSidebar />
      <Outlet />
    </div>


  )
}

export default SupervisorLayout
