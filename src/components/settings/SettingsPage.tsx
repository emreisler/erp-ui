import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Switch, message } from "antd";
import useAxios from "../../utils/api";

const { Title } = Typography;

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState({
        id: "",
        email: "",
        name: "",
        password: "",
        isAdmin: false,
    });
    const [loading, setLoading] = useState(false);
    const api = useAxios();

    const fetchUserDetails = async () => {
        try {
            const response = await api.get("/user/me");
            setUser(response.data);
        } catch (err) {
            message.error("Failed to fetch user details.");
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            setLoading(true);
            await api.put("/user/update", values);
            message.success("Profile updated successfully.");
        } catch (err) {
            message.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Personal Settings</Title>
            <Form
                layout="vertical"
                initialValues={user}
                onFinish={handleUpdate}
                style={{ maxWidth: 600, margin: "0 auto" }}
            >
                <Form.Item label="Email" name="email">
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input.Password placeholder="Enter new password if you want to change it." />
                </Form.Item>
                <Form.Item label="Admin Access" name="isAdmin" valuePropName="checked">
                    <Switch disabled />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SettingsPage;