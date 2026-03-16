import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import studyTimeRoutes from "./src/routes/studyTime.js";

import { existsSync } from "fs";
if (existsSync(".env")) {
  dotenv.config();
}

//dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pomo-flow-alan.vercel.app"],
  }),
);

app.use(express.json());
app.get("/health", (req, res) => res.json({ status: "ok" }));

//app.use("/api/study-time", studyTimeRoutes);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
