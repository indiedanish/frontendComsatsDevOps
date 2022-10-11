import React from 'react'

import TeamMemberLayout from "./TeamMemberLayout";
import { Route, Routes } from "react-router-dom";
import contents from "../../../routes/contentRoutes";
const TeadLeadRoutes = () => {
  return (
    <Routes>
      <Route element={<TeamMemberLayout />}>
            {contents.teammember.map((page) => (
              <Route key={page.path} {...page} />
              ))}
          
          </Route> 
    </Routes>
  )
}

export default TeadLeadRoutes
