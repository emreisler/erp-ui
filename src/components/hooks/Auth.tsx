import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
    authToken: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            // Validate the token with the backend
            axios
                .get("http://localhost:8080/auth/validate", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setAuthToken(token);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem("authToken"); // Remove invalid token
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};