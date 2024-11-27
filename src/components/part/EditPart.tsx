import React, {useState} from "react";
import useAxios from "../../utils/api";


interface EditPartComponentProps {
    partUuid: string; // ID of the part to edit
}


const EditPart: React.FC<EditPartComponentProps> = ({partUuid}) => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [newOperation, setNewOperation] = useState<Operation>({
        StepNumber: 0,
        TaskCenterNumber: "",
        Description: "",
        ImageUrl: "",
    });
    const [error, setError] = useState<string | null>(null);

    const api = useAxios();

    // Handle adding operation
    const handleAddOperation = async () => {
        setError(null);
        try {
            const response = await api.put(`/parts/${partUuid}/operations`, newOperation);
            const addedOperation = response.data;
            setOperations((prev) => [...prev, addedOperation]);
            setNewOperation({
                StepNumber: 0,
                TaskCenterNumber: "",
                Description: "",
                ImageUrl: "",
            });
        } catch (err) {
            setError("Failed to add operation. Please try again.");
        }
    };

    return (
        <div>
            <h3>Edit Part: {partUuid}</h3>
            <h4>Add Operations</h4>
            <input
                placeholder="Step Number"
                type="number"
                value={newOperation.StepNumber}
                onChange={(e) =>
                    setNewOperation({...newOperation, StepNumber: +e.target.value})
                }
            />
            <input
                placeholder="Task Center Number"
                value={newOperation.TaskCenterNumber}
                onChange={(e) =>
                    setNewOperation({...newOperation, TaskCenterNumber: e.target.value})
                }
            />
            <input
                placeholder="Description"
                value={newOperation.Description}
                onChange={(e) =>
                    setNewOperation({...newOperation, Description: e.target.value})
                }
            />
            <input
                placeholder="Image URL"
                value={newOperation.ImageUrl}
                onChange={(e) =>
                    setNewOperation({...newOperation, ImageUrl: e.target.value})
                }
            />
            <button onClick={handleAddOperation}>Add Operation</button>

            {error && <p style={{color: "red"}}>{error}</p>}

            <ul>
                {operations.map((op, index) => (
                    <li key={index}>
                        Step {op.StepNumber}: {op.Description} (Task Center: {op.TaskCenterNumber})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditPart;
