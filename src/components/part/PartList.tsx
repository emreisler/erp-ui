import React, { useState } from "react";
import { Table, Button, Typography, Space, Alert, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useAxios from "../../utils/api";
import AddOperationModal from "./AddOperationModal";
import OperationList from "./OperationList";

const { Title, Text } = Typography;


interface PartListProps {
    parts: Part[];
}

const PartList: React.FC<PartListProps> = ({ parts }) => {
    const api = useAxios();
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [poError, setPoError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [taskCenters] = useState<number[]>([106,107,108]); //todo fetch task centers from backend

    const handleAddOperation = async (operation: Operation) => {
        if (!selectedPart) return;

        setLoading(true);
        try {
            const response = await api.put(`part/operation/${selectedPart.number}`, operation);
            console.log("Operation added:", response.data);
            setIsModalVisible(false);
            form.resetFields();
        } catch (err) {
            setPoError("Failed to add operation. Please try again.");
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
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Parts List</Title>
            {poError && <Alert message={poError} type="error" showIcon style={{ marginBottom: 16 }} />}
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
                                setIsModalVisible(true);
                            }}
                        />
                    ),
                }}
                bordered
                pagination={{ pageSize: 10 }}
            />
            <AddOperationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAddOperation={handleAddOperation}
                taskCenters={taskCenters}
            />
        </div>
    );
};

export default PartList;