import { Router } from "express";
import {
  getStudyTime,
  saveStudyTime,
  resetStudyTime,
  deduceStudyTime,
  getSettings,
  saveSettings,
  getTotalTime,
  getWeekData,
} from "../controllers/studyTimeController.js";

const router = Router();

router.get("/:userId", getStudyTime); // GET  — busca o tempo do dia
router.post("/:userId", saveStudyTime); // POST — salva o tempo
router.delete("/:userId", resetStudyTime); // DELETE — zera o dia
router.patch("/:userId/deduce", deduceStudyTime); // PATCH — deduz minutos
router.get("/settings/:userId", getSettings);
router.post("/settings/:userId", saveSettings);
router.get("/:userId/total", getTotalTime);
router.get("/:userId/week", getWeekData);

export default router;
