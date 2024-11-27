import React, {useState} from "react";


interface PartListProps {
    parts: Part[];
}

const PartList: React.FC<PartListProps> = ({parts}) => {
    const [selectedPartUuid, setSelectedPartUuid] = useState<string | null>(null);

    const handleViewClick = (partUuid: string) => {
        // Toggle the selected part
        setSelectedPartUuid(partUuid === selectedPartUuid ? null : partUuid);
    };

    return (
        <div>
            <h2>Parts</h2>
            <ul>
                {parts.map((part) => (
                    <li key={part.Uuid}>
                        {selectedPartUuid === null || selectedPartUuid === part.Uuid ? (
                            <div>
                                <strong>{part.Number}</strong> - {part.Name}{" "}
                                <button onClick={() => handleViewClick(part.Uuid)}>
                                    {selectedPartUuid === part.Uuid ? "Hide" : "View"}
                                </button>
                                <button onClick={() => console.log("Edit", part)}>
                                    Edit
                                </button>
                                {selectedPartUuid === part.Uuid && (
                                    <div>
                                        <h3>Operations</h3>
                                        {part.Operations && part.Operations.length > 0 ? (
                                            <ul>
                                                {part.Operations.map((operation) => (
                                                    <li key={operation.Description + operation.TaskCenterNumber}>
                                                        <strong>{operation.TaskCenterNumber}</strong>: {operation.Description}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No operations available for this part.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PartList;
