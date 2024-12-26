import React, {useEffect, useState} from "react";
import {Modal, List, Button, Typography, Space, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import OperationList from "./OperationList";
import useAxios from "../../utils/api";
import AddOperationModal from "./AddOperationModal";
import AddMaterialModal from "./AddMaterialModal";

const {Title} = Typography;

interface PartDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    part: Part;
}

const PartDetailsModal: React.FC<PartDetailsModalProps> = ({
                                                               visible,
                                                               onClose,
                                                               part,
                                                           }) => {
    console.log("part details rendered");
    const api = useAxios();
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [isAddMaterialModalVisible, setIsAddMaterialModalVisible] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);
    const [operations, setOperations] = useState<Operation[]>([])
    const [materials, setMaterials] = useState<Stock[]>([]);

    useEffect(() => {
        console.log("fetching operations");
            const fetchOperations = async () => {
                try {
                    const response = await api.get<Operation[]>(`/part/operation/${part?.number}`);
                    setOperations(response.data);
                } catch (error) {
                    message.error("Failed to fetch task centers");
                }
            }
            fetchOperations();
    }, [api]);

    useEffect(() => {
        console.log("fetching stocks");
        const fetchStocks = async () => {
            try {
                const response = await api.get<Stock[]>(`/part/stock/${part?.number}`);
                setMaterials(response.data);
            } catch (error) {
                message.error("Failed to fetch task centers");
            }
        }
        fetchStocks();
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

    if (!part) return null;

    const handleAddOperation = async (operation: Operation) => {
        if (!part) return;
        try {
            const response = await api.put(`/part/operation/${part.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    const handleAddMaterial = async (stock: Stock) => {
        if (!part) return;
        try {
            const response = await api.put(`/part/stock/${part.number}`, stock);

            if (response.status === 201) {
                message.success("Material successfully added");
            }
            console.log("Material added successfully:", stock);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
    };

    console.log("part", part);

    return (
        <Modal
            title={`Details for Part: ${part.name}`}
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

export default PartDetailsModal;