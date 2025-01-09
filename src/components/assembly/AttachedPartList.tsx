import React, {useEffect, useState} from "react";
import {Table, Typography, Button, message, Space} from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";

const {Text} = Typography;


interface AttachedPartList {
    attachedParts : AttachPartModalState[]
}

const AttachedPartList: React.FC<AttachedPartList> = ({attachedParts}) => {


    const handleEdit = (attachedPart : AttachPartModalState) => {
        console.log("edit");
    }

    const handleDelete = (attachedPart : AttachPartModalState) => {
        console.log("delete");
    }

    const columns = [
        {
            title: "Part Number",
            dataIndex: "partNumber",
            key: "partNumber",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: AttachPartModalState) => (
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
            {attachedParts.length > 0 ? (
                <Table
                    dataSource={attachedParts}
                    columns={columns}
                    rowKey={(attachedPart: AttachPartModalState) => `${attachedPart.partNumber}-${attachedPart.quantity}`}
                    pagination={false}
                />
            ) : (
                <Text type="secondary">No attached part available for this part.</Text>
            )}
            <br/>
        </div>
    );
};

export default AttachedPartList;