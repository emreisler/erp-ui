import React, { useState } from "react";
import PartPage from "../part/PartPage";
import "./Selector.css"
import ProductionOrder from "../production_order/ProductionOrderList";
import ProductionOrderList from "../production_order/ProductionOrderList";
import TaskCenterList from "../TaskCenterList";
import StockList from "../StockList";

const Selector: React.FC = () => {
    const [selected, setSelected] = useState<"parts" | "stocks" | "prod-orders" | "task-center">(
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
                        <StockList/>
                    </>
                );
            case "prod-orders":
                return (
                    <>
                        <ProductionOrderList/>
                    </>
                );
            case "task-center":
                return (
                    <TaskCenterList/>
                )
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
                <button
                    onClick={() => setSelected("task-center")}
                    className={selected === "task-center" ? "active" : ""}
                >
                    Task Centers
                </button>
            </div>
            <div className="content">{renderContent()}</div>
        </div>
    );
};

export default Selector;
