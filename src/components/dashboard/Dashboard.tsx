import React, {useEffect, useState} from 'react';
import {Spin, Tabs} from 'antd';
import axios from 'axios';
import TcMetrics from "./TcMetrics";
import useAxios from "../../utils/api";
import TaskCenters from "../taskCenter/TaskCenters";
import TabPane from "antd/es/tabs/TabPane";
import KPIDashboard from "./KPIDashboard";

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<TcMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const api = useAxios();

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get<TcMetric[]>('/production-orders/task-center-metrics');

                response.data.map((tc, index) => {
                    response.data[index].capacity = 100;
                })

                setMetrics(response.data);
            } catch (error) {
                console.error('Failed to fetch metrics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [api]);

    if (loading) {
        return <Spin/>;
    }


    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const datasets = [
        {
            label: 'Availability',
            data: [90, 85, 87, 88, 92, 89, 91],
            borderColor: '#36a2eb',
        },
        {
            label: 'Performance',
            data: [80, 83, 85, 82, 88, 86, 84],
            borderColor: '#ff6384',
        },
        {
            label: 'Quality',
            data: [95, 94, 93, 96, 94, 95, 97],
            borderColor: '#4caf50',
        },
    ];

    return (
        <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Task Centers Dashboard" key="1">
                <div style={{padding: '16px'}}>
                    <TcMetrics data={metrics}/>
                </div>
            </TabPane>

            <TabPane tab="KPI Dashboards" key="2">
                <div style={{padding: '16px'}}>
                    <KPIDashboard
                        title="KPI Dashboard: Multiple Plots"
                        labels={labels}
                        datasets={datasets}
                    />
                </div>
            </TabPane>

            {/* Add more tabs as needed */}
            <TabPane tab="Future Planning Dashboard" key="3">
                <div style={{padding: '16px'}}>
                    <h2>Future Dashboard</h2>
                    <p>Placeholder for future dashboard content.</p>
                </div>
            </TabPane>
        </Tabs>
    );

};

export default Dashboard;