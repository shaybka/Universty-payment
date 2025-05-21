import express from "express";
import { checkAuth, loginStudent, registerStudent, requestVerificationCode } from "../controllers/student.controller.js";
import { authenticateToken } from "../middleware/verify.js";

const userrouter = express.Router();

// Routes
userrouter.post("/", registerStudent); 
userrouter.post("/request-verification-code", requestVerificationCode); 
userrouter.post("/login", loginStudent); 
userrouter.get("/check-auth",authenticateToken,checkAuth)


export default userrouter;