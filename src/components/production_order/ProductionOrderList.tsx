import React, {useState, useEffect} from "react";
import {Table, Typography, Alert, Space, Button, Modal, List, Card, message} from "antd";
import useAxios from "../../utils/api";
import {EyeOutlined,CheckCircleTwoTone} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import OperationCard from "./OperationCard";
import StampButton from "./StampButton";

const {Title} = Typography;

function ArrowRightOutlined(props: { style: { color: string; fontSize: string } }) {
    return null;
}

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
                stepNumber: operation.stepNumber,
                userEmail: operation.userEmail || "admin@erplite.com",
            };

            const response = await api.put("/production-orders/stamp", stamp);

            if (response.status === 201) {
                message.success("Operation successfully added");
                navigate("/login")
            } else if (response.status >= 400) {
                message.error("Operation failed");
                navigate("/login")
            }

            setOperations((prevOperations) =>
                prevOperations.map((op) =>
                    op.stepNumber === operation.stepNumber ? {...op, isStamped: true} : op
                )
            );

            message.success(`Operation ${operation.stepNumber} stamped successfully.`);
        } catch (error) {
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
    }, [api, stamps]);

    useEffect(() => {
        if (selectedOrder) {
            fetchAllOperations(selectedOrder.code, selectedOrder.partNumber);
        }
    }, [selectedOrder]);

    useEffect(() => {
        setOperations((prevOperations) =>
            prevOperations.map((operation) => {
                const matchingStamp = stamps.find((stamp) => stamp.stepNumber === operation.stepNumber);
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
            const response = await api.get(`/production-orders/stamp/${orderCode}`);
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
            const response = await api.get(`/part/operation/${partNo}`);
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
        {title: "Order Code", dataIndex: "code", key: "code"},
        {title: "Part Number", dataIndex: "partNumber", key: "partNumber"},
        {title: "Assembly Number", dataIndex: "assemblyNumber", key: "assemblyNumber"},
        {title: "Step", dataIndex: "currentStep", key: "currentStep"},
        {title: "Task Center", dataIndex: "currentTaskCenter", key: "currentTaskCenter"},
        {title: "Quantity", dataIndex: "quantity", key: "quantity"},
        {title: "Status", dataIndex: "status", key: "status"},
        {title: "Required Date", dataIndex: "endDate", key: "endDate", render: (text: string) => dayjs(text).format("YYYY MMM DD ")},
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: ProductionOrder) => (
                <Button
                    icon={<EyeOutlined/>}
                    onClick={() => showModal(record)}
                    type="default"
                />
            ),
        },
    ];

    return (
        <div style={{padding: 24}}>
            <Title level={3}>Production Orders</Title>
            {error && <Alert message={error} type="error" showIcon style={{marginBottom: 16}}/>}
            <Table
                dataSource={productionOrders}
                columns={columns}
                rowKey="orderId"
                loading={loading}
                bordered
                pagination={{pageSize: 10}}
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
                        grid={{gutter: 16, column: 1}}
                        dataSource={operations}
                        renderItem={(operation : Operation, index: number) => (
                            <List.Item
                                style={{
                                    // backgroundColor: operation.isStamped ? "limegreen" : "deepskyblue", // Light green background
                                    padding: "20px",
                                    borderRadius: "5px",
                                    display: "flex",
                                    border: "1px solid #ecf0f1",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {/* Compact horizontal layout */}
                                <OperationCard operation={operation} />
                                {/* Arrow Between Cards */}
                                {/* Center: Arrow */}
                                {index < operations.length - 1 && (
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <ArrowRightOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                                    </div>
                                )}
                                {/* Actions */}
                                <div>
                                    <StampButton isStamped={operation.isStamped} onStampClick={() => handleStampOperation(operation, selectedOrder)} onViewDetails={() =>
                                        message.info(
                                            `Details: ${operation.description || "No description available."}`
                                        )}/>

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