import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";
import {Button, message, Space, Table} from "antd";
import OperationList from "../part/OperationList";
import {PlusOutlined} from "@ant-design/icons";
import AddOperationModal from "../part/AddOperationModal";

type AssemblyListProps = {
    assemblyCreated: boolean;
}

const AssemblyList: React.FC<AssemblyListProps> = ({assemblyCreated}) => {

    const [assemblyListLoading, setAssemblyListLoading] = useState<boolean>(true);
    const [assemblies, setAssemblies] = useState<Assembly[]>([])
    const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
    const [addOperation, setAddOperation] = useState<boolean>(false);
    const [taskCenters, setTaskCenters] = useState<number[]>([]);

    const api = useAxios();

    const handleAddOperation = async (operation: Operation) => {
        if (!selectedAssembly) return;
        try {
            const response = await api.put(`/assembly/operation/${selectedAssembly.number}`, operation);

            if (response.status === 201) {
                message.success("Operation successfully added");
            }
            console.log("Operation added successfully:", operation);
        } catch (err) {
            message.error("Failed to add operation. Please try again.");
        }
        setAddOperation(false);
        console.log("operation attached");
    };

    useEffect(() => {
        const fetchTaskCenters = async () => {
            try {
                const response = await api.get<TaskCenter[]>("/task-center");
                const tcNumbers: number[] = [];
                response.data.forEach((tc) => {
                    tcNumbers.push(tc.number);
                })
                setTaskCenters(tcNumbers);
            } catch (error) {
                message.error("Failed to fetch task centers");
            }
        }
        fetchTaskCenters();
    }, [api]);

    useEffect(() => {
        const fetchAssemblies = async () => {
            console.log("AssemblyList fetching");
            setAssemblyListLoading(true);
            try {
                const response = await api.get<Assembly[]>("/assembly")
                setAssemblies(response.data);
            } catch (err) {
                message.error("Could not fetch Assemblies. Please try again later.");
            } finally {
                setAssemblyListLoading(false);
            }
        }
        fetchAssemblies();
    }, [api, assemblyCreated, addOperation]);

    const columns = [
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Project Code",
            dataIndex: "projectCode",
            key: "projectCode",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Assembly) => (
                <Space>
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            //todo action
                        }}
                    >
                        Create Production Order
                    </Button>
                </Space>
            ),
        },
    ];


    return (
        <div style={{paddingTop: "16px", paddingBottom: "16px"}}>
            <Table
                dataSource={assemblies}
                columns={columns}
                rowKey="uuid"
                loading={assemblyListLoading}
                expandable={{
                    expandedRowRender: (record: Assembly) => (
                        <OperationList
                            operations={record.operationList}
                            // onAddOperation={() => {
                            //     setSelectedAssembly(record);
                            //     setAddOperation(true);
                            // }}
                            // onAddMaterial={() => setSelectedAssembly(record)}
                        />
                    ),
                }}
                bordered
                pagination={{pageSize: 10}}
            />
            <AddOperationModal
                visible={addOperation}
                onClose={() => setAddOperation(false)}
                onAddOperation={handleAddOperation}
                taskCenters={taskCenters}
            />
        </div>

    )
}

export default AssemblyList