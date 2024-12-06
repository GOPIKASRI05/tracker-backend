const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://<username>:<password>@cluster0.mongodb.net/habitTracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Habit Schema
const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  frequency: { type: String, default: "daily" },
  progress: { type: Number, default: 0 },
});

const Habit = mongoose.model("Habit", habitSchema);

// CRUD Routes
app.get("/habits", async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

app.post("/habits", async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.status(201).json(habit);
});

app.put("/habits/:id", async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habit);
});

app.delete("/habits/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
