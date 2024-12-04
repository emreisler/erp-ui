import React, { useEffect, useState } from "react";
import { Table, Typography, Alert, Spin } from "antd";
import { useError } from "../../context/ErrorContext";
import useAxios from "../../utils/api";

const { Title } = Typography;

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
    const { error, setError } = useError();

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const response = await api.get<Stock[]>("/stock");
                setStockList(response.data);
            } catch (err) {
                setError("Failed to fetch stocks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, [api, error]);

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
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Stocks</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            {loading ? (
                <Spin tip="Loading stocks..." />
            ) : (
                <Table
                    dataSource={stockList}
                    columns={columns}
                    rowKey="uuid"
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default StockList;