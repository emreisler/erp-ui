import React, { useState, useEffect } from "react";
import { Typography, List, Card, Alert } from "antd";
import useAxios from "../../utils/api";

const { Title } = Typography;



interface StampsListProps {
    order: ProductionOrder;
}

const StampsList: React.FC<StampsListProps> = ({ order }) => {
    const [stamps, setStamps] = useState<Stamp[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const api = useAxios();

    useEffect(() => {
        const fetchStamps = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/production-orders/stamp/${order.code}`);
                setStamps(response.data);
            } catch (err) {
                setError("Failed to load stamps for the selected production order.");
            } finally {
                setLoading(false);
            }
        };

        fetchStamps();
    }, [api, order.code]);

    return (
        <div style={{ marginTop: 24 }}>
            <Title level={4}>Stamps for Order: {order.code}</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            {loading ? (
                <p>Loading stamps...</p>
            ) : (
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={stamps}
                    renderItem={(stamp) => (
                        <List.Item>
                            <Card title={`Step ${stamp.stepNumber}`}>
                                <p><strong>User:</strong> {stamp.userEmail}</p>
                                <p><strong>Order Code:</strong> {stamp.productionOrderCode}</p>
                                {/* Add additional functionality here for step items */}
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default StampsList;
