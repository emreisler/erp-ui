import React, {useEffect, useState} from "react";
import CreatePart from "./CreatePart";
import EditPart from "./EditPart";
import useAxios from "../../utils/api";
import PartList from "./PartList";


const PartPage: React.FC = () => {
    const [parts, setParts] = useState<Part[]>([]); // State to hold parts
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [error, setError] = useState<string | null>(null); // State for error handling
    const [partsUpdated, setPartsUpdated] = useState<boolean>(false);
    const [part, setPart] = useState<Part | null>(null);

    const api = useAxios();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>("/part"); // Fetch parts from backend
                setParts(response.data); // Update parts state
            } catch (err) {
                setError("Failed to fetch parts. Please try again later."); // Handle error
            } finally {
                setLoading(false); // Turn off loading spinner
            }
        };

        fetchParts();
    }, [partsUpdated]); // Empty dependency array means this runs once after component mounts

    if (loading) {
        return <p>Loading...</p>; // Show loading message
    }

    if (error) {
        return <p style={{color: "red"}}>{error}</p>; // Show error message
    }


    const handlePartCreated = (createdPart: Part) => {
        setPart(createdPart);
        console.log("part id set: ", createdPart);
    };

    if (part === null) {
        return (
            <div>
                <CreatePart onPartCreated={handlePartCreated}/>
                <PartList parts={parts}/>
            </div>
        )
    } else {
        return (
            <div>
                <EditPart part={part} setPart={setPart}/>
            </div>
        )
    }


}


export default PartPage;