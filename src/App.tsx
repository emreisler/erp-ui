import React, {useEffect, useState} from "react";
import Selector from "./components/selector/Selector";
import "./App.css"
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPopup from "./components/error/ErrorPopup";
import {ErrorProvider} from "./context/ErrorContext";
import {AuthProvider} from "./components/hooks/Auth";


const App: React.FC = () => {

    const [authToken, setAuthToken] = useState<string | null>(null);
    useEffect(() => {
        // Load token from localStorage on app load
        const token = localStorage.getItem("authToken");
        setAuthToken(token);
    }, []);

    return (
        <AuthProvider>
            <ErrorProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>
                        <Route
                            path="/login"
                            element={<LoginPage setAuthToken={setAuthToken}/>}
                        />
                        <Route
                            path="/app"
                            element={
                                <ProtectedRoute>
                                    <ErrorPopup/>
                                    <Selector/>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </ErrorProvider>
        </AuthProvider>
    );
};

export default App;
