import React, { useEffect, useState } from "react";
import { Button, Typography, List, Modal, Space, Alert,Tag } from "antd"
import { PlusOutlined, CheckCircleOutlined, ToolOutlined } from "@ant-design/icons";
import useAxios from "../../utils/api";
import TaskCenterForm from "./TaskCenterForm";
import {useError} from "../../context/ErrorContext";

const { Title } = Typography;


const TaskCenters: React.FC = () => {
    const [taskCenters, setTaskCenters] = useState<TaskCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { error, setError } = useError();
    const [selectedTaskCenter, setSelectedTaskCenter] = useState<TaskCenter | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");

    const api = useAxios();

    const fetchTaskCenters = async () => {
        try {
            setLoading(true);
            const response = await api.get<TaskCenter[]>("/task-center");
            setTaskCenters(response.data);
        } catch (err) {
            setError("Failed to fetch task centers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskCenters();
    }, []);

    const handleCreateOrUpdate = async (taskCenter: TaskCenter) => {
        try {
            if (modalMode === "create") {
                await api.post("/task-center", taskCenter);
            } else if (modalMode === "update" && selectedTaskCenter) {
                await api.put(`/task-center/${selectedTaskCenter.number}`, taskCenter);
            }
            setIsModalVisible(false);
            fetchTaskCenters(); // Refresh the list
        } catch (err) {
            setError("Failed to save task center. Please try again.");
        }
    };

    const handleDelete = async (tcNo: string) => {
        try {
            await api.delete(`/task-center/${tcNo}`);
            fetchTaskCenters(); // Refresh the list
        } catch (err) {
            setError("Failed to delete task center. Please try again.");
        }
    };

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedTaskCenter(null);
        setIsModalVisible(true);
    };

    const openUpdateModal = (taskCenter: TaskCenter) => {
        setModalMode("update");
        setSelectedTaskCenter(taskCenter);
        setIsModalVisible(true);
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Task Centers</Title>
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Create New Task Center
                </Button>
            </div>
            <List
                bordered
                dataSource={taskCenters}
                loading={loading}
                renderItem={(taskCenter) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                onClick={() => openUpdateModal(taskCenter)}
                                key="edit"
                            >
                                Edit
                            </Button>,
                            <Button
                                type="link"
                                danger
                                onClick={() => handleDelete(taskCenter.uuid)}
                                key="delete"
                            >
                                Delete
                            </Button>,
                        ]}
                        style={{
                            backgroundColor: taskCenter.isInspection
                                ? "#f6ffed" // Light green for inspection task centers
                                : "#ffffff", // White for regular task centers
                        }}
                    >
                        <List.Item.Meta
                            avatar={
                                taskCenter.isInspection ? (
                                    <CheckCircleOutlined
                                        style={{ fontSize: "24px", color: "#52c41a" }}
                                    />
                                ) : (
                                    <ToolOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                                )
                            }
                            title={
                                <>
                                    {taskCenter.number} - {taskCenter.name}
                                    {taskCenter.isInspection && (
                                        <Tag color="green" style={{ marginLeft: "8px" }}>
                                            Inspection
                                        </Tag>
                                    )}
                                </>
                            }
                            description={`Inspection: ${
                                taskCenter.isInspection ? "Yes" : "No"
                            }`}
                        />
                    </List.Item>
                )}
            />
            <Modal
                title={modalMode === "create" ? "Create Task Center" : "Update Task Center"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <TaskCenterForm
                    onSubmit={handleCreateOrUpdate}
                    initialValues={selectedTaskCenter}
                    mode={modalMode}
                />
            </Modal>
        </div>
    );
};

export default TaskCenters;