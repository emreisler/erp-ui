import React from 'react';
import { Card } from 'antd';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    LineElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    PointElement
);

interface LineChartProps {
    title: string;
    labels: string[];
    datasets: {
        label: string; // Name of the KPI
        data: number[]; // Data points for the KPI
        borderColor: string; // Color for the line
        backgroundColor?: string; // Optional background color
    }[];
}

const KPIDashboard: React.FC<LineChartProps> = ({ title, labels, datasets }) => {
    return (
        <Card title={title}>
            <Line
                data={{
                    labels: labels, // X-axis labels
                    datasets: datasets.map((dataset) => ({
                        ...dataset,
                        tension: 0.4, // Smooth curve
                        pointRadius: 5,
                        fill: false, // Don't fill under the lines
                    })),
                }}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                        },
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Percentage (%)',
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                }}
            />
        </Card>
    );
};

export default KPIDashboard;