import React, {useEffect, useState} from "react";
import {
    Table,
    Typography,
    Spin,
    message,
    Button,
    Modal,
    Form,
    InputNumber,
    Popconfirm,
    Select,
    Input,
    Space
} from "antd";
import useAxios from "../../utils/api";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const {Title} = Typography;

interface Stock {
    uuid: string;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    code: string;
}

const StockList: React.FC = () => {
    const api = useAxios();
    const [loading, setLoading] = useState(true);
    const [stockList, setStockList] = useState<Stock[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateStockModalOpen, setIsCreateStockModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [form] = Form.useForm();
    const [createStockForm] = Form.useForm();

    useEffect(() => {
        fetchStocks();
    }, [api]);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await api.get<Stock[]>("/stock");
            setStockList(response.data);
        } catch (err) {
            message.error("Failed to fetch stocks. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStock = async (values: Omit<Stock, "uuid" | "code">) => {
        try {
            const response = await api.post<Stock>("/stock", values);
            setStockList((prevList) => [...prevList, response.data]);
            message.success("Stock created successfully!");
            createStockForm.resetFields();
            setIsCreateStockModalOpen(false);
        } catch (err) {
            message.error("Failed to create stock. Please try again.");
        }
    };

    const handleDeleteStock = async (code: string) => {
        try {
            await api.delete(`stock/${code}`);
            setStockList((prevList) => prevList.filter((stock) => stock.code !== code));
            message.success("Stock deleted successfully!");
        } catch (err) {
            message.error("Failed to delete stock. Please try again.");
        }
    };


    const handleUpdateQuantity = async (values: { quantity: number }) => {
        if (!selectedStock) return;

        try {

            const response = await api.put<Stock>(`/stock/${selectedStock.code}`,
                {
                    uuid : selectedStock.uuid,
                    quantity: values.quantity,
                });
            setStockList((prevList) =>
                prevList.map((stock) =>
                    stock.uuid === selectedStock.uuid ? {...stock, quantity: response.data.quantity} : stock
                )
            );
            message.success("Quantity updated successfully!");
            setSelectedStock(null);
            setIsModalOpen(false);
            form.resetFields();
        } catch (err) {
            message.error("Failed to update quantity. Please try again.");
        }
    };

    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Stock) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleUpdateQuantity({ quantity: record.quantity })}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteStock(record.code)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{padding: 24}}>
            <div style={{marginBottom: "16px", textAlign: "center"}}>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => setIsCreateStockModalOpen(true)}>
                    Create New Stock
                </Button>
            </div>

            <Title level={3}>Stocks</Title>
            {loading ? (
                <Spin tip="Loading stocks..."/>
            ) : (
                <Table
                    dataSource={stockList}
                    columns={columns}
                    rowKey="uuid"
                    bordered
                    pagination={{pageSize: 10}}
                />
            )}
            <Modal
                title="Update Quantity"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedStock(null);
                }}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateQuantity}
                    initialValues={{quantity: selectedStock?.quantity}}
                >
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{required: true, message: "Please enter the quantity"}]}
                    >
                        <InputNumber min={0} style={{width: "100%"}}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Create New Stock"
                open={isCreateStockModalOpen}
                onCancel={() => setIsCreateStockModalOpen(false)}
                onOk={() => createStockForm.submit()}
            >
                <Form
                    form={createStockForm}
                    layout="vertical"
                    onFinish={handleCreateStock}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: "Please enter the stock name"}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{required: true, message: "Please enter the quantity"}]}
                    >
                        <InputNumber min={0} style={{width: "100%"}}/>
                    </Form.Item>
                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{required: true, message: "Please enter the unit"}]}
                    >
                        <Select>
                            <Select.Option value="kg">kg</Select.Option>
                            <Select.Option value="pcs">pcs</Select.Option>
                            <Select.Option value="liters">liters</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Unit Price"
                        name="unitPrice"
                        rules={[{required: true, message: "Please enter the unit price"}]}
                    >
                        <InputNumber min={0} style={{width: "100%"}} step={0.01}/>
                    </Form.Item>
                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{required: true, message: "Please select a currency"}]}
                    >
                        <Select>
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="TL">TL</Select.Option>
                            <Select.Option value="EURO">EURO</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StockList;