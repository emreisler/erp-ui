import React, { useEffect, useState } from "react";
import {Button, Typography, Table, Modal, Space, Tag, Input, Row, Col, message} from "antd";
import { PlusOutlined, CheckCircleOutlined, ToolOutlined } from "@ant-design/icons";
import useAxios from "../../utils/api";
import TaskCenterForm from "./TaskCenterForm";

const { Title } = Typography;
const { Search } = Input;

const TaskCenters: React.FC = () => {
    const [taskCenters, setTaskCenters] = useState<TaskCenter[]>([]);
    const [filteredTaskCenters, setFilteredTaskCenters] = useState<TaskCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTaskCenter, setSelectedTaskCenter] = useState<TaskCenter | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");

    const [filters, setFilters] = useState({
        name: "",
        number: "",
    });

    const api = useAxios();

    const fetchTaskCenters = async () => {
        try {
            setLoading(true);
            const response = await api.get<TaskCenter[]>("/task-center");
            setTaskCenters(response.data);
            setFilteredTaskCenters(response.data); // Set initial filtered list
        } catch (err) {
            message.error("Failed to fetch task centers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskCenters();
    }, [api]);

    const handleCreateOrUpdate = async (taskCenter: TaskCenter) => {
        try {
            if (modalMode === "create") {
                await api.post("/task-center", taskCenter);
            } else if (modalMode === "update" && selectedTaskCenter) {
                await api.put(`/task-center/${selectedTaskCenter.number}`, taskCenter);
            }
            setIsModalVisible(false);
            message.success("Task center created successfully.");
            fetchTaskCenters(); // Refresh the list todo FIX this
        } catch (err) {
            message.error("Failed to save task center. Please try again.");
        }
    };

    const handleDelete = async (tcNo: string) => {
        try {
            await api.delete(`/task-center/${tcNo}`);
            fetchTaskCenters(); // Refresh the list
        } catch (err) {
            message.error("Failed to delete task center. Please try again.");
        }
    };

    const handleSearch = () => {
        const regex = (value: string) => new RegExp(`^${value.replace("*", ".*")}`, "i");
        const filtered = taskCenters.filter((taskCenter) => {
            return (
                (!filters.name || regex(filters.name).test(taskCenter.name)) &&
                (!filters.number || regex(filters.number).test(taskCenter.number))
            );
        });
        setFilteredTaskCenters(filtered);
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    };

    const resetFilters = () => {
        setFilters({
            name: "",
            number: "",
        });
        setFilteredTaskCenters(taskCenters); // Reset to the original list
    };

    useEffect(() => {
        handleSearch(); // Trigger search whenever filters change
    }, [filters]);

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
            title: "Inspection",
            dataIndex: "isInspection",
            key: "isInspection",
            render: (isInspection: boolean) =>
                isInspection ? (
                    <Tag color="green">Yes</Tag>
                ) : (
                    <Tag color="blue">No</Tag>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: TaskCenter) => (
                <Space>
                    <Button type="link" onClick={() => openUpdateModal(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.uuid)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

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
        <div style={{padding: 24}}>
            <div style={{marginBottom: 16, textAlign: "center"}}>
                <Button type="primary" icon={<PlusOutlined/>} onClick={openCreateModal}>
                    Create New Task Center
                </Button>
            </div>
            <Title level={3}>Task Centers</Title>
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col span={8}>
                    <Search
                        placeholder="Search by Name"
                        value={filters.name}
                        onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                </Col>
                <Col span={8}>
                    <Search
                        placeholder="Search by Number"
                        value={filters.number}
                        onChange={(e) => handleFilterChange("number", e.target.value)}
                    />
                </Col>
                <Col span={8}>
                    <Button type="default" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </Col>
            </Row>

            <Table
                bordered
                dataSource={filteredTaskCenters}
                columns={columns}
                rowKey="uuid"
                loading={loading}
                pagination={{pageSize: 10}}
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