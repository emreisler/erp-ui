import React, {useState, useEffect} from "react";
import {Table, Typography, Button, message} from "antd";
import EditOperationModal from "./EditOperationModal";
import {PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "./AddOperationModal";
import useAxios from "../../utils/api";

const {Text} = Typography;


interface OperationListProps {
    operations: Operation[];
    onAddOperation: (operation: Operation) => void;
    onUpdateOperation: (updatedOperation: Operation) => void;
}

const OperationList: React.FC<OperationListProps> = ({operations, onAddOperation, onUpdateOperation}) => {

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [isAddOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);

    const api = useAxios();

    const handleEditSubmit = (updatedOperation: Partial<Operation>) => {
        if (selectedOperation) {
            const newOperation = {...selectedOperation, ...updatedOperation};
            onUpdateOperation(newOperation);
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
        a.sepNumber - b.sepNumber
    );
    const columns = [
        {
            title: "Step",
            dataIndex: "sepNumber",
            key: "sepNumber",
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
            <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                setIsAddOperationModalVisible(true)
            }}>
                Add Operation
            </Button>
            <AddOperationModal visible={isAddOperationModalVisible}
                               onClose={() => setIsAddOperationModalVisible(false)}
                               onAddOperation={onAddOperation}
                               taskCenters={taskCenters}
            />
            <EditOperationModal
                visible={isEditModalVisible}
                operation={selectedOperation}
                onClose={() => setIsEditModalVisible(false)}
                onSubmit={handleEditSubmit}
            />
            <br/>
        </div>
    );
};

export default OperationList;