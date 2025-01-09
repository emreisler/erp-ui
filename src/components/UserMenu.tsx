import React from "react";
import {Menu, Dropdown, Avatar, Button, Space, message} from "antd";
import {UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/Auth";

const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const {setAuthToken} = useAuth();

    const handleLogout = () => {
        // Clear user-related data (e.g., tokens)
        localStorage.removeItem("authToken");
        setAuthToken(null);
        message.success("Logged out successfully.");
        console.log("Logged out successfully.");
        navigate("/login"); // Redirect to login page
    };

    const menu = (
        <Menu>
            <Menu.Item key="settings" icon={<SettingOutlined/>} onClick={() => navigate("/settings")}>
                Personal Settings
            </Menu.Item>
            <Menu.Item key="notifications" icon={<BellOutlined/>} onClick={() => navigate("/notifications")}>
                Notifications
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{marginBottom: "16px", marginLeft: "10px", textAlign: "right"}}>
            <Dropdown overlay={menu} placement="topRight" trigger={['click']}>
                <Button type="text">
                    <Space>
                        <Avatar icon={<UserOutlined/>}
                                style={{backgroundColor: "#1890ff", color: "#fff"}}
                        />
                    </Space>
                </Button>
            </Dropdown>
        </div>
    );
};

export default UserMenu;