import React from "react";

interface Material {
    id: number;
    number: string;
    name: string;
    qty: number;
    unit: string;
}

interface MaterialListProps {
    materials: Material[];
}

const MaterialList: React.FC<MaterialListProps> = ({ materials }) => (
    <div>
        <h2>Materials</h2>
        <ul>
            {materials.map((material) => (
                <li key={material.id}>
                    {material.number} - {material.name} (Qty: {material.qty} {material.unit})
                </li>
            ))}
        </ul>
    </div>
);

export default MaterialList;
