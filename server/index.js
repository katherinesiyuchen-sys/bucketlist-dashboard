import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import goalsRoutes from "./routes/goals.js";
import badgesRoutes from "./routes/badges.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/badges", badgesRoutes);

app.get("/", (_, res) => res.send("Bucketlist API running"));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
