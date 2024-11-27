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
    const [partUuid, setPartUuid] = useState<string | null>(null);

    const api = useAxios();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await api.get<Part[]>("/parts"); // Fetch parts from backend
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

    // const addPart = async (number: string, name: string) => {
    //     const partsRes = await api.post(`http://localhost:8080/v1/parts`, {number, name});
    //     setParts(partsRes.data);
    // };


    const handlePartCreated = (createdPartUuid: string) => {
        setPartUuid(createdPartUuid);
        console.log("part id set: ", createdPartUuid);
    };

    if (partUuid === null || partUuid === "") {
        return (
            <div>
                <CreatePart onPartCreated={handlePartCreated}/>
                <PartList parts={parts}/>
            </div>
        )
    } else {
        return (
        <div>
            <EditPart partUuid={partUuid}/>
        </div>
        )
    }


}


export default PartPage;