import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CreatePart from "./CreatePart";
import useAxios from "../../utils/api";
import PartList from "./PartList";

const PartPage: React.FC = () => {

    const [isCreatePartVisible, setIsCreatePartVisible] = useState<boolean>(false);
    const [partCreated, setPartCreated] = useState<boolean>(false);


    const handlePartCreated = (createdPart: Part) => {
        setIsCreatePartVisible(false); // Hide CreatePart component
        setPartCreated(true);
    };


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
                    <PartList partCreated={partCreated} />
                </>
            ) : (
                <CreatePart onPartCreated={handlePartCreated}/>
            )}
        </div>
    );
};

export default PartPage;