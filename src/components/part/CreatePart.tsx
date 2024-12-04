import React, {useEffect, useState} from "react";
import useAxios from "../../utils/api";
import { Form, Input, Button, Typography, Alert, Select, Spin } from "antd";

const { Title } = Typography;
const { Option } = Select;



interface CreatePartFormProps {
    onPartCreated: (part: Part) => void; // Callback for when part is created
}

const CreatePart: React.FC<CreatePartFormProps> = ({onPartCreated}) => {
    const [form] = Form.useForm();
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
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
                setError("Failed to fetch projects or categories. Please try again.");
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    },[]);

    const handleCreatePart = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await api.post("/parts", {number, name});
            const createdPart = response.data; // Assuming backend returns created part ID
            onPartCreated(createdPart); // Pass partId to parent or EditPartComponent
            form.resetFields();
        } catch (err) {
            setError("Failed to create part. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: 400, margin: "0 auto", padding: "20px"}}>
            <Title level={3}>Create Part</Title>
            {error && <Alert message={error} type="error" showIcon style={{marginBottom: 16}}/>}
            {fetchingData ? (
                <Spin tip="Loading projects and categories..."/>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreatePart}
                    requiredMark="optional"
                >
                    <Form.Item
                        label="Part Number"
                        name="number"
                        rules={[{required: true, message: "Please input the part number!"}]}
                    >
                        <Input placeholder="Enter part number"/>
                    </Form.Item>
                    <Form.Item
                        label="Part Name"
                        name="name"
                        rules={[{required: true, message: "Please input the part name!"}]}
                    >
                        <Input placeholder="Enter part name"/>
                    </Form.Item>
                    <Form.Item
                        label="Project"
                        name="project"
                        rules={[{required: true, message: "Please select a project!"}]}
                    >
                        <Select placeholder="Select a project">
                            {projects.map((project, index) => (
                                <Option key={index} value= {project.code}>
                                    {project.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{required: true, message: "Please select a category!"}]}
                    >
                        <Select placeholder="Select a category">
                            {categories.map((category, index) => (
                                <Option key={index} value={category.type}>
                                    {category.type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Additional Info"
                        name="additionalInfo"
                        rules={[{required: false}]} // Optional field
                    >
                        <Input placeholder="Enter additional information"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create Part
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default CreatePart;
