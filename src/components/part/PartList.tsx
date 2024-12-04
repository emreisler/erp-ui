import React, {useState} from "react";
import useAxios from "../../utils/api";
import { List, Button, Typography } from "antd";

const { Text } = Typography;


interface PartListProps {
    parts: Part[];
}

const PartList: React.FC<PartListProps> = ({parts}) => {
    const api = useAxios();

    const [selectedPartUuid, setSelectedPartUuid] = useState<string | null>(null);
    const [poError, setPoError] = useState<string | null>(null);

    const handleViewClick = (partUuid: string) => {
        // Toggle the selected part
        setSelectedPartUuid(partUuid === selectedPartUuid ? null : partUuid);
    };

    const handleProductionOrder = async (partNumber: string) => {
        setPoError(null);
        try {
            const response = await api.post(`/production-orders`, {
                partNumber: partNumber,
                quantity: 1,
            });
            console.log(response.data);
            // const addedOperation = response.data;
        } catch (err) {
            setPoError("Failed to add operation. Please try again.");
            console.log(poError);
        }
    }

    return (
        <div>
            <h2>Parts</h2>
            <List
                dataSource={parts}
                renderItem={(part) => (
                    <List.Item
                        key={part.uuid}
                        actions={[
                            <Button
                                type="link"
                                onClick={() => handleViewClick(part.uuid)}
                                key="view"
                            >
                                {selectedPartUuid === part.uuid ? "Hide" : "View"}
                            </Button>,
                            <Button
                                type="link"
                                onClick={() => console.log("Edit", part)}
                                key="edit"
                            >
                                Edit
                            </Button>,
                            <Button
                                type="primary"
                                onClick={() => handleProductionOrder(part.number)}
                                key="create-po"
                            >
                                Create Production Order
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <div>
                                    <strong>{part.number}</strong> - {part.name}
                                </div>
                            }
                        />
                        {selectedPartUuid === part.uuid && (
                            <div>
                                <h3>Operations</h3>
                                {part.operationList && part.operationList.length > 0 ? (
                                    <List
                                        dataSource={part.operationList}
                                        renderItem={(operation) => (
                                            <List.Item
                                                key={`${operation.TaskCenterNumber}-${operation.Description}`}
                                            >
                                                <Text strong>
                                                    {operation.TaskCenterNumber}
                                                </Text>
                                                : {operation.Description}
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Text type="secondary">
                                        No operations available for this part.
                                    </Text>
                                )}
                            </div>
                        )}
                    </List.Item>
                )}
            />
            {poError && <Text type="danger">{poError}</Text>}
        </div>
    );
};

export default PartList;
