import express from "express";
import { deleteClass, getAllClasses, getClassesByDepartment, getMyClassSchedule, registerClass, updateClass } from "../controllers/class.controller.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/verify.js";


const classRouter = express.Router();

// Routes
classRouter.post("/registerclass",upload.single('classScheduleFile'),registerClass ); 
classRouter.put("/updateclass/:id",upload.single('classScheduleFile'),updateClass ); 
classRouter.delete("/deleteClass/:id",deleteClass ); 
classRouter.get("/getclasses",getAllClasses ); 
classRouter.get("/departmentclasses/:departmentId",getClassesByDepartment ); 
classRouter.get("/classSchedule/:classId",authenticateToken,getMyClassSchedule)



export default classRouter;