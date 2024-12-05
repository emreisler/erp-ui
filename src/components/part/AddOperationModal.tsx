import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAxios from "../../utils/api";

const { Option } = Select;

interface AddOperationModalProps {
    visible: boolean;
    onClose: () => void;
    onAddOperation: (operation: Operation) => void;
    taskCenters: number[]; // Task centers available for selection
}

const AddOperationModal: React.FC<AddOperationModalProps> = ({
                                                                 visible,
                                                                 onClose,
                                                                 onAddOperation,
                                                                 taskCenters,
                                                             }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


    const handleFinish = async (values: Operation) => {
        setLoading(true);
        try {
            onAddOperation(values);
            form.resetFields();
            onClose();
        } catch (err) {
            console.error("Failed to add operation:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Operation"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Step Number"
                    name="sepNumber"
                    rules={[{ required: true, message: "Please input the step number!" }]}
                >
                    <Input type="number" placeholder="Enter step number" />
                </Form.Item>
                <Form.Item
                    label="Task Center Number"
                    name="taskCenterNo"
                    rules={[{ required: true, message: "Please select a task center!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a task center"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children?.toString().toLowerCase() || "").includes(input.toLowerCase())
                        }
                    >
                        {taskCenters.map((center) => (
                            <Option key={center} value={center}>
                                {center}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please input the description!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="ImageUrl"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[{ required: false, message: "Please select an image!" }]}
                >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add Operation
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddOperationModal;