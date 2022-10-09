import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import CommitteeSidebar from "../../Aside/CommitteeSidebar";
const Layout = () => {
    return (
      <div className="w-full  h-screen ml-[85px] ">
           
            <Outlet  />
            <CommitteeSidebar  />
            
      </div>
       
       
    )
}

export default Layout


