import React, {useEffect, useState} from "react";
import {Table, Typography, Button, message, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useAxios from "../../utils/api";

const {Text} = Typography;


interface AttachedPartList {
    selectedAssembly: Assembly;
}

function EditOutlined() {
    return null;
}

function DeleteOutlined() {
    return null;
}

const AttachedPartList: React.FC<AttachedPartList> = ({selectedAssembly}) => {
    const api = useAxios();
    const [loading, setLoading] = useState(false);
    const [attachedParts, setAttachedParts] = useState<AttachPartModalState[]>([]);

    useEffect(() => {
        if (selectedAssembly) {
            const fetchAttachedParts = async () => {
                setLoading(true);
                try {
                    const response = await api.get<AttachPartModalState[]>(`/assembly/part/${selectedAssembly.number}`);
                    setAttachedParts(response.data);
                } catch (error) {
                    message.error("Failed to fetch operations.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAttachedParts();
        }
    }, [selectedAssembly, api]);

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
                    loading={loading}
                />
            ) : (
                <Text type="secondary">No attached part available for this part.</Text>
            )}
            <br/>
        </div>
    );
};

export default AttachedPartList;