import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Create = ({ setTodos, todos }) => {
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        const trimmedTask = task.trim();

        if (!trimmedTask) {
            toast.error("Task cannot be empty");
            return;
        }

        if (todos.some((todo) => todo.task === trimmedTask)) {
            toast.warn("Task already exists");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:4000/add", { task: trimmedTask });
            const newTodo = res.data;
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setTask("");
            toast.success("Todo added successfully");
        } catch (err) {
            console.error("Error adding todo:", err);
            toast.error("Failed to add todo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                className="create_input"
                placeholder="Add a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading}
                aria-label="Add a new task"
            />
            <button
                type="button"
                className="create_button"
                onClick={handleAdd}
                disabled={loading}
                aria-label="Add task button"
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </div>
    );
};

export default Create;
