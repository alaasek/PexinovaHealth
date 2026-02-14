import { Router } from "express";
import { MedicationController } from "../controllers/medication.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new MedicationController();

router.post("/", authMiddleware, (req,res)=>controller.create(req,res));
router.get("/", authMiddleware, (req,res)=>controller.getAll(req,res));
router.delete("/:id", authMiddleware, (req,res)=>controller.delete(req,res));

export default router;
