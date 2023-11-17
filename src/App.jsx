import React from "react";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "../src/pages/ForgotPage/ForgotScreen";
import ChangePassword from "../src/pages/ChangePasswordPage/ResetPasswordScreen";
import LoginScreen from "./pages/login/LoginScreen";
import DasboardPage from "./pages/dashboard/DashboardPage";
//Define your routes for APP here

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/forgot/password" element={<ForgotPassword />}></Route>
      <Route path="/change/password" element={<ChangePassword />}></Route>
      <Route path="/dashboard" element={<DasboardPage />}></Route>
    </Routes>
  );
};

export default App;
