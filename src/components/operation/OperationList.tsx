import React, {useState, useEffect} from "react";
import {Table, Typography, Button, message, Space} from "antd";
import EditOperationModal from "./EditOperationModal";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "./AddOperationModal";
import useAxios from "../../utils/api";

const {Text} = Typography;


interface OperationListProps {
    operations: Operation[];
}

const OperationList: React.FC<OperationListProps> = ({operations}) => {
    console.log("full ops : ", operations);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [isEditOperationModalVisible, setIsEditOperationModalVisible] = useState<boolean>(false);

    const [taskCenters, setTaskCenters] = useState<number[]>([]);

    const api = useAxios();

    const handleEditSubmit = (updatedOperation: Partial<Operation>) => {
        if (selectedOperation) {
            const newOperation = {...selectedOperation, ...updatedOperation};
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

    const sortedOperations = [...operations].sort((a, b) =>
        a.stepNumber - b.stepNumber
    );

    const handleEditOperation = async (updatedFields: Partial<Operation>) => {
        if (!selectedOperation) return;
        console.log("updated operation", updatedFields);

        const fullOperation: Operation = {
            ...selectedOperation,
            ...updatedFields,
        };
        console.log("operation", fullOperation);

        try {
            const response = await api.put(`/part/operation/${fullOperation.operationId}:update`, fullOperation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", fullOperation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
            console.log("err:", err)
        }

    }

    function handleDelete(record: Operation) {

    }

    const columns = [
        {
            title: "Step",
            dataIndex: "stepNumber",
            key: "stepNumber",
        },
        {
            title: "Task Center Number",
            dataIndex: "taskCenterNo",
            key: "taskCenterNo",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Operation) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setSelectedOperation(record);
                            setIsEditOperationModalVisible(true);
                        }}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            {operations.length > 0 ? (
                <Table
                    dataSource={sortedOperations}
                    columns={columns}
                    rowKey={(operation) => `${operation.taskCenterNo}-${operation.description}`}
                    pagination={false}
                />
            ) : (
                <Text type="secondary">No operations available for this part.</Text>
            )}
            <br/>


            <br/>
            <EditOperationModal
                visible={isEditOperationModalVisible}
                operation={selectedOperation}
                onClose={() => {
                    setIsEditOperationModalVisible(false)
                }}
                onSubmit={handleEditOperation}/>
        </div>
    );
};

export default OperationList;