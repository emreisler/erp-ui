import React, { useState, useEffect } from "react";
import axios from "axios";
import Selector from "./components/Selector";
import "./App.css"

const API_BASE_URL = "http://localhost:8080";

const App: React.FC = () => {
    const [parts, setParts] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [stocks, setStocks] = useState([]);

    const fetchData = async () => {
        try {
            const [partsRes, materialsRes, stocksRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/parts`),
                axios.get(`${API_BASE_URL}/materials`),
                axios.get(`${API_BASE_URL}/stocks`),
            ]);
            setParts(partsRes.data);
            setMaterials(materialsRes.data);
            setStocks(stocksRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addPart = async (number: string, name: string) => {
        await axios.post(`${API_BASE_URL}/parts`, { number, name });
        fetchData();
    };

    const addMaterial = async (
        number: string,
        name: string,
        stockCode: string,
        qty: number,
        unit: string,
        partId: number
    ) => {
        await axios.post(`${API_BASE_URL}/materials`, {
            number,
            name,
            stockCode,
            qty,
            unit,
            partId,
        });
        fetchData();
    };

    const addStock = async (number: string, name: string, code: string) => {
        await axios.post(`${API_BASE_URL}/stocks`, { number, name, code });
        fetchData();
    };

    return (
        <div className="container">
            <h1>Parts Manager</h1>
            <Selector
                parts={parts}
                materials={materials}
                stocks={stocks}
                addPart={addPart}
                addMaterial={addMaterial}
                addStock={addStock}
            />
        </div>
    );
};

export default App;
