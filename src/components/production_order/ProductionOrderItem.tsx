import React, {useEffect, useState} from "react";
import api from "../../utils/api";
import useAxios from "../../utils/api";

interface ProdListProps {
    productionOrder: ProductionOrder;
}

const ProductionOrderItem: React.FC<ProdListProps> = ({productionOrder}) => {
    const api = useAxios();
    const [partLoading, setPartLoading] = useState<boolean>(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [selectedPartNumber, setSelectedPartNumber] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPart = async () => {
            try {
                const response = await api.get<Part | null>(`/parts/${selectedPartNumber}`);
                setSelectedPart(response.data);
                setError(null);
            } catch (error) {
                setError("Failed to fetch parts. Please try again later.");
            } finally {
                setPartLoading(false);
            }
        }
        fetchPart();
    }, [selectedPartNumber]);

    return (
        <div>
            <h2>{productionOrder.ID} - {productionOrder.Code} - {productionOrder.PartNumber} - {productionOrder.Closed} {productionOrder.Quantity}</h2>
            <button onClick={() => {
                setSelectedPartNumber(productionOrder.PartNumber);
            }}>VIEW
            </button>
        </div>
    )
}

export default ProductionOrderItem;