import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

//Route component to protect other routes from unauthorized (not logged in) users
const ProtectedRoute = () => {
    const loggedIn = Boolean(localStorage.getItem('loggedIn'));
    const location = useLocation();
    return loggedIn ? <Outlet/> : <Navigate to="/login" state={{ from: location }} />
}

export default ProtectedRoute;