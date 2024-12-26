import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface EditOperationModalProps {
    visible: boolean;
    operation: Operation | null; // Pass the selected operation
    onClose: () => void; // Close modal callback
    onSubmit: (updatedOperation: Partial<Operation>) => void; // Submit updated operation callback
}

const EditOperationModal: React.FC<EditOperationModalProps> = ({
                                                                   visible,
                                                                   operation,
                                                                   onClose,
                                                                   onSubmit,
                                                               }) => {
    const [form] = Form.useForm();

    // Reset form fields when operation changes
    React.useEffect(() => {
        if (operation) {
            form.setFieldsValue(operation);
        } else {
            form.resetFields();
        }
    }, [operation, form]);

    const handleFinish = (values: Partial<Operation>) => {
        onSubmit(values);
        onClose();
    };

    return (
        <Modal
            title="Edit Operation"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {operation && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={operation}
                >
                    <Form.Item
                        label="Step"
                        name="stepNumber"
                        rules={[{ required: true, message: "Please input the step number!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Task Center Number"
                        name="taskCenterNo"
                        rules={[{ required: true, message: "Please input the task center number!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please input the description!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default EditOperationModal;