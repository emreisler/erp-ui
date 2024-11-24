import React, { useState } from "react";

interface AddStockFormProps {
    onAdd: (number: string, name: string, code: string) => void;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ onAdd }) => {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = () => {
        onAdd(number, name, code);
        setNumber("");
        setName("");
        setCode("");
    };

    return (
        <div>
            <h3>Add Stock</h3>
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
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleSubmit}>Add Stock</button>
        </div>
    );
};

export default AddStockForm;
