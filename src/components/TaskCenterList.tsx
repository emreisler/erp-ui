import {useEffect, useState} from "react";

const TaskCenterList: React.FC = () => {

    const [taskCenters, setTaskCenters] = useState<TaskCenter[]>([]);

    useEffect(() => {
        const fetchTaskCenters = async () => {
            try {
                const response = await fetch("http://localhost:8081/v1/task-center");
                const json = await response.json();
                setTaskCenters(json);
            } catch (err) {
                console.log(err);
            }
        }
        fetchTaskCenters();
    }, [])

    const handleCreate = () => {

    }

    return (
        <div>
            <h1>Task Centers</h1>
            <ul className="task-center-list">
                {taskCenters.map((taskCenter) => (
                    <li key={taskCenter.number}> {taskCenter.number} - {taskCenter.name}</li>
                ))}
            </ul>
            <button onClick={handleCreate}> Create</button>
        </div>
    )
}

export default TaskCenterList;