import React from "react";
import { Card } from "antd";

const OperationCard: React.FC<{ operation: Operation }> = ({ operation }) => {
    return (
        <Card
            title={`Step: ${operation.stepNumber}`}
            bordered={true}
            style={{
                width: 500,
                marginBottom: "20px" ,
                backgroundColor : operation.isStamped ? "lightgreen" : "lightslategray",
        }}
        >
            {/*<p><strong>User:</strong> {operation.userEmail || "N/A"}</p>*/}
            <p><strong>Task Center:</strong> {operation.taskCenterNo}</p>
            <p><strong>Description:</strong> {operation.description || "No description available"}</p>
        </Card>
    );
};

export default OperationCard;