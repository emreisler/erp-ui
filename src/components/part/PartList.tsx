import React, {useState} from "react";
import {Table, Button, Typography, Space, Alert} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useAxios from "../../utils/api";
import AddOperationModal from "./AddOperationModal";
import OperationList from "./OperationList";
import CreateProductionOrderModal from "./CreateProductionOrderModal";
import {useError} from "../../context/ErrorContext";

const {Title} = Typography;


interface PartListProps {
    parts: Part[];
}

const PartList: React.FC<PartListProps> = ({parts}) => {
    const api = useAxios();
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [poError, setPoError] = useState<string | null>(null);
    const [isPoModalVisible, setIsPoModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {setError} = useError()
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [taskCenters] = useState<number[]>([106,107,108]);

    const handleAddOperation = async (operation: Operation) => {
        if (!selectedPart) return;
        try {
            await api.put(`/part/operation/${selectedPart.number}`, operation);
            console.log("Operation added successfully:", operation);
        } catch (err) {
            setError("Failed to add operation. Please try again.");
        }
    };



    const handleCreateProductionOrder = async (partNumber: string, quantity: number, endDate: string) => {
        setLoading(true);
        try {
            await api.post("/production-orders", {
                partNo: partNumber,
                quantity,
                endDate,
            });
            setIsPoModalVisible(false);
        } catch (err) {
            setPoError("Failed to create production order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Project Code",
            dataIndex: "projectCode",
            key: "projectCode",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Part) => (
                <Space>
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setSelectedPart(record);
                            setIsPoModalVisible(true);
                        }}
                    >
                        Create Production Order
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{padding: 24}}>
            <Title level={3}>Parts List</Title>
            {poError && <Alert message={poError} type="error" showIcon style={{marginBottom: 16}}/>}
            <Table
                dataSource={parts}
                columns={columns}
                rowKey="uuid"
                expandable={{
                    expandedRowRender: (record) => (
                        <OperationList
                            operations={record.operationList}
                            onAddOperation={() => {
                                setSelectedPart(record);
                                setIsAddOperationModalVisible(true);
                            }}
                        />
                    ),
                }}
                bordered
                pagination={{pageSize: 10}}
            />
            <AddOperationModal
                visible={isAddOperationModalVisible}
                onClose={() => setIsAddOperationModalVisible(false)}
                onAddOperation={handleAddOperation}
                taskCenters={taskCenters}
            />
            {selectedPart && (
                <CreateProductionOrderModal
                    visible={isPoModalVisible}
                    part={selectedPart}
                    onClose={() => setIsPoModalVisible(false)}
                    onCreate={handleCreateProductionOrder}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default PartList;