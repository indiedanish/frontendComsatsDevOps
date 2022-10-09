import React from 'react'

import CommitteeLayout from "./CommitteeLayout";
import { Route, Routes } from "react-router-dom";
import contents from "../../../routes/contentRoutes";
const CommitteeRoutes = () => {
  return (
    <Routes>
      <Route element={<CommitteeLayout />}>
        {contents.committee.map((page) => (
          <Route key={page.path} {...page} />
        ))}

      </Route>
    </Routes>
  )
}

export default CommitteeRoutes
