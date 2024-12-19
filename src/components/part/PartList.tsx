import React, {useEffect, useState} from "react";
import {Table, Button, Typography, Space, Alert, Input, Select, Row, Col, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useAxios from "../../utils/api";
import AddOperationModal from "./AddOperationModal";
import OperationList from "./OperationList";
import CreateProductionOrderModal from "./CreateProductionOrderModal";

const {Search} = Input;
const {Option} = Select;

const {Title} = Typography;


interface PartListProps {
    partCreated: boolean;
}

const PartList: React.FC<PartListProps> = ({partCreated}) => {
    console.log("port list rendered")
    const api = useAxios();
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [poError, setPoError] = useState<string | null>(null);
    const [isPoModalVisible, setIsPoModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);
    const [parts, setParts] = useState<Part[]>([]);
    const [partsLoading, setPartsLoading] = useState<boolean>(true);

    const [filters, setFilters] = useState({
        name: "",
        number: "",
        category: "",
        projectCode: "",
    });
    const [filteredParts, setFilteredParts] = useState<Part[]>(parts);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>("/part")
                setParts(response.data);
                setFilteredParts(response.data);
            } catch (error) {
                message.error("Failed to fetch parts. Please try again later.");
            }finally {
                setPartsLoading(false);
            }
        }
        fetchParts();
    }, [api, partCreated]);

    useEffect(() => {
        const fetchTaskCenters = async () => {
            try {
                const response = await api.get<TaskCenter[]>("/task-center");
                const tcNumbers: number[] = [];
                response.data.forEach((tc) => {
                    tcNumbers.push(tc.number);
                })
                setTaskCenters(tcNumbers);
            } catch (error) {
                message.error("Failed to fetch task centers");
            }
        }
        fetchTaskCenters();
    }, [api]);


    const uniqueCategories = Array.from(new Set(parts.map((part) => part.category)));
    const uniqueProjectCodes = Array.from(new Set(parts.map((part) => part.projectCode)));

    const handleSearch = () => {
        const regex = (value: string) => new RegExp(`^${value.replace("*", ".*")}`, "i"); // Match from the start
        const filtered = parts.filter((part) => {
            return (
                (!filters.name || regex(filters.name).test(part.name)) &&
                (!filters.number || regex(filters.number).test(part.number)) &&
                (!filters.category || part.category === filters.category) &&
                (!filters.projectCode || part.projectCode === filters.projectCode)
            );
        });
        setFilteredParts(filtered);
    };


    const resetFilters = () => {
        setFilters({
            name: "",
            number: "",
            category: "",
            projectCode: "",
        });
        setFilteredParts(parts); // Reset to the original list
    };

    useEffect(() => {
        handleSearch(); // Trigger search whenever filters change
    }, [filters]);

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prevFilters) => ({...prevFilters, [field]: value}));
    };


    const handleAddOperation = async (operation: Operation) => {
        if (!selectedPart) return;
        try {
            const response = await api.put(`/part/operation/${selectedPart.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
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
            message.success("Production order successfully created");
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
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col span={6}>
                    <Input
                        placeholder="Search by Number"
                        value={filters.number}
                        onChange={(e) => handleFilterChange("number", e.target.value)}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        placeholder="Search by Name"
                        value={filters.name}
                        onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Filter by Category"
                        value={filters.category}
                        onChange={(value) => handleFilterChange("category", value || "")}
                        allowClear
                        style={{width: "100%"}}
                    >
                        {uniqueCategories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Filter by Project Code"
                        value={filters.projectCode}
                        onChange={(value) => handleFilterChange("projectCode", value || "")}
                        allowClear
                        style={{width: "100%"}}
                    >
                        {uniqueProjectCodes.map((code) => (
                            <Option key={code} value={code}>
                                {code}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Space style={{marginBottom: 16}}>
                <Button type="primary" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </Space>
            <Table
                dataSource={filteredParts}
                columns={columns}
                rowKey="uuid"
                loading={partsLoading}
                expandable={{
                    expandedRowRender: (record) => (
                        <OperationList
                            operations={record.operationList}
                            onAddOperation={() => {
                                setSelectedPart(record);
                                setIsAddOperationModalVisible(true);
                            }}
                            onAddMaterial={() => setSelectedPart(record)}
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