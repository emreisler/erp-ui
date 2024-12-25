import React, { useEffect, useState } from "react";
import useAxios from "../../utils/api";
import {Form, Input, Button, Typography, Alert, Select, Spin, message} from "antd";

const { Title } = Typography;
const { Option } = Select;

interface CreateAssemblyFormProps {
    onAssemblyCreated: (assembly: Assembly) => void; // Callback for when part is created
}

const CreateAssembly: React.FC<CreateAssemblyFormProps> = ({ onAssemblyCreated }) => {
    console.log("Create Asssembly");
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [fetchingData, setFetchingData] = useState<boolean>(true);

    const api = useAxios();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, categoriesResponse] = await Promise.all([
                    api.get("project"), // Endpoint to fetch projects
                    api.get("category"), // Endpoint to fetch categories
                ]);
                setProjects(projectsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (err) {
                message.error("could not fetch projects and categories");
                setError("Failed to fetch projects or categories. Please try again.");
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, [api]);

    const handleCreateAssembly = async (assembly: Assembly) => {
        setError(null);
        setLoading(true);
        try {
            const response = await api.post("assembly", assembly);
            const createdPart = response.data; // Assuming backend returns created part ID
            onAssemblyCreated(createdPart); // Pass partId to parent or EditPartComponent
            form.resetFields();
            message.success("Part created successfully.");
        } catch (err) {
            setError("Failed to create part. Please try again.");
            message.error("Could not create part. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
            <Title level={3}>Create Assembly</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            {fetchingData ? (
                <Spin tip="Loading projects" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateAssembly} // Form automatically passes values to this function
                    requiredMark="optional"
                >
                    <Form.Item
                        label="Assembly Number"
                        name="number"
                        rules={[{ required: true, message: "Please input the part number!" }]}
                    >
                        <Input placeholder="Enter assembly number" />
                    </Form.Item>
                    <Form.Item
                        label="Assembly Name"
                        name="name"
                        rules={[{ required: true, message: "Please input the assembly name!" }]}
                    >
                        <Input placeholder="Enter part name" />
                    </Form.Item>
                    <Form.Item
                        label="Project"
                        name="projectCode"
                        rules={[{ required: true, message: "Please select a project!" }]}
                    >
                        <Select placeholder="Select a project">
                            {projects.map((project) => (
                                <Option key={project.code} value={project.code}>
                                    {project.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Additional Info"
                        name="additionalInfo"
                    >
                        <Input placeholder="Enter additional information" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create Assembly
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default CreateAssembly;