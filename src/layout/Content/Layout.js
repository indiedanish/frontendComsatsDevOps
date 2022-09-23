import { Outlet } from "react-router-dom"
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
const Layout = () => {
    return (
        <main className="App">
            <div>Not Logged in</div>
            <Outlet />
            <div>Not Logged in</div>
        </main>
    )
}

export default Layout
