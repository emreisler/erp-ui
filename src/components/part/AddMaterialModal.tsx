import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Button, Upload, Select, message} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAxios from "../../utils/api";
import api from "../../utils/api";

const { Option } = Select;

interface AddOperationModalProps {
    visible: boolean;
    onClose: () => void;
    onAddMaterial: (stock: Stock) => void;
}

const AddMaterialModal: React.FC<AddOperationModalProps> = ({
                                                                 visible,
                                                                 onClose,
                                                                onAddMaterial,
                                                             }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const api = useAxios();

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const response = await api.get<Stock[]>("/stock");
                setStocks(response.data);
            } catch (err) {
                message.error("Failed to fetch stocks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);


    const handleFinish = async (values: Stock) => {
        setLoading(true);
        try {
            onAddMaterial(values);
            form.resetFields();
            onClose();
        } catch (err) {
            console.error("Failed to add material:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Material"
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
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: "Please input quantity !" }]}
                >
                    <Input type="number" placeholder="Enter quantity" />
                </Form.Item>
                <Form.Item
                    label="Stock"
                    name="code"
                    rules={[{ required: true, message: "Please select a task center!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a stock"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children?.toString().toLowerCase() || "").includes(input.toLowerCase())
                        }
                    >
                        {stocks.map((stock) => (
                            <Option key={stock.code} value={stock.code}>
                                {stock.code} -  {stock.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add Material
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddMaterialModal;