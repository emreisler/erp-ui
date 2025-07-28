import React, {useEffect, useState} from "react";
import {Table, Button, Typography, Space, Alert, Input, Select, Row, Col, message, Tabs} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useAxios from "../../utils/api";
import OperationList from "../operation/OperationList";
import CreateProductionOrderModal from "./CreateProductionOrderModal";
import dayjs from "dayjs";
import AttachedMaterialList from "../assembly/AttachedMaterialList";
import AttachedPartList from "../assembly/AttachedPartList";
import AddOperationModal from "../operation/AddOperationModal";
import AddMaterialModal from "./AddMaterialModal";
import EditOperationModal from "../operation/EditOperationModal";
import assemblyList from "../assembly/AssemblyList";

const {Option} = Select;

const {Title} = Typography;


interface PartListProps {
    partCreated: boolean;
}

const PartList: React.FC<PartListProps> = ({partCreated}) => {
    console.log("port list rendered")
    const api = useAxios();
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);

    const [isAddMaterialModalVisible, setIsAddMaterialModalVisible] = useState<boolean>(false);
    const [operations, setOperations] = useState<Operation[]>([])
    const [materials, setMaterials] = useState<AttachedStockModalState[]>([]);
    const [poError, setPoError] = useState<string | null>(null);
    const [isPoModalVisible, setIsPoModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [parts, setParts] = useState<Part[]>([]);
    const [partsLoading, setPartsLoading] = useState<boolean>(true);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);

    const [isPartDetailsModalVisible, setIsPartDetailsModalVisible] = useState<boolean>(false);


    const closePartDetailsModal = () => {
        setIsPartDetailsModalVisible(false);
        setSelectedPart(null);
    };

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

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>("/part")
                setParts(response.data);
            } catch (error) {
                message.error("Failed to fetch parts. Please try again later.");
            } finally {
                setPartsLoading(false);
            }
        }
        fetchParts();
    }, [api, partCreated]);


    const handleCreateProductionOrder = async (partNumber: string, quantity: number, endDate: string) => {
        setLoading(true);
        try {
            await api.post("/production-orders/part", {
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

    const handleAddOperation = async (operation: Operation) => {
        if (!selectedPart) return;
        try {
            const response = await api.put(`/part/operation/${selectedPart?.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
                setOperations(prevOperations => [...prevOperations, operation]);
                selectedPart.operationList.push(operation);
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
            console.log("err:", err)
        }
    };



    function handleDelete(record: Operation) {

    }

    const handleAddMaterial = async (stock: Stock) => {
        if (!selectedPart) return;
        try {
            const response = await api.put<Part>(`/part/stock/${selectedPart?.number}`, stock);

            if (response.status === 201) {
                message.success("Material successfully added");
                setMaterials(prevMaterials => [...prevMaterials, stock]);
                selectedPart.stocksList.push(stock);
            }
            console.log("Material added successfully:", stock);

        } catch (err) {
            message.error("Failed to add material. Please try again.");
            console.log("err:", err)
        }
    };

    const onUpdateOperation = (updatedOperation: Operation) => {
        message.warning("Operation update is not supported yet.");
    }

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
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text: string) => dayjs(text).format("YYYY MMM DD HH:mm:ss"), // Format Updated At
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
            {poError && <Alert message={poError} type="error" showIcon style={{marginBottom: 16}}/>}
            <Table
                dataSource={parts}
                columns={columns}
                rowKey="uuid"
                loading={partsLoading}
                expandable={{
                    expandedRowRender: (record: Part) => (
                        <Tabs defaultActiveKey="operations">
                            <Tabs.TabPane tab="Operations" key="operations">
                                <OperationList operations={record.operationList}/>
                                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                                    setIsAddOperationModalVisible(true);
                                    setSelectedPart(record);
                                }}>
                                    Add Operation
                                </Button>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Materials" key="materials">
                                <AttachedMaterialList attachedMaterials={record.stocksList}/>
                                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                                    setIsAddMaterialModalVisible(true);
                                    setSelectedPart(record);
                                }}>
                                    Attach Material
                                </Button>
                            </Tabs.TabPane>
                        </Tabs>
                    ),
                }}
                rowClassName={() => "hover-row"}
                bordered
                pagination={{pageSize: 10}}
            />
            <AddOperationModal
                visible={isAddOperationModalVisible}
                onClose={() => setIsAddOperationModalVisible(false)}
                onAddOperation={handleAddOperation}
                taskCenters={taskCenters}
            />

            <AddMaterialModal
                visible={isAddMaterialModalVisible}
                onClose={() => setIsAddMaterialModalVisible(false)}
                onAddMaterial={handleAddMaterial}
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