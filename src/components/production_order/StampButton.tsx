import React from "react";
import { Button, Tooltip, Space } from "antd";
import { CheckCircleTwoTone, EditOutlined, EyeOutlined } from "@ant-design/icons";

const StampButton: React.FC<{
    isStamped: boolean;
    onStampClick: () => void;
    onViewDetails: () => void;
}> = ({ isStamped, onStampClick, onViewDetails }) => {
    return (
        <Space>
            {isStamped ? (
                <Tooltip title="Stamped">
                    <Button
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                        type="text"
                        disabled
                        style={{ cursor: "default", color: "#52c41a", fontWeight: "bold" }}
                    >
                        Stamped
                    </Button>
                </Tooltip>
            ) : (
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={onStampClick}
                    style={{ cursor: "default", fontWeight: "bold", marginRight: 10, marginLeft: 10 }}
                >
                    Stamp
                </Button>
            )}

            <Button
                icon={<EyeOutlined />}
                type="default"
                onClick={onViewDetails}
            >
                View Details
            </Button>
        </Space>
    );
};

export default StampButton;