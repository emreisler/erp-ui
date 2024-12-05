import React from "react";
import {Table, Typography, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "./AddOperationModal";

const {Text} = Typography;


interface OperationListProps {
    operations: Operation[];
    onAddOperation: () => void;
}

const OperationList: React.FC<OperationListProps> = ({operations, onAddOperation}) => {
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
            <Button
                type="primary"
                icon={<PlusOutlined/>}
                style={{marginTop: 16}}
                onClick={onAddOperation}
            >
                Add Operation
            </Button>
        </div>
    );
};

export default OperationList;