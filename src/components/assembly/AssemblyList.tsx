import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";
import {Button, message, Space, Table, Tabs} from "antd";
import OperationList from "../operation/OperationList";
import {PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "../operation/AddOperationModal";
// import AssemblyDetailsModal from "./AssemblyDetailsModal";
import CreateProductionOrderModal from "../part/CreateProductionOrderModal";
import AttachedMaterialList from "./AttachedMaterialList";
import AttachedPartList from "./AttachedPartList";
import EditOperationModal from "../operation/EditOperationModal";
import AttachPartModal from "./AttachPartModal";
import AddMaterialModal from "../part/AddMaterialModal";
import dayjs from "dayjs";

type AssemblyListProps = {
    assemblyCreated: boolean;
}

const AssemblyList: React.FC<AssemblyListProps> = ({assemblyCreated}) => {

    const [assemblyListLoading, setAssemblyListLoading] = useState<boolean>(true);
    const [assemblies, setAssemblies] = useState<Assembly[]>([])
    const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
    const [addOperation, setAddOperation] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);
    const [isAssemblyModalVisible, setIsAssemblyDetailsModalVisible] = useState<boolean>(false);
    const [isAddPartModalVisible, setIsAddPartModalVisible] = useState<boolean>(false);
    const [isPoModalVisible, setIsPoModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [operations, setOperations] = useState<Operation[]>([])
    const [materials, setMaterials] = useState<AttachedStockModalState[]>([]);
    const [attachedParts, setAttachedParts] = useState<AttachPartModalState[]>([]);
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [isAddMaterialModalVisible, setIsAddMaterialModalVisible] = useState<boolean>(false);
    const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

    const api = useAxios();

    useEffect(() => {
        if (selectedAssembly != null) {
            console.log("fetching operations");
            const fetchOperations = async () => {
                try {
                    const response = await api.get<Operation[]>(`/assembly/operation/${selectedAssembly?.number}`);
                    setOperations(response.data);
                } catch (error) {
                    message.error("Failed to fetch oeprations");
                }
            }
            fetchOperations();
        }

    }, [api, selectedAssembly]);

    useEffect(() => {
        if (selectedAssembly != null) {
            console.log("fetching stocks");
            const fetchStocks = async () => {
                try {
                    const response = await api.get<AttachedStockModalState[]>(`/assembly/stock/${selectedAssembly?.number}`);
                    setMaterials(response.data);
                } catch (error) {
                    message.error("Failed to fetch stocks");
                }
            }
            fetchStocks();
        }
    }, [api, selectedAssembly]);

    useEffect(() => {
        console.log("fetching parts");
        if (selectedAssembly != null) {
            const fetchParts = async () => {
                try {
                    const response = await api.get<AttachPartModalState[]>(`/assembly/part/${selectedAssembly?.number}`);
                    setAttachedParts(response.data);
                } catch (error) {
                    message.error("Failed to fetch parts");
                }
            }
            fetchParts();
        }
    }, [api, selectedAssembly]);

    const handleAddOperation = async (operation: Operation) => {
        console.log("selectedAssembly", selectedAssembly);
        if (!selectedAssembly) return;
        try {
            const response = await api.put(`/assembly/operation/${selectedAssembly.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
                setOperations((prevOperations) => [...prevOperations, operation]);
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
        setAddOperation(false);
        selectedAssembly.operationList.push(operation);
        console.log("operation attached");
    };

    const handleAddMaterial = async (stock: AttachedStockModalState) => {
        if (!selectedAssembly) return;
        try {
            const response = await api.put(`/assembly/stock/${selectedAssembly.number}`, stock);

            if (response.status === 201) {
                message.success("Material successfully added");
                setMaterials((prevMaterials) => [...prevMaterials, stock]);
            }
            console.log("Material added successfully:", stock);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    const handleAddPart = async (attachPart: AttachPartModalState) => {
        if (!selectedAssembly) return;
        try {
            const response = await api.put(`/assembly/part/${selectedAssembly.number}`, attachPart);

            if (response.status === 201) {
                message.success("Material successfully added");
                setAttachedParts((prevAttachedParts) => [...prevAttachedParts, attachPart]);
            }
            console.log("Part added successfully:", attachPart);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
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
        const fetchAssemblies = async () => {
            console.log("AssemblyList fetching");
            setAssemblyListLoading(true);
            try {
                const response = await api.get<Assembly[]>("/assembly")
                setAssemblies(response.data);
            } catch (err) {
                message.error("Could not fetch Assemblies. Please try again later.");
            } finally {
                setAssemblyListLoading(false);
            }
        }
        fetchAssemblies();
    }, [api, assemblyCreated, addOperation]);

    const closeAssemblyDetailsModal = () => {
        setIsAssemblyDetailsModalVisible(false);
        setSelectedAssembly(null);
    }

    const onUpdateOperation = (updatedOperation: Operation) => {
        message.warning("Operation update is not supported yet.");
    }


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
        } catch (error) {

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
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text: string) => dayjs(text).format("YYYY MMM DD HH:mm:ss"), // Format Updated At
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Assembly) => (
                <Space>
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setSelectedAssembly(record);
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
        <div style={{paddingTop: "16px", paddingBottom: "16px"}}>
            <Table
                dataSource={assemblies}
                columns={columns}
                rowKey="uuid"
                loading={assemblyListLoading}
                expandable={{
                    expandedRowRender: (record: Assembly) => (
                        <Tabs defaultActiveKey="operations">
                            <Tabs.TabPane tab="Operations" key="operations">
                                <OperationList operations={record.operationList}/>
                                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                                    setIsAddOperationModalVisible(true);
                                    setSelectedAssembly(record);
                                }}>
                                    Add Operation
                                </Button>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Materials" key="materials">
                                <AttachedMaterialList attachedMaterials={materials}/>
                                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                                    setIsAddMaterialModalVisible(true);
                                    setSelectedAssembly(record);
                                }}>
                                    Attach Material
                                </Button>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Attached Parts" key="attached-part">
                                <AttachedPartList attachedParts={attachedParts}/>
                                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                                    setIsAddPartModalVisible(true);
                                    setSelectedAssembly(record);
                                }}>
                                    Attach Part
                                </Button>
                            </Tabs.TabPane>
                        </Tabs>
                    ),
                }}
                bordered
                pagination={{pageSize: 10}}
            />
            <AddOperationModal visible={isAddOperationModalVisible}
                               onClose={() => setIsAddOperationModalVisible(false)}
                               onAddOperation={handleAddOperation}
                               taskCenters={taskCenters}
            />
            <AddMaterialModal
                visible={isAddMaterialModalVisible}
                onClose={() => setIsAddMaterialModalVisible(false)}
                onAddMaterial={handleAddMaterial}
            />
            <AttachPartModal visible={isAddPartModalVisible} onClose={() => {
                setIsAddPartModalVisible(false);
            }} onAddPart={handleAddPart}/>
            {selectedAssembly && (
                <CreateProductionOrderModal
                    visible={isPoModalVisible}
                    part={selectedAssembly}
                    onClose={() => setIsPoModalVisible(false)}
                    onCreate={handleCreateProductionOrder}
                    loading={loading}
                />
            )}

        </div>

    )
}

export default AssemblyList