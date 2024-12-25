import React, {useEffect, useState} from "react";
import {Modal, List, Button, Typography, Space, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import OperationList from "../part/OperationList"
import useAxios from "../../utils/api";
import AddOperationModal from "../part/AddOperationModal";
import AddMaterialModal from "../part/AddMaterialModal";

const {Title} = Typography;

interface AssemblyDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    assembly: Assembly;
}

const AssemblyDetailsModal: React.FC<AssemblyDetailsModalProps> = ({
                                                               visible,
                                                               onClose,
                                                               assembly,
                                                           }) => {
    console.log("part details rendered");
    const api = useAxios();
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [isAddMaterialModalVisible, setIsAddMaterialModalVisible] = useState<boolean>(false);
    const [isAddPartModalVisible, setIsAddPartModalVisible] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);
    const [operations, setOperations] = useState<Operation[]>([])
    const [materials, setMaterials] = useState<Stock[]>([]);
    const [parts, setParts] = useState<Part[]>([]);

    useEffect(() => {
        console.log("fetching operations");
        const fetchOperations = async () => {
            try {
                const response = await api.get<Operation[]>(`/assembly/operation/${assembly?.number}`);
                setOperations(response.data);
            } catch (error) {
                message.error("Failed to fetch oeprations");
            }
        }
        fetchOperations();
    }, [api]);

    useEffect(() => {
        console.log("fetching stocks");
        const fetchStocks = async () => {
            try {
                const response = await api.get<Stock[]>(`/assembly/stock/${assembly?.number}`);
                setMaterials(response.data);
            } catch (error) {
                message.error("Failed to fetch stocks");
            }
        }
        fetchStocks();
    }, [api]);

    useEffect(() => {
        console.log("fetching parts");
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>(`/assembly/part/${assembly?.number}`);
                setParts(response.data);
            } catch (error) {
                message.error("Failed to fetch parts");
            }
        }
        fetchParts();
    }, [api]);


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

    if (!assembly) return null;

    const handleAddOperation = async (operation: Operation) => {
        if (!assembly) return;
        try {
            const response = await api.put(`/assembly/operation/${assembly.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    const handleAddMaterial = async (stock: Stock) => {
        if (!assembly) return;
        try {
            const response = await api.put(`/assembly/stock/${assembly.number}`, stock);

            if (response.status === 201) {
                message.success("Material successfully added");
            }
            console.log("Material added successfully:", stock);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    const handleAddPart = async (part: Part) => {
        if (!assembly) return;
        try {
            const response = await api.put(`/assembly/part/${assembly.number}`, part);

            if (response.status === 201) {
                message.success("Material successfully added");
            }
            console.log("Material added successfully:", part);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    console.log("assembly", assembly);

    return (
        <Modal
            title={`Details for Assembly: ${assembly.name}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Title level={5} style={{marginTop: 32}}>
                Materials
            </Title>
            <List
                dataSource={materials}
                renderItem={(material) => (
                    <List.Item>{material.code} - {material.name}</List.Item>
                )}
                bordered
            />
            <Title level={5}>Operations</Title>
            <OperationList operations={operations} />
            <Space style={{marginTop: 16}}>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                    setIsAddOperationModalVisible(true)
                }}>
                    Add Operation
                </Button>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                    setIsAddMaterialModalVisible(true)
                }}>
                    Add Material
                </Button>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                    setIsAddPartModalVisible(true)
                }}>
                    Add Part
                </Button>
            </Space>


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
        </Modal>
    );
};

export default AssemblyDetailsModal;