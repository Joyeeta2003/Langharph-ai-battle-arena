import express from "express";
import runGraph from "./ai/graph.ai.js";

const app = express();

app.use(express.json());

// Enable CORS for frontend development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "LangGraph AI Battle Arena" });
});

// Run battle endpoint
app.post("/api/arena", async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem || typeof problem !== "string") {
      return res.status(400).json({ error: "A valid 'problem' string is required." });
    }

    console.log(`[Arena] Processing battle problem: "${problem.slice(0, 80)}..."`);
    const result = await runGraph(problem);
    
    // Result schema conforms to:
    // { problem, solution_1, solution_2, judge: { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning } }
    res.json(result);
  } catch (err: any) {
    console.error("[Arena Error]:", err);
    res.status(500).json({ 
      error: err?.message || "Failed to execute AI Battle graph",
      details: String(err)
    });
  }
});

// Legacy root endpoint
app.get("/", async (req, res) => {
  try {
    const result = await runGraph("write an code for factorial function in js");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
