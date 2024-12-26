import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";
import {Button, message, Space, Table,Tabs} from "antd";
import OperationList from "../operation/OperationList";
import {PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "../operation/AddOperationModal";
import PartDetailsModal from "../part/PartDetails";
// import AssemblyDetailsModal from "./AssemblyDetailsModal";
import CreateProductionOrderModal from "../part/CreateProductionOrderModal";
import AttachedMaterialList from "./AttachedMaterialList";
import AttachedPartList from "./AttachedPartList";

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
    const [isPoModalVisible, setIsPoModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [operations, setOperations] = useState<Operation[]>([])
    const [materials, setMaterials] = useState<AttachedStockModalState[]>([]);
    const [attachedParts, setAttachedParts] = useState<AttachPartModalState[]>([]);

    const api = useAxios();

    useEffect(() => {
        if (selectedAssembly != null){
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

    }, [api]);

    useEffect(() => {
        if (selectedAssembly != null){
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
    }, [api]);

    useEffect(() => {
        console.log("fetching parts");
        if (selectedAssembly != null){
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
    }, [api]);

    const handleAddOperation = async (operation: Operation) => {
        if (!selectedAssembly) return;
        try {
            const response = await api.put(`/assembly/operation/${selectedAssembly.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
        setAddOperation(false);
        console.log("operation attached");
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
        }catch (error){

        }finally {
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
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Assembly) => (
                <Space>
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            //todo action
                        }}
                    >
                        Create Production Order
                    </Button>
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setIsAssemblyDetailsModalVisible(true);
                            setSelectedAssembly(record);
                        }}
                    >
                        Details
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
                                <OperationList operations={record.operationList} onAddOperation={handleAddOperation} onUpdateOperation={onUpdateOperation} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Materials" key="materials">
                                <AttachedMaterialList attachedMaterials={materials}/>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Attached Part" key="attached-part">
                                <AttachedPartList selectedAssembly={record} />
                            </Tabs.TabPane>
                        </Tabs>
                    ),
                }}
                bordered
                pagination={{pageSize: 10}}
            />
            <AddOperationModal
                visible={addOperation}
                onClose={() => setAddOperation(false)}
                onAddOperation={handleAddOperation}
                taskCenters={taskCenters}
            />
            {/*{selectedAssembly && <AssemblyDetailsModal*/}
            {/*    visible={isAssemblyModalVisible}*/}
            {/*    onClose={closeAssemblyDetailsModal}*/}
            {/*    assembly={selectedAssembly}*/}
            {/*/>}*/}
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