import { useState, useEffect, FormEvent } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    const res = await axios.get<Task[]>(`${API}/api/tasks`);
    setTasks(res.data);
    setLoading(false);
  };

  const addTask = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) return;

    const res = await axios.post<Task>(`${API}/api/tasks`, {
      title,
    });

    setTasks([res.data, ...tasks]);
    setTitle("");
  };

  const toggleTask = async (id: number): Promise<void> => {
    const res = await axios.patch<Task>(`${API}/api/tasks/${id}/toggle`);

    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id: number): Promise<void> => {
    await axios.delete(`${API}/api/tasks/${id}`);

    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <h1>📝 Task Manager</h1>

      <form
        onSubmit={addTask}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: 16,
          }}
        />

        <button type="submit" style={{ padding: "8px 16px" }}>
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
          }}
        >
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#999" : "#000",
                }}
              >
                {task.title}
              </span>

              <button onClick={() => deleteTask(task.id)}>🗑</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
