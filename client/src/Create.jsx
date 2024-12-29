import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Create = ({ setTodos, todos }) => {
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to handle adding a task
    const handleAdd = () => {
        if (!task.trim()) {
            toast.error("Task cannot be empty");
            return;
        }

        // Truncate task if longer than 30 characters
        const truncatedTask = task.length > 30 ? task.substring(0, 30) + "..." : task;

        setLoading(true);

        axios
            .post("http://localhost:4000/add", { task: truncatedTask })
            .then((res) => {
                setTodos([...todos, { _id: res.data._id, task: truncatedTask, done: false }]);
                setTask(""); // Clear input after adding
                toast.success("Todo added successfully");
            })
            .catch((err) => {
                console.error("Error adding todo:", err);
                toast.error("Failed to add todo. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <input
                type="text"
                className="create_input"
                placeholder="Add a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading} // Disable input while loading
            />
            <button
                type="button"
                className="create_button"
                onClick={handleAdd}
                disabled={loading} // Disable button during loading
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </div>
    );
};

export default Create;
