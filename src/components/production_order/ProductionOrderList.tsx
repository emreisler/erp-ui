import React, { useState, useEffect } from "react";
import { Table, Typography, Alert, Space, Button } from "antd";
import useAxios from "../../utils/api";
import ProductionOrderDetailsDrawer from "./ProductionOrderDetailsDrawer";

const { Title } = Typography;

const ProductionOrderList: React.FC = () => {
    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
    const api = useAxios();

    useEffect(() => {
        const fetchProductionOrders = async () => {
            try {
                const response = await api.get("/production-orders");
                setProductionOrders(response.data);
            } catch (err) {
                setError("Failed to load production orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductionOrders();
    }, [api]);

    const showDetailsDrawer = (order: ProductionOrder) => {
        setSelectedOrder(order);
        setIsDrawerVisible(true);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
        setSelectedOrder(null);
    };

    const columns = [
        {
            title: "Order Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Part Number",
            dataIndex: "partNumber",
            key: "partNumber",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: ProductionOrder) => (
                <Space>
                    <Button onClick={() => showDetailsDrawer(record)}>View Details</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Production Orders</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Table
                dataSource={productionOrders}
                columns={columns}
                rowKey="orderId"
                loading={loading}
                bordered
                pagination={{ pageSize: 10 }}
            />
            <ProductionOrderDetailsDrawer
                visible={isDrawerVisible}
                productionOrder={selectedOrder}
                onClose={closeDrawer}
            />
        </div>
    );
};

export default ProductionOrderList;