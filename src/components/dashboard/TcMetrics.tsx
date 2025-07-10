import React from 'react';
import {Card, Row, Col, Typography} from 'antd';
import GaugeComponent from 'react-gauge-component';

const {Text, Title} = Typography;

interface TaskCenter {
    name: string;
    uuid: string;
}

interface DashboardProps {
    data: TcMetric[];
}

const TcMetrics: React.FC<DashboardProps> = ({data}) => {
    return (
        <section>

            <Row gutter={[16, 16]}>
                {data.map((metric) => {
                    const {taskCenter, totalPartQuantity, capacity} = metric;

                    // Calculate the gauge value as a percentage
                    let value = 0;

                    if (totalPartQuantity > capacity) {
                        value = 100;
                    } else {
                        value = Math.min((totalPartQuantity / capacity) * 100, 100);
                    }

                    // Determine the status
                    const statusColor =
                        totalPartQuantity > capacity
                            ? 'red'
                            : totalPartQuantity === 0
                                ? 'yellow'
                                : 'green';

                    return (
                        <Col key={taskCenter.uuid} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                style={{
                                    backgroundColor: '#1890ff', // Ant Design blue
                                    color: '#ffffff', // Ensure text is readable on blue background
                                    borderRadius: '8px', // Rounded corners
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                    transition: 'transform 0.3s ease', // Smooth scaling on hover
                                }}
                                bodyStyle={{
                                    padding: '16px',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} // Scale up on hover
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Scale back
                            >
                                <Title
                                    level={5}
                                    style={{
                                        textAlign: 'center',
                                        color: '#ffffff', // White text for contrast
                                        marginTop: '1rem',
                                    }}
                                >
                                    {taskCenter.name}
                                </Title>
                                <div style={{position: 'relative'}}>
                                    <GaugeComponent
                                        id={`gauge-${taskCenter.uuid}`}
                                        arc={{
                                            gradient: false,
                                            width: 0.15,
                                            padding: 0,
                                            subArcs: [
                                                {
                                                    limit: 25,
                                                    color: '#eae028',
                                                    showTick: true,
                                                },
                                                {
                                                    limit: 50,
                                                    color: '#5BE12C',
                                                    showTick: true,
                                                },
                                                {
                                                    limit: 75,
                                                    color: '#ea8f28',
                                                    showTick: true,
                                                },
                                                {
                                                    limit: 100,
                                                    color: '#EA4228',
                                                    showTick: true,
                                                },
                                            ],
                                        }}
                                        value={value}
                                        pointer={{type: 'needle', elastic: false, animate: true}}
                                        type="grafana"
                                    />

                                </div>

                                <Title
                                    level={5}
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '1rem',
                                        color: '#ffffff', // Ensure this text is also white
                                    }}
                                >
                                    <strong>Parts / Capacity:</strong> {totalPartQuantity} / {capacity}
                                </Title>

                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </section>
    );
};

export default TcMetrics;