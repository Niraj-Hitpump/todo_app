import { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";
import {
    BsCircleFill,
    BsFillCheckCircleFill,
    BsFillTrashFill,
} from "react-icons/bs";

const Home = () => {
    const [todos, setTodos] = useState([]); // Initial state set to an empty array
    const [error, setError] = useState(null); // State for tracking errors

    // Fetch todos on component mount
    useEffect(() => {
        axios
            .get("http://localhost:4000/get") // Corrected URL format
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setTodos(res.data); // Set todos if response is an array
                } else {
                    console.error("Unexpected response format:", res.data);
                    setTodos([]); // Fallback to an empty array
                }
            })
            .catch((err) => {
                console.error("Error fetching todos:", err);
                setError("Failed to load todos. Please try again later.");
            });
    }, []);

    // Toggle the `done` status of a todo
    const handleEdit = (id) => {
        axios
            .put(`http://localhost:4000/update/${id}`) // Corrected URL
            .then(() => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === id ? { ...todo, done: !todo.done } : todo
                    )
                );
            })
            .catch((err) => {
                console.error("Error updating todo:", err);
            });
    };

    // Delete a todo
    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:4000/delete/${id}`) // Corrected URL
            .then(() => {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo._id !== id)
                );
            })
            .catch((err) => {
                console.error("Error deleting todo:", err);
            });
    };

    return (
        <div className="home">
            <h2>ToDo List</h2>
            <Create setTodos={setTodos} todos={todos} />
            {error ? (
                <div className="error">
                    <p>{error}</p>
                </div>
            ) : todos.length === 0 ? (
                <div>
                    <h2>No Records</h2>
                </div>
            ) : (
                todos.map((todo, index) => (
                    <div key={todo._id || index} className="task">
                        <div
                            className="checkbox"
                            onClick={() => handleEdit(todo._id)}
                        >
                            {todo.done ? (
                                <BsFillCheckCircleFill className="icon" />
                            ) : (
                                <BsCircleFill className="icon" />
                            )}
                            <p className={todo.done ? "line-through" : ""}>
                                {todo.task}
                            </p>
                        </div>
                        <div>
                            <span>
                                <BsFillTrashFill
                                    className="icon"
                                    onClick={() => handleDelete(todo._id)}
                                />
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
