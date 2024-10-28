"use client";
import { useState, useEffect } from "react";
interface Todo {
  _id: string;
  title: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
const [todos, setTodos] = useState<Todo[]>([]);

  const [loading, setLoading] = useState(false);

  // Fetch todos from the API
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/get-todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Call the fetchTodos function on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle form submission to add a new todo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) return alert("Title is required!");

    try {
      setLoading(true);
      const response = await fetch("/api/add-todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error("Failed to add todo");
      setTitle(""); // Clear the input field
      await fetchTodos(); // Fetch updated list of todos
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>

      {/* Form to add a new todo */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          className="border p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>

      {/* Display list of todos */}
      <ul className="list-disc pl-6">
        {todos.map((todo) => (
          <li key={todo._id} className="mb-2">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
