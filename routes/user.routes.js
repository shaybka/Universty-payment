import express from "express";
import { loginStudent, registerStudent, requestVerificationCode } from "../controllers/student.controller.js";

const userrouter = express.Router();

// Routes
userrouter.post("/", registerStudent); 
userrouter.post("/request-verification-code", requestVerificationCode); 
userrouter.post("/login", loginStudent); 


export default userrouter;