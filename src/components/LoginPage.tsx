import React, { useEffect, useState } from "react";
import { LoginUserRequest, LoginUserResponse } from "../types/auth";
import { useNavigate } from "react-router-dom";
import useAuthAxios from "../utils/authApi";
import { useAuth } from "../hooks/Auth";
import {Form, Input, Button, Typography, Alert, Spin, message} from "antd";

const { Title } = Typography;

interface Props {
    setAuthToken: (token: string) => void;
}

const LoginPage: React.FC<Props> = ({ setAuthToken }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const authApi = useAuthAxios();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    await authApi.get("/auth/validate", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    navigate("/app");
                } catch (err) {
                    console.error("Token validation failed, need to login", err);
                    localStorage.removeItem("authToken");
                }
            }
        };
        validateToken();
    }, [navigate]);

    const handleLogin = async (loginUserRequest: LoginUserRequest) => {
        setError("");
        setLoading(true);

        try {
            const response = await authApi.post<LoginUserResponse>("/auth/login", loginUserRequest);
            const { token } = response.data;
            login(token, loginUserRequest.email);
            navigate("/app");
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: "400px", margin: "0 auto", padding: "20px", textAlign: "center"}}>


            {error && <Alert message={error} type="error" showIcon style={{marginBottom: 16}}/>}
            <Form
                layout="vertical"
                onFinish={handleLogin}
                initialValues={{
                    email: "admin@erplite.com",
                    password: "admin123",
                }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: "Please input your email!"},
                        {type: "email", message: "Please enter a valid email!"},
                    ]}
                >
                    <Input placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Please input your password!"}]}
                >
                    <Input.Password placeholder="Enter your password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
            {loading && <Spin tip="Validating login..." style={{display: "block", marginTop: 16}}/>}
        </div>
    );
};

export default LoginPage;