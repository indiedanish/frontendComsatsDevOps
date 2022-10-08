import React from 'react'

import TeamLeadLayout from "./TeamLeadLayout";
import { Route, Routes } from "react-router-dom";
import contents from "../../../routes/contentRoutes";
const TeadLeadRoutes = () => {
  return (
    <Routes>
      <Route element={<TeamLeadLayout />}>
            {contents.teamLead.map((page) => (
              <Route key={page.path} {...page} />
              ))}
          
          </Route> 
    </Routes>
  )
}

export default TeadLeadRoutes
