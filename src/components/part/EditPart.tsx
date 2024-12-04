import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";


interface EditPartComponentProps {
    part: Part
    setPart: (part: Part | null) => void;
}


const EditPart: React.FC<EditPartComponentProps> = ({part, setPart}) => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editPart, setEditPart] = useState<Boolean>(true);
    const [newOperation, setNewOperation] = useState<Operation>({
        StepNumber: 0,
        TaskCenterNumber: "",
        Description: "",
        ImageUrl: "",
    });
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchOps = async () => {
            try {
                const response = await api.get<Part>(`/parts/${part.number}`);
                setOperations(response.data.operationList);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch parts. Please try again later."); // Handle error
            } finally {
                setLoading(false); // Turn off loading spinner
            }
        }
        fetchOps();

    }, [newOperation])


    const api = useAxios();

    // Handle adding operation
    const handleAddOperation = async () => {
        setError(null);
        try {
            const response = await api.put(`/parts/${part.uuid}/operations`, newOperation);
            const addedOperation = response.data;
            setOperations((prev) => [...prev, addedOperation]);
            setNewOperation(newOperation);
        } catch (err) {
            setError("Failed to add operation. Please try again.");
        }
    };

    return (
        <div>
            <h3>Edit Part: {part.number}</h3>
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
            <button onClick={() => {
                setPart(null);
            }}>Exit
            </button>

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
