import React from "react";
import { Modal, Typography, Button } from "antd";
import { useSuccess } from "../../context/SuccessContext";

const { Text } = Typography;

const SuccessPopup: React.FC = () => {
    const { success, setSuccess } = useSuccess();
    console.log(success);

    const handleClose = () => {
        setSuccess(null); // Clear the success message
    };

    return (
        <Modal
            open={!!success} // Show the modal only if there's a success message
            onCancel={handleClose}
            footer={
                <Button type="primary" onClick={handleClose}>
                    Close
                </Button>
            }
            title="Success"
        >
            <Text type="success">{success}</Text>
        </Modal>
    );
};

export default SuccessPopup;