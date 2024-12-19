import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";
import {Button, message, Space, Table} from "antd";
import OperationList from "../part/OperationList";
import {PlusOutlined} from "@ant-design/icons";

type AssemblyListProps = {
    assemblyCreated: boolean;
}

const AssemblyList: React.FC<AssemblyListProps> = ({assemblyCreated}) => {

    const [assemblyListLoading, setAssemblyListLoading] = useState<boolean>(true);
    const [assemblies, setAssemblies] = useState<Assembly[]>([])
    const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
    const [addOperationModalVisible, setIsAddOperationModalVisible] = useState<boolean>(false);

    const api = useAxios();

    useEffect(() => {
        const fetchAssemblies = async () => {
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
    }, [api, assemblyCreated]);

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
        <Table
            dataSource={assemblies}
            columns={columns}
            rowKey="uuid"
            loading={assemblyListLoading}
            expandable={{
                expandedRowRender: (record: Assembly) => (
                    <OperationList
                        operations={record.operationList}
                        onAddOperation={() => {
                            setSelectedAssembly(record);
                            setIsAddOperationModalVisible(true);
                        }}
                        onAddMaterial={() => setSelectedAssembly(record)}
                    />
                ),
            }}
            bordered
            pagination={{pageSize: 10}}
        />
    )
}

export default AssemblyList