import React, { useState } from "react";
import PartPage from "../part/PartPage";
import "./Selector.css"

const Selector: React.FC = () => {
    const [selected, setSelected] = useState<"parts" | "stocks" | "prod-orders">(
        "parts"
    );

    const renderContent = () => {
        switch (selected) {
            case "parts":
                return (
                    <>
                        <PartPage />
                    </>
                );
            case "stocks":
                return (
                    <>
                        <div>Stocks Content</div>
                    </>
                );
            case "prod-orders":
                return (
                    <>
                        <div>Production Orders Content</div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <button
                    onClick={() => setSelected("parts")}
                    className={selected === "parts" ? "active" : ""}
                >
                    Parts
                </button>
                <button
                    onClick={() => setSelected("prod-orders")}
                    className={selected === "prod-orders" ? "active" : ""}
                >
                    Production Orders
                </button>
                <button
                    onClick={() => setSelected("stocks")}
                    className={selected === "stocks" ? "active" : ""}
                >
                    Stocks
                </button>
            </div>
            <div className="content">{renderContent()}</div>
        </div>
    );
};

export default Selector;
