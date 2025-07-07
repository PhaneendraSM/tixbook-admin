import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/login";
import ForgotPassword from "../pages/forgotpassword";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="" element={<AdminLogin />} />
     
    </Routes>
  );
}

export default AuthRoutes;
