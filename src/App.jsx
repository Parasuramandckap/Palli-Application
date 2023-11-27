import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { LOGIN,APPLICATIONS, DASHBOARD,FORGOTPASSWORD,CHANGEPASSWORD,TASK } from "./routes/routes.jsx";
//Define your routes for APP here
import LoginPage from "./pages/login/LoginPage.jsx";
import ChangePassword from "./pages/changePasswordPage/ResetPasswordPage";
import ForgotPassword from "./pages/forgotPage/ForgotPage";
import Applicantions from "./pages/applications/Applications.jsx";
import DashBoard from "./pages/dashBoard/DashBoard.jsx";
import TaskModule from "./pages/taskModule/TaskModule.jsx";
//Private Routes will be wrapped in below component
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN} element={<LoginPage />} />
          <Route path={FORGOTPASSWORD} element={<ForgotPassword />} />
          <Route path={CHANGEPASSWORD} element={<ChangePassword />} />
          <Route path={DASHBOARD} element={<DashBoard />} />
          {/* Private Route, can't access without token */}
          <Route path={APPLICATIONS} element={<PrivateRoute />}>
            <Route path={APPLICATIONS} element={<Applicantions />} />
          </Route>
        
          <Route path={TASK} element={<PrivateRoute />}>
             <Route path={TASK} element={<TaskModule />} />
          </Route>
         
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
