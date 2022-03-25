import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, AuthStatus } from "../context/AuthContext";

const ProtectedRoute = ({ Element, guest, ...rest })=>{
    const [auth] = useAuth(); 
    
    if (guest && auth.status === AuthStatus.AUTHENTICATED){
        return <Navigate replace to="/" />;
    } else if (auth.status === AuthStatus.UNVERIFIED){
        return <Navigate replace to="/verify" />;
    } else if (!guest && auth.status !== AuthStatus.AUTHENTICATED){
        return <Navigate replace to="/login" />;
    }

    return <Element {...rest} />;
}

export default ProtectedRoute;