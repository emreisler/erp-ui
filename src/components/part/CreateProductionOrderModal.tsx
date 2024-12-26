import React from "react";
import {Modal, Form, Input, DatePicker, Button} from "antd";

interface CreateProductionOrderModalProps {
    visible: boolean;
    part: { number: string };
    onClose: () => void;
    onCreate: (partNumber: string, quantity: number, endDate: string) => void;
    loading: boolean;
}

const CreateProductionOrderModal: React.FC<CreateProductionOrderModalProps> = ({
                                                                                   visible,
                                                                                   part,
                                                                                   onClose,
                                                                                   onCreate,
                                                                                   loading,
                                                                               }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const {quantity, endDate} = values;
            onCreate(part.number, quantity, endDate.format("YYYY-MM-DD"));
        });
    };

    return (
        <Modal
            title={`Create Production Order for ${part.number}`}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Create
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{required: true, message: "Please input the quantity!"}]}
                >
                    <Input type="number" placeholder="Enter quantity"/>
                </Form.Item>
                <Form.Item
                    label="Required Date"
                    name="endDate"
                    rules={[{required: true, message: "Please select the end date!"}]}
                >
                    <DatePicker style={{width: "100%"}}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProductionOrderModal;