import React, {createContext, useContext, useEffect, useState} from "react";
import useAuthAxios from "../utils/authApi";

interface AuthContextType {
    authToken: string | null;
    setAuthToken: (token: string | null) => void;
    userEmail: string | null;
    isAuthenticated: boolean;
    login: (token: string, userEmail: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const authApi = useAuthAxios();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            // Validate the token with the backend
            authApi
                .get("auth/validate", {
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

    const login = (token: string, userEmail: string) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", userEmail);
        setAuthToken(token);
        setUserEmail(userEmail);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{authToken, setAuthToken, userEmail, isAuthenticated, login, logout}}>
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