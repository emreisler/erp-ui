import React, {useEffect, useState} from "react";
import {Table, Card, Row, Col, message} from "antd";
import {Pie} from "@ant-design/plots";
import useAxios from "../../utils/api";

const Dashboard: React.FC = () => {
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [taskCenters, setTaskCenters] = useState<TaskCenter[]>([]);
    const [loading, setLoading] = useState(false);
    const api = useAxios();


    useEffect(() => {
        const fetchTaskCenters = async () => {
            try {
                setLoading(true);
                const response = await api.get<TaskCenter[]>("/task-center");
                setTaskCenters(response.data);
            } catch (err) {
                message.error("Failed to fetch task centers. Please try again later.");
            } finally {
                setLoading(false);
            }
            fetchTaskCenters();
        };
    }, [api]);

    useEffect(() => {
        const fetchProductionOrders = async () => {
            try {
                const response = await api.get("/production-orders");
                setOrders(response.data);
            } catch (err) {
                message.error("Failed to fetch production orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductionOrders();
    }, [api]);

    const getChartData = () => {
        const taskCenterCounts = orders.reduce((acc, order) => {
            acc[order.currentTaskCenter] = (acc[order.currentTaskCenter] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return Object.entries(taskCenterCounts).map(([taskCenter, count]) => ({
            taskCenter: `Task Center ${taskCenter}`,
            waiting_parts: count,
        }));
    };

    function getTcName(tcNo: string) {

        for (let i = 0; i < taskCenters.length; i++) {
            if (taskCenters[i].number === tcNo) {
                return taskCenters[i].name;
            }
        }
    }

    const orderColumns = [
        {
            title: "Order Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Part Number",
            dataIndex: "partNumber",
            key: "partNumber",
        },
        {
            title: "Assembly Number",
            dataIndex: "assemblyNumber",
            key: "assemblyNumber",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    created: "blue",
                    in_progress: "orange",
                    on_hold: "red",
                    cancelled: "grey",
                    completed: "green",
                };
                return <span style={{color: colorMap[status]}}>{status}</span>;
            },
        },
        {
            title: "Current Task Center",
            dataIndex: "currentTaskCenter",
            key: "currentTaskCenter",
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
        },
    ];


    return (
        <div style={{padding: "20px"}}>
            <Row gutter={[16, 16]}>
                {/* Chart */}
                <Col span={24}>
                    <Card title="Task Centers">
                        <Pie
                            data={getChartData()}
                            angleField="waiting_parts"
                            colorField="taskCenter"
                            radius={0.9}
                            innerRadius={0.6} // For donut style
                            label={{
                                // type: "",
                                offset: "-50%",
                                content: "{waiting_parts}",
                                style: {
                                    textAlign: "center",
                                    fontSize: 14,
                                },
                            }}
                            interactions={[{type: "element-active"}]}
                            legend={{
                                position: "bottom",
                            }}
                        />
                    </Card>
                </Col>

                {/* Orders Table */}
                <Col span={24}>
                    <Card title="Production Orders">
                        <Table
                            dataSource={orders.map((order) => ({...order, key: order.orderId}))}
                            columns={orderColumns}
                            pagination={{pageSize: 5}}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;