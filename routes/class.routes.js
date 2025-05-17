import express from "express";
import { deleteClass, getAllClasses, getClassesByDepartment, registerClass, updateClass } from "../controllers/class.controller.js";
import upload from "../middleware/upload.js";

const classRouter = express.Router();

// Routes
classRouter.post("/registerclass",upload.single('classScheduleFile'),registerClass ); 
classRouter.put("/updateclass/:id",upload.single('classScheduleFile'),updateClass ); 
classRouter.delete("/deleteClass/:id",deleteClass ); 
classRouter.get("/getclasses",getAllClasses ); 
classRouter.get("/departmentclasses",getClassesByDepartment ); 



export default classRouter;