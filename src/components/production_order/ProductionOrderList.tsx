import React, {useEffect, useState} from "react";
import api from "../../utils/api";
import useAxios from "../../utils/api";
import ProductionOrderItem from "./ProductionOrderItem";


const ProductionOrderList: React.FC = () => {
    const api = useAxios()

    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [error, setError] = useState<string | null>(null); // State for error handling


    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<ProductionOrder[]>("/production-orders"); // Fetch parts from backend
                setProductionOrders(response.data); // Update parts state
            } catch (err) {
                setError("Failed to fetch parts. Please try again later."); // Handle error
            } finally {
                setLoading(false); // Turn off loading spinner
            }
        };
        fetchParts();
    }, []);

    return (
        <div>
            <h1>Production Orders</h1>
            <ul>
                {productionOrders.map((productionOrder, index) => (
                    <ProductionOrderItem key={index} productionOrder={productionOrder} />
                ))}
            </ul>
        </div>
    )
}


export default ProductionOrderList;