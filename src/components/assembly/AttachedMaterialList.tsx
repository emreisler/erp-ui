import React from "react";
import {Table, Typography, Button, Space} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const {Text} = Typography;


interface AttachedMaterialListProps {
    attachedMaterials: AttachedStockModalState[];
}

const AttachedMaterialList: React.FC<AttachedMaterialListProps> = ({attachedMaterials}) => {

    function handleEdit(record: AttachedStockModalState) {
        
    }

    function handleDelete(record: AttachedStockModalState) {
        
    }

    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: AttachedStockModalState) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            {attachedMaterials.length > 0 ? (
                <Table
                    dataSource={attachedMaterials}
                    columns={columns}
                    rowKey={(attachedStock: AttachedStockModalState) => `${attachedStock.code}-${attachedStock.name}-${attachedStock.quantity}`}
                    pagination={false}
                />
            ) : (
                <Text type="secondary">No materials available for this part.</Text>
            )}
            <br/>
        </div>
    );
};

export default AttachedMaterialList;