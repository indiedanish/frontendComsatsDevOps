import React from 'react'

import SupervisorLayout from "./SupervisorLayout";
import { Route, Routes } from "react-router-dom";
import contents from "../../../routes/contentRoutes";
const TeadLeadRoutes = () => {
  return (
    <Routes>
      <Route element={<SupervisorLayout />}>
            {contents.supervisor.map((page) => (
              <Route key={page.path} {...page} />
              ))}
          
          </Route> 
    </Routes>
  )
}

export default TeadLeadRoutes
