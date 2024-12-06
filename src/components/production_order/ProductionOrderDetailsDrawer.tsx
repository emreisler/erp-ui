import React from "react";
import {Drawer, Descriptions, Button, Space, message} from "antd";
import {generateProductionOrderPDF} from "../../utils/pdfGenerator";
import useAxios from "../../utils/api";

interface ProductionOrderDetailsDrawerProps {
    visible: boolean;
    productionOrder: ProductionOrder | null;
    onClose: () => void;
}

const ProductionOrderDetailsDrawer: React.FC<ProductionOrderDetailsDrawerProps> = ({
                                                                                       visible,
                                                                                       productionOrder,
                                                                                       onClose,
                                                                                   }) => {
    const api = useAxios();

    const fetchPartDetails = async (partNumber: string) => {
        try {
            const response = await api.get(`/part/number/${partNumber}`);
            return response.data;
        } catch (err) {
            message.error("Failed to fetch part details. Please try again.");
            throw err; // Re-throw the error to handle it in the calling function if needed
        }

    };

    const handlePrintPDF = async () => {
        if (productionOrder) {
            await generateProductionOrderPDF(productionOrder, fetchPartDetails);
        }
    };

    return (
        <Drawer
            title="Production Order Details"
            placement="right"
            onClose={onClose}
            visible={visible}
            width={400}
            footer={
                <Space>
                    <Button onClick={onClose}>Close</Button>
                    <Button type="primary" onClick={handlePrintPDF}>
                        Print PDF
                    </Button>
                </Space>
            }
        >
            {productionOrder ? (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Order Code">{productionOrder.code}</Descriptions.Item>
                    <Descriptions.Item label="Part Number">{productionOrder.partNumber}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{productionOrder.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Status">{productionOrder.status}</Descriptions.Item>
                    <Descriptions.Item label="Current Step">{productionOrder.currentStep}</Descriptions.Item>
                    <Descriptions.Item label="Total Steps">{productionOrder.totalStep}</Descriptions.Item>
                    <Descriptions.Item
                        label="Current Task Center">{productionOrder.currentTaskCenter}</Descriptions.Item>
                </Descriptions>
            ) : (
                <p>No production order selected.</p>
            )}
        </Drawer>
    );
};

export default ProductionOrderDetailsDrawer;