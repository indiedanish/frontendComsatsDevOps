import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import AdminSidebar from "../../Aside/adminSidebar";
const Layout = () => {
    return (
      <div className="w-full  h-screen ml-[85px] ">
           
            <Outlet  />
            <AdminSidebar  />
            
      </div>
       
       
    )
}

export default Layout


