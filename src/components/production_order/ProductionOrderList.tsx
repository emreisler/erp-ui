import React, { useState, useEffect } from "react";
import { Table, Typography, Alert, Space, Button, Modal, List, Card, message } from "antd";
import useAxios from "../../utils/api";
import { EyeOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

const ProductionOrderList: React.FC = () => {
    console.log("ProductionOrderList rendered");
    const navigate = useNavigate();
    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [stamps, setStamps] = useState<Stamp[]>([]);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [stampsLoading, setStampsLoading] = useState<boolean>(false);
    const [operationsLoading, setOperationsLoading] = useState<boolean>(false);
    const api = useAxios();

    const handleStampOperation = async (operation: Operation, selectedOrder: ProductionOrder | null) => {
        if (!selectedOrder) {
            message.error("Please select a product order");
            return;
        }

        try {
            const stamp: Stamp = {
                productionOrderCode: selectedOrder.code,
                stepNumber: operation.sepNumber,
                userEmail: operation.userEmail || "example@example.com",
            };

            const response = await api.put("/stamp", stamp);

            if (response.status === 201) {
                message.success("Operation successfully added");
                navigate("/login")
            }else if (response.status >= 400){
                message.error("Operation failed");
                navigate("/login")
            }

            setOperations((prevOperations) =>
                prevOperations.map((op) =>
                    op.sepNumber === operation.sepNumber ? { ...op, isStamped: true } : op
                )
            );

            message.success(`Operation ${operation.sepNumber} stamped successfully.`);
        } catch (error) {
            console.error("Error stamping operation:", error);
            message.error("Failed to stamp the operation. Please try again.");
        }
    };

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

    useEffect(() => {
        if (selectedOrder) {
            fetchAllOperations(selectedOrder.code, selectedOrder.partNumber);
        }
    }, [selectedOrder]);

    useEffect(() => {
        setOperations((prevOperations) =>
            prevOperations.map((operation) => {
                const matchingStamp = stamps.find((stamp) => stamp.stepNumber === operation.sepNumber);
                return {
                    ...operation,
                    isStamped: Boolean(matchingStamp),
                    userEmail: matchingStamp ? matchingStamp.userEmail : operation.userEmail, // Update userEmail if matched
                };
            })
        );
    }, [stamps]);

    const fetchAllOperations = async (orderCode: string, partNo: string) => {
        await Promise.all([fetchOperations(partNo), fetchStampedOperations(orderCode)]);
    };

    const fetchStampedOperations = async (orderCode: string) => {
        setStampsLoading(true);
        try {
            const response = await api.get(`/stamp/${orderCode}`);
            setStamps(response.data);
        } catch (err) {
            setError("Failed to load stamps for the selected production order.");
        } finally {
            setStampsLoading(false);
        }
    };

    const fetchOperations = async (partNo: string) => {
        setOperationsLoading(true);
        try {
            const response = await api.get(`/operations/part-no/${partNo}`);
            setOperations(response.data);
        } catch (err) {
            setError("Failed to fetch operations. Please try again.");
        } finally {
            setOperationsLoading(false);
        }
    };

    const showModal = (order: ProductionOrder) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
        setStamps([]);
        setOperations([]);
    };

    const columns = [
        { title: "Order Code", dataIndex: "code", key: "code" },
        { title: "Part Number", dataIndex: "partNumber", key: "partNumber" },
        { title: "Step", dataIndex: "currentStep", key: "currentStep" },
        { title: "Task Center", dataIndex: "currentTaskCenter", key: "currentTaskCenter" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Status", dataIndex: "status", key: "status" },
        {title: "End Date", dataIndex: "endDate", key: "endDate" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: ProductionOrder) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => showModal(record)}
                    type="default"
                />
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

            <Modal
                title={`Part no : ${selectedOrder?.partNumber} , Order no :  ${selectedOrder?.code}`}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
                width={800}
            >
                {stampsLoading ? (
                    <p>Loading stamps...</p>
                ) : (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={operations}
                        renderItem={(operation) => (
                            <List.Item
                                style={{
                                    backgroundColor: operation.isStamped ? "#d9f7be" : "transparent", // Light green background
                                    padding: "10px",
                                    borderRadius: "5px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {/* Compact horizontal layout */}
                                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                    <span><strong>Step:</strong> {operation.sepNumber}</span>
                                    <span><strong>User:</strong> {operation.userEmail || "N/A"}</span>
                                    <span><strong>Order Code:</strong> {operation.taskCenterNo}</span>
                                    <span><strong>Description:</strong> {operation.description || "No description available"}</span>
                                </div>
                                {/* Actions */}
                                <div>
                                    {!operation.isStamped && (
                                        <Button
                                            type="primary"
                                            onClick={() => handleStampOperation(operation, selectedOrder)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Stamp
                                        </Button>
                                    )}
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            message.info(
                                                `Details: ${operation.description || "No description available."}`
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductionOrderList;