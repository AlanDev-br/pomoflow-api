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

// rotas específicas primeiro
router.get("/settings/:userId", getSettings);
router.post("/settings/:userId", saveSettings);
router.get("/:userId/total", getTotalTime);
router.get("/:userId/week", getWeekData);
router.patch("/:userId/deduce", deduceStudyTime);

// rotas genéricas por último
router.get("/:userId", getStudyTime);
router.post("/:userId", saveStudyTime);
router.delete("/:userId", resetStudyTime);

export default router;
