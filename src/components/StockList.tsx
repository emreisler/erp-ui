import React from "react";

interface Stock {
    id: number;
    number: string;
    name: string;
    code: string;
}

interface StockListProps {
    stocks: Stock[];
}

const StockList: React.FC<StockListProps> = ({ stocks }) => (
    <div>
        <h2>Stocks</h2>
        <ul>
            {stocks.map((stock) => (
                <li key={stock.id}>
                    {stock.number} - {stock.name}
                </li>
            ))}
        </ul>
    </div>
);

export default StockList;
