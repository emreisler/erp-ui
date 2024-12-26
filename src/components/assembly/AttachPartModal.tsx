import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Button, Upload, Select, message} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import useAxios from "../../utils/api";

const {Option} = Select;

interface AttachPartModalProps {
    visible: boolean;
    onClose: () => void;
    onAddPart: (attachPart: AttachPartModalState) => void;
}



const AttachPartModal: React.FC<AttachPartModalProps> = ({
                                                             visible,
                                                             onClose,
                                                             onAddPart,

                                                         }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [parts, setParts] = useState<Part[]>([]);

    const api = useAxios();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>("/part")
                setParts(response.data);
                setLoading(false);
            } catch (error) {
                message.error("Failed to fetch parts");
            }
        }
        fetchParts();

    }, [api]);


    const handleFinish = async (values: AttachPartModalState) => {
        setLoading(true);
        try {
            onAddPart(values);
            form.resetFields();
            onClose();
        } catch (err) {
            console.error("Failed to add part:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Part"
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
                    label="Task Center Number"
                    name="partNumber"
                    rules={[{ required: true, message: "Please select a task center!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a part"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children?.toString().toLowerCase() || "").includes(input.toLowerCase())
                        }
                    >
                        {parts.map((part) => (
                            <Option key={part.uuid} value={part.number}>
                                {part.number}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{required: true, message: "Please input the quantity!"}]}
                >
                    <Input type="number" placeholder="Enter quantity"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add Part
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AttachPartModal;