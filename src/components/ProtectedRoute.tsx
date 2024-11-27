import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
    token: string | null;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ token, children }) => {
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
