import React, {useEffect, useState} from "react";
import {LoginUserRequest, LoginUserResponse} from "../types/auth";
import {useNavigate} from "react-router-dom";
import useAuthAxios from "../utils/authApi";
import {useAuth} from "./hooks/Auth";

interface Props {
    setAuthToken: (token: string) => void;
}

const LoginPage: React.FC<Props> = ({setAuthToken}) => {
    const [email, setEmail] = useState<string>("admin@example.com");
    const [password, setPassword] = useState<string>("admin123");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    const api = useAuthAxios();

    // Validate token in localStorage on component mount
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("authToken");
            console.log("validateToken", token);
            if (token) {
                try {
                    // Call the /validate endpoint to check token validity
                    api.get("/auth/validate", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    // If the token is valid, navigate to the dashboard
                    navigate("/app");
                    console.log("token validated");
                } catch (error) {
                    console.error("Token validation failed:", error);
                    localStorage.removeItem("authToken"); // Remove invalid token
                }
            }
        };
        validateToken();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const requestBody: LoginUserRequest = {
            email,
            password,
        };

        try {
            const response = await api.post<LoginUserResponse>("/auth/login", requestBody);
            const {token} = response.data;
            console.log(token);
            login(response.data.token);
            // Redirect to dashboard
            navigate("/app");
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div style={{maxWidth: "400px", margin: "0 auto", padding: "20px"}}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
