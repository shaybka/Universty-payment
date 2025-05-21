import express from "express";
import { depreciateBusSchedule, getBusSchedule, registerBusSchedule } from "../controllers/Schedule.controller.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/verify.js";

const busScheduleRouter = express.Router();

busScheduleRouter.post("/registerBusSchedule", upload.single("scheduleFile"), registerBusSchedule);
busScheduleRouter.get("/getBusSchedule",authenticateToken,getBusSchedule)
busScheduleRouter.put("/depriciateBusSchedule/:id",depreciateBusSchedule);
export default busScheduleRouter;