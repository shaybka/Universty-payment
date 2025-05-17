import express from "express";
import {
  createFaculty,
  addDepartmentToFaculty,
  getAllFaculties,
  getFacultyById,
  deleteFaculty,
  getDepartmentsByFaculty,
} from "../controllers/faculty.controller.js";

const router = express.Router();

// Routes
router.post("/", createFaculty); 
router.post("/:facultyId/departments", addDepartmentToFaculty); 
router.get("/", getAllFaculties); 
router.get("/:id", getFacultyById); 
router.delete("/:id", deleteFaculty); 
router.get("/departments/:facultyId", getDepartmentsByFaculty);

export default router;