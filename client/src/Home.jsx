// Home.jsx
import { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";
import {
    BsCircleFill,
    BsFillCheckCircleFill,
    BsFillTrashFill,
} from "react-icons/bs";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("https://todo-app-god.onrender.com/get")
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setTodos(res.data);
                } else {
                    console.error("Unexpected response format:", res.data);
                    setTodos([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching todos:", err);
                setError("Failed to load todos. Please try again later.");
            });
    }, []);

    const handleEdit = (id) => {
        const todoToUpdate = todos.find((todo) => todo._id === id);
        if (!todoToUpdate) return;

        axios
            .put(`https://todo-app-god.onrender.com/update/${id}`, { task: todoToUpdate.task, done: !todoToUpdate.done })
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === id ? res.data : todo
                    )
                );
            })
            .catch((err) => {
                console.error("Error updating todo:", err);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`https://todo-app-god.onrender.com/delete/${id}`)
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