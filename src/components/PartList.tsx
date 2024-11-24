import React from "react";

interface Part {
    id: number;
    number: string;
    name: string;
}

interface PartListProps {
    parts: Part[];
}

const PartList: React.FC<PartListProps> = ({ parts }) => (
    <div>
        <h2>Parts</h2>
        <ul>
            {parts.map((part) => (
                <li key={part.id}>
                    {part.number} - {part.name}
                </li>
            ))}
        </ul>
    </div>
);

export default PartList;
