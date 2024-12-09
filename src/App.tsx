import React, {useEffect, useState} from "react";
import Selector from "./components/selector/Selector";
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import {AuthProvider} from "./hooks/Auth";
import SettingsPage from "./components/settings/SettingsPage";
import NotificationsPage from "./components/notifications/NotificationsPage";


const App: React.FC = () => {

    const [authToken, setAuthToken] = useState<string | null>(null);
    useEffect(() => {
        // Load token from localStorage on app load
        const token = localStorage.getItem("authToken");
        setAuthToken(token);
    }, []);

    return (
        <AuthProvider>

            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route
                        path="/login"
                        element={<LoginPage setAuthToken={setAuthToken}/>}
                    />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <SettingsPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <NotificationsPage/>
                        </ProtectedRoute>
                    }/>
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <Selector/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
