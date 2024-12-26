import React from "react";
import {Table, Typography, Button} from "antd";

const {Text} = Typography;


interface AttachedMaterialListProps {
    attachedMaterials: AttachedStockModalState[];
}

const AttachedMaterialList: React.FC<AttachedMaterialListProps> = ({attachedMaterials}) => {

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
                <Text type="secondary">No operations available for this part.</Text>
            )}
            <br/>
        </div>
    );
};

export default AttachedMaterialList;