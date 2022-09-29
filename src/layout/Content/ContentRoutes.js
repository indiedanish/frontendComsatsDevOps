import React, { lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import contents from "../../routes/contentRoutes";

const PAGE_404 = lazy(() => import("../../pages/presentation/auth/Page404"));

import { Navigate, Outlet } from "react-router-dom";
import Login from "../../pages/presentation/auth/Login";
import RequireAuth from "./RequireAuth";
import LoginAuth from "./LoginAuth";
import AdminSidebar from "../Aside/adminSidebar";
import AdminLayout from './AdminLayout'

const useAuth = () => {
  //   if(user.user=="admin"){
  // 	console.log("AUTH SUCESS")
  //     return true
  //   } else {
  //     return false
  //   }
};
const ContentRoutes = () => {
  const [user, setuser] = useState("admin");

  console.log(contents);
  const auth = useAuth(); //to authenticate users
  return (
    <Routes>

      <Route element={<LoginAuth />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />} >

          {contents.presentation.map((page) => (
            <Route key={page.path} {...page} />
          ))}

        </Route>

      </Route>

      <Route path="*" element={<PAGE_404 />} />


    </Routes>
  );
  //   ) : (
  //     <Navigate to="/login" />
  //   );
};

export default ContentRoutes;
