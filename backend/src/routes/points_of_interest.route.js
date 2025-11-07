import express from "express";
import { getPointsOfInterest, createPointsOfInterest, deletePointOfInterest} from "../controllers/points_of_interest.controller.js";


const router = express.Router();

router.get("/", getPointsOfInterest);
router.post("/", createPointsOfInterest);
router.delete("/:id", deletePointOfInterest);

export default router;