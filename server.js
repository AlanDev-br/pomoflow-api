import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studyTimeRoutes from "./src/routes/studyTime.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pomo-flow-alan.vercel.app"],
  }),
);

app.use(express.json());
app.use("/api/study-time", studyTimeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
