import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CreatePart from "./CreatePart";
import useAxios from "../../utils/api";
import PartList from "./PartList";

const PartPage: React.FC = () => {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreatePartVisible, setIsCreatePartVisible] = useState<boolean>(false);
    const [partCreated, setPartCreated] = useState<boolean>(false);

    const api = useAxios();

    useEffect(() => {
        if (!isCreatePartVisible) {
            console.log("isCreatePartVisible:" , isCreatePartVisible);
            const fetchParts = async () => {
                try {
                    const response = await api.get<Part[]>("/part");
                    setParts(response.data);
                } catch (err) {
                    setError("Failed to fetch parts. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };
            fetchParts();
        }else{
            console.log("isCreatePartVisible:" , isCreatePartVisible);
        }
    }, [isCreatePartVisible, partCreated]);

    const handlePartCreated = (createdPart: Part) => {
        setIsCreatePartVisible(false); // Hide CreatePart component
        setPartCreated(true);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{color: "red"}}>{error}</p>;
    }

    return (
        <div>
            {!isCreatePartVisible ? (
                <>
                    <div style={{marginBottom: "16px", textAlign: "center"}}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => {
                                setIsCreatePartVisible(true)
                                setPartCreated(false);
                            }
                            }
                        >
                            Create New Part
                        </Button>
                    </div>
                    <PartList parts={parts}/>
                </>
            ) : (
                <CreatePart onPartCreated={handlePartCreated}/>
            )}
        </div>
    );
};

export default PartPage;