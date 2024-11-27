import React, {useState} from "react";
import {LoginUserRequest, LoginUserResponse} from "../types/auth";
import {useNavigate} from "react-router-dom";
import useAxios from "../utils/api";

interface Props {
    setAuthToken: (token: string) => void;
}

const LoginPage: React.FC<Props> = ({setAuthToken}) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const api = useAxios();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const requestBody: LoginUserRequest = {
            username,
            password,
        };

        try {
            const response = await api.post<LoginUserResponse>("/login", requestBody);
            const {token} = response.data;

            // Save token in localStorage and pass it to parent state
            localStorage.setItem("authToken", token);
            setAuthToken(token);

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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
