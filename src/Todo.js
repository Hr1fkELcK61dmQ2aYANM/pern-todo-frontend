import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data } = await axios.get(`${API_URL}/todos`);
    setTodos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editTodo) {
      await axios.put(`${API_URL}/todos/${editTodo.todo_id}`, {
        description,
        completed: editTodo.completed,
      });
    } else {
      await axios.post(`${API_URL}/todos`, { description });
    }
    setDescription("");
    setEditTodo(null);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API_URL}/todos/${todo.todo_id}`, {
      description: todo.description,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add new todo"
          required
        />
        <button type="submit">{editTodo ? "Update" : "Add"}</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.todo_id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(todo)}>{todo.description}</span>
            <div>
              <button
                onClick={() => {
                  setDescription(todo.description);
                  setEditTodo(todo);
                }}
              >
                Edit
              </button>
              <button onClick={() => deleteTodo(todo.todo_id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;