import React, { useState } from "react";

interface AddPartFormProps {
    onAdd: (number: string, name: string) => void;
}

const AddPartForm: React.FC<AddPartFormProps> = ({ onAdd }) => {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = () => {
        onAdd(number, name);
        setNumber("");
        setName("");
    };

    return (
        <div>
            <h3>Add Part</h3>
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
            <button onClick={handleSubmit}>Add Part</button>
        </div>
    );
};

export default AddPartForm;
