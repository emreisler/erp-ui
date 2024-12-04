import React, {useEffect, useState} from "react";
import {useError} from "../context/ErrorContext";
import useAxios from "../utils/api";

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
    const {error, setError} = useError();

    useEffect(() => {
        setLoading(true);
        const fetchStocks = async () => {
            try {
                const response = await api.get<Stock[]>("/stock"); // Fetch parts from backend
                setStockList(response.data);
            } catch (error) {
                setError("Failed to fetch stocks. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchStocks();
    }, [])

    return (

        <div>
            <h2>Stocks</h2>
            <ul>
                {stockList.map((stock) => (
                    <li key={stock.uuid}>
                        {stock.code} - {stock.name} - {stock.quantity} - {stock.unit} - {stock.unitPrice}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StockList;
