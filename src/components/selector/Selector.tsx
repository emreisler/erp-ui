import React, {useState} from "react";
import {Layout, Menu} from "antd";
import {
    AppstoreOutlined,
    ShopOutlined,
    FileTextOutlined,
    TeamOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import PartPage from "../part/PartPage";
import ProductionOrderList from "../production_order/ProductionOrderList";
import TaskCenterList from "../taskCenter/TaskCenters";
import StockList from "../stock/StockList";
import UserMenu from "../UserMenu";
import AssemblyPage from "../assembly/AssemblyPage";

const {Sider, Content} = Layout;

const Selector: React.FC = () => {
    const [selected, setSelected] = useState<"assembly" | "parts" | "stocks" | "prod-orders" | "task-center" | "dashboard" | "">("parts");

    const [collapsed, setCollapsed] = useState(false);

    const handleCollapsable = () => {
        setCollapsed(!collapsed);
    }

    const renderContent = () => {
        switch (selected) {
            case "assembly":
                return <AssemblyPage/>;
            case "parts":
                return <PartPage/>;
            case "stocks":
                return <StockList/>;
            case "prod-orders":
                return <ProductionOrderList/>;
            case "task-center":
                return <TaskCenterList/>;


            default:
                return null;
        }
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsed={collapsed} onCollapse={handleCollapsable} collapsible>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selected]}
                    onClick={(e) => setSelected(e.key as "assembly" | "parts" | "stocks" | "prod-orders" | "task-center" | "dashboard")}
                >
                    <Menu.Item key="assembly" icon={<ShopOutlined/>}>
                        Assembly
                    </Menu.Item>
                    <Menu.Item key="parts" icon={<AppstoreOutlined/>}>
                        Parts
                    </Menu.Item>
                    <Menu.Item key="prod-orders" icon={<FileTextOutlined/>}>
                        Production Orders
                    </Menu.Item>
                    <Menu.Item key="stocks" icon={<ShopOutlined/>}>
                        Stocks
                    </Menu.Item>
                    <Menu.Item key="task-center" icon={<TeamOutlined/>}>
                        Task Centers
                    </Menu.Item>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined/>}>
                        Dashboards
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{padding: "24px"}}>
                    <UserMenu/>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Selector;