import React from "react";
import ErrorPage from "../pages/ErrorPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import RegisterPage from "../pages/RegisterPage";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import ShowGroupPage from "../pages/ShowGroupPage";
import BinPage from "../pages/BinPage";
import SettingsPage from "../pages/SettingsPage";
import NotificationsPage from "../pages/NotificationsPage";
import ShowFilePage from "../pages/ShowFilePage";
import GroupsPage from "../pages/GroupsPage";
import FilesPage from "../pages/FilesPage";

const Root = ()=>{

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute Element={HomePage} />} >
                <Route index element={<Navigate replace to="/files/root" />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="groups" element={<GroupsPage />} />
                <Route path="bin" element={<BinPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="group/:id" element={<ShowGroupPage />} />
                <Route path="file/:group_id/:file_id" element={<ShowFilePage />} />
                <Route path="files" element={<FilesPage />}/>
                <Route path="files/:group/root/*" element={<FilesPage />} />
                <Route path="files/root/*" element={<FilesPage />} />
            </Route>
            
            <Route path="login" element={<ProtectedRoute guest Element={RegisterPage} />} />
            <Route path="register" element={<ProtectedRoute guest Element={RegisterPage} />} />
            <Route path="verify" element={<ProtectedRoute guest Element={VerifyEmailPage} />} />
            <Route path="error/:code/:text" element={<ErrorPage />} />
            <Route path="*" element={<Navigate replace to="/error/404/PAGE NOT FOUND" />} />
        </Routes>
    );
}


export default Root;