const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/todo");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const SECRET = "todoProSecretKey"; // production mein env var use kare

const app = express();
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// -------------------- MongoDB Connect --------------------
// Prefer env var for deployment; fall back to local MongoDB for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo_pro";

// Memory mode to run without MongoDB (for local/testing)
const USE_MEMORY = process.env.USE_MEMORY === '1';
let memory = {
  users: [],
  todos: [],
};

// -------------------- Test Route --------------------
app.get("/", (req, res) => {
  res.send("Hello from Todo Backend 🚀");
});

// -------------------- AUTH ROUTES --------------------

// Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (USE_MEMORY) {
      const exists = memory.users.find(u => u.email === email);
      if (exists) return res.status(400).json({ error: "Email already exists" });
      const id = String(Date.now());
      memory.users.push({ _id: id, name, email, password });
      return res.json({ message: "Signup successful" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    user = new User({ name, email, password });
    await user.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (USE_MEMORY) {
      const user = memory.users.find(u => u.email === email && u.password === password);
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
      const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- TODO ROUTES (AUTHENTICATED) --------------------

// Create Todo
app.post("/todos", auth, async (req, res) => {
  try {
    const { text, dueDate, priority } = req.body;
    if (USE_MEMORY) {
      const todo = {
        _id: String(Date.now()),
        text,
        dueDate: dueDate || null,
        priority: priority || "medium",
        completed: false,
        user: req.user.userId,
        createdAt: new Date().toISOString(),
      };
      memory.todos.push(todo);
      return res.json(todo);
    }
    const todo = new Todo({ text, dueDate, priority, user: req.user.userId });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Todos
app.get("/todos", auth, async (req, res) => {
  try {
    if (USE_MEMORY) {
      const todos = memory.todos
        .filter(t => t.user === req.user.userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(todos);
    }
    const todos = await Todo.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Todo
app.delete("/todos/:id", auth, async (req, res) => {
  try {
    if (USE_MEMORY) {
      const before = memory.todos.length;
      memory.todos = memory.todos.filter(t => !(t._id === req.params.id && t.user === req.user.userId));
      if (memory.todos.length === before) return res.status(404).json({ error: "Todo not found" });
      return res.json({ message: "Todo deleted" });
    }
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Completed
app.put("/todos/:id/toggle", auth, async (req, res) => {
  try {
    if (USE_MEMORY) {
      const todo = memory.todos.find(t => t._id === req.params.id && t.user === req.user.userId);
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      todo.completed = !todo.completed;
      return res.json(todo);
    }
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Todo
app.put("/todos/:id", auth, async (req, res) => {
  try {
    const { text, dueDate, completed, priority } = req.body;
    if (USE_MEMORY) {
      const todo = memory.todos.find(t => t._id === req.params.id && t.user === req.user.userId);
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      if (text !== undefined) todo.text = text;
      if (dueDate !== undefined) todo.dueDate = dueDate;
      if (completed !== undefined) todo.completed = completed;
      if (priority !== undefined) todo.priority = priority;
      return res.json(todo);
    }
    const update = {};
    if (text !== undefined) update.text = text;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (completed !== undefined) update.completed = completed;
    if (priority !== undefined) update.priority = priority;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      update,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 5000; // Railway provides dynamic PORT
console.log("🚀 Starting server...");

// Start server first
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
  console.log("📡 Attempting to connect to MongoDB...");
}).on('error', (err) => {
  console.log("❌ Server error:", err);
});

// Connect to MongoDB after server starts (skip in memory mode)
if (!USE_MEMORY) {
  setTimeout(() => {
    mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => {
        console.log("⚠️ MongoDB Error:", err.message);
        console.log("Server will continue without database connection");
      });
  }, 1000);
} else {
  console.log("🧠 Running in MEMORY mode (no MongoDB). Set USE_MEMORY=0 to disable.");
}
