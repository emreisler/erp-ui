import React from "react";
import {Table, Typography, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const {Text} = Typography;


interface AttachedPartList {
    attachedParts: AttachPartModalState[];
}

const AttachedPartList: React.FC<AttachedPartList> = ({attachedParts}) => {

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
                <Text type="secondary">No operations available for this part.</Text>
            )}
            <br/>
        </div>
    );
};

export default AttachedPartList;