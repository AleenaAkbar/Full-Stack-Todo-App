import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending

  // 🔹 fetch todos
  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // 🔹 add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post(
        "/todos",
        { text, dueDate: dueDate || undefined, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data]);
      setText("");
      setDueDate("");
      setPriority("medium");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // 🔹 toggle complete
  const toggleTodo = async (id, completed) => {
    try {
      const res = await api.put(
        `/todos/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // 🔹 delete todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // 🔹 edit todo
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(
        `/todos/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // 🔹 filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  // 🔹 get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 🔹 format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 overflow-hidden">
      {/* Advanced Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Animated gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        
        {/* Multiple animated radial glows */}
        <div className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-gradient-to-r from-indigo-400/30 to-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-r from-fuchsia-400/30 to-pink-400/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[24rem] w-[24rem] rounded-full bg-gradient-to-r from-cyan-400/20 to-indigo-400/15 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-300/40 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-indigo-200/30 rounded-full animate-spin" style={{animationDuration: '20s'}} />
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-fuchsia-200/30 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border border-cyan-200/30 rounded-full animate-spin" style={{animationDuration: '25s'}} />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `
                 radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
               `,
             }}
        />
        
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
             style={{
               backgroundImage:
                 "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\' viewBox=\\'0 0 200 200\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.4\\'/></svg>')",
               backgroundSize: "200px 200px",
             }}
        />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-none border border-transparent bg-gradient-to-r from-indigo-200/20 via-transparent to-fuchsia-200/20 animate-pulse" />
      </div>
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">Todo Pro</h1>

        {/* ✅ Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors border border-white/20"
        >
          Logout
        </button>
      </div>

      {/* Todo Form */}
      <div className="w-full max-w-2xl mb-6 bg-white/80 backdrop-blur-xl p-6 shadow-2xl rounded-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
        <form onSubmit={addTodo} className="space-y-4">
          <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
              className="flex-1 border border-gray-200/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
        />
        <button
          type="submit"
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl shadow hover:opacity-90 active:opacity-100 transition"
            >
              Add Task
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200/80 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-200/80 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl transition ${
            filter === "all" ? "bg-indigo-600 text-white shadow" : "bg-white/80 backdrop-blur border border-gray-200/80 text-gray-700 hover:bg-white"
          }`}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl transition ${
            filter === "pending" ? "bg-indigo-600 text-white shadow" : "bg-white/80 backdrop-blur border border-gray-200/80 text-gray-700 hover:bg-white"
          }`}
        >
          Pending ({todos.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-xl transition ${
            filter === "completed" ? "bg-indigo-600 text-white shadow" : "bg-white/80 backdrop-blur border border-gray-200/80 text-gray-700 hover:bg-white"
          }`}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-2xl space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg">
            <div className="text-6xl mb-4">✨</div>
            <div className="text-lg font-medium">
            {filter === "all" ? "No todos yet. Add one above!" : 
             filter === "completed" ? "No completed todos yet." : 
             "No pending todos. Great job!"}
            </div>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
            key={todo._id}
              className={`bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border border-white/30 ${
                todo.completed ? "opacity-75" : ""
              }`}
            >
              {editingId === todo._id ? (
                // Edit Mode
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border border-gray-200/80 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id, todo.completed)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span
                        className={`cursor-pointer ${
                          todo.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                        onClick={() => toggleTodo(todo._id, todo.completed)}
            >
              {todo.text}
            </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 ml-8">
                      {todo.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                          {todo.priority.toUpperCase()}
                        </span>
                      )}
                      {todo.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Edit"
                    >
                      ✏️
                    </button>
            <button
              onClick={() => deleteTodo(todo._id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete"
            >
                      🗑️
            </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
