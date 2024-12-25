import React, {useState} from "react";
import AssemblyList from "./AssemblyList";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CreateAssembly from "./CreateAssembly";

const AssemblyPage: React.FC = () => {

    const [assemblyCreated, setAssemblyCreated] = useState<boolean>(false);
    const [createAssemblyModalVisible, setCreateAssemblyModalVisible] = useState<boolean>(false);

    const handleAssemblyCreated = (createdAssembly: Assembly) => {
        setCreateAssemblyModalVisible(false); // Hide Create assembly component
        setAssemblyCreated(true);
    };

    return (
        <div>
            {!createAssemblyModalVisible ? (
                <>
                    <div style={{marginBottom: "16px", textAlign: "center"}}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => {
                                setCreateAssemblyModalVisible(true)
                                setAssemblyCreated(false);
                            }
                            }
                        >
                            Create New Assembly
                        </Button>
                    </div>
                    <AssemblyList assemblyCreated={assemblyCreated}/>
                </>
            ) : (
                <CreateAssembly onAssemblyCreated={handleAssemblyCreated}/>
            )}
        </div>
    );
}


export default AssemblyPage;