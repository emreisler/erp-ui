import React, { useState } from "react";
import PartList from "./PartList";
import MaterialList from "./MaterialList";
import StockList from "./StockList";
import AddPartForm from "./AddPartForm";
import AddMaterialForm from "./AddMaterialForm";
import AddStockForm from "./AddStockForm";

interface SelectorProps {
    parts: any[];
    materials: any[];
    stocks: any[];
    addPart: (number: string, name: string) => void;
    addMaterial: (
        number: string,
        name: string,
        stockCode: string,
        qty: number,
        unit: string,
        partId: number
    ) => void;
    addStock: (number: string, name: string, code: string) => void;
}

const Selector: React.FC<SelectorProps> = ({
                                               parts,
                                               materials,
                                               stocks,
                                               addPart,
                                               addMaterial,
                                               addStock,
                                           }) => {
    const [selected, setSelected] = useState<"parts" | "materials" | "stocks">(
        "parts"
    );

    const renderContent = () => {
        switch (selected) {
            case "parts":
                return (
                    <>
                        <PartList parts={parts} />
                        <AddPartForm onAdd={addPart} />
                    </>
                );
            case "materials":
                return (
                    <>
                        <MaterialList materials={materials} />
                        <AddMaterialForm onAdd={addMaterial} />
                    </>
                );
            case "stocks":
                return (
                    <>
                        <StockList stocks={stocks} />
                        <AddStockForm onAdd={addStock} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="selector-buttons">
                <button
                    onClick={() => setSelected("parts")}
                    className={selected === "parts" ? "active" : ""}
                >
                    Parts
                </button>
                <button
                    onClick={() => setSelected("materials")}
                    className={selected === "materials" ? "active" : ""}
                >
                    Materials
                </button>
                <button
                    onClick={() => setSelected("stocks")}
                    className={selected === "stocks" ? "active" : ""}
                >
                    Stocks
                </button>
            </div>
            <div className="content"> {renderContent()}</div>
        </div>
    );
};

export default Selector;
