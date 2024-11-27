import React, {useState} from "react";
import useAxios from "../../utils/api";


interface CreatePartFormProps {
    onPartCreated: (partUuid: string) => void; // Callback for when part is created
}

const CreatePart: React.FC<CreatePartFormProps> = ({onPartCreated}) => {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const api = useAxios();

    const handleCreatePart = async () => {
        setError(null);
        try {
            const response = await api.post("/parts", {number, name});
            const createdPartUuid = response.data.Uuid; // Assuming backend returns created part ID
            onPartCreated(createdPartUuid); // Pass partId to parent or EditPartComponent
            setNumber("");
            setName("");
        } catch (err) {
            setError("Failed to create part. Please try again.");
        }
    };

    return (
        <div>
            <h3>Create Part</h3>
            <input
                placeholder="Part Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <input
                placeholder="Part Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleCreatePart}>Create Part</button>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
};

export default CreatePart;
