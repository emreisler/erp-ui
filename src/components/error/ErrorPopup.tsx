import React from "react";
import { Modal, Typography, Button } from "antd";
import { useError } from "../../context/ErrorContext";

const { Text } = Typography;

const ErrorPopup: React.FC = () => {
  const { error, setError } = useError();

  const handleClose = () => {
    setError(null); // Clear the error
  };

  return (
      <Modal
          open={!!error} // Show the modal only if there's an error
          onCancel={handleClose}
          footer={
            <Button type="primary" onClick={handleClose}>
              Close
            </Button>
          }
          title="Error"
      >
        <Text type="danger">{error}</Text>
      </Modal>
  );
};

export default ErrorPopup;