import React, { useState } from "react";

interface AddMaterialFormProps {
    onAdd: (
        number: string,
        name: string,
        stockCode: string,
        qty: number,
        unit: string,
        partId: number
    ) => void;
}

const AddMaterialForm: React.FC<AddMaterialFormProps> = ({ onAdd }) => {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [stockCode, setStockCode] = useState("");
    const [qty, setQty] = useState(0);
    const [unit, setUnit] = useState("");
    const [partId, setPartId] = useState(1);

    const handleSubmit = () => {
        onAdd(number, name, stockCode, qty, unit, partId);
        setNumber("");
        setName("");
        setStockCode("");
        setQty(0);
        setUnit("");
        setPartId(1);
    };

    return (
        <div>
            <h3>Add Material</h3>
            <input
                placeholder="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Stock Code"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
            />
            <input
                placeholder="Qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
            />
            <input
                placeholder="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
            />
            <input
                placeholder="Part ID"
                type="number"
                value={partId}
                onChange={(e) => setPartId(Number(e.target.value))}
            />
            <button onClick={handleSubmit}>Add Material</button>
        </div>
    );
};

export default AddMaterialForm;
