import express from "express";
import { registerBusSchedule } from "../controllers/Schedule.controller.js";
import upload from "../middleware/upload.js";

const busScheduleRouter = express.Router();

busScheduleRouter.post("/registerBusSchedule", upload.single("scheduleFile"), registerBusSchedule);

export default busScheduleRouter;