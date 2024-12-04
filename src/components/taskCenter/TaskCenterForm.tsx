import React from "react";
import { Form, Input, Button, Switch } from "antd";


interface TaskCenterFormProps {
    onSubmit: (taskCenter: TaskCenter) => void;
    initialValues?: TaskCenter | null;
    mode: "create" | "update";
}

const TaskCenterForm: React.FC<TaskCenterFormProps> = ({
                                                           onSubmit,
                                                           initialValues,
                                                           mode,
                                                       }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: TaskCenter) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues || { isInspection: false }}
        >
            <Form.Item
                label="Number"
                name="number"
                rules={[{ required: true, message: "Please input the task center number!" }]}
            >
                <Input placeholder="Enter task center number" />
            </Form.Item>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input the task center name!" }]}
            >
                <Input placeholder="Enter task center name" />
            </Form.Item>
            <Form.Item
                label="Inspection"
                name="isInspection"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === "create" ? "Create" : "Update"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TaskCenterForm;