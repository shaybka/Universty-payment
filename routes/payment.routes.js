import express from "express";
import { getMyAllPayments, processPayment } from "../controllers/payment.controller.js";
import { authenticateToken } from "../middleware/verify.js";

const processPaymentRouter = express.Router();

processPaymentRouter.post("/paymoney", authenticateToken,processPayment);
processPaymentRouter.get("/myPaymentHistory/:studentId", authenticateToken,getMyAllPayments);

export default processPaymentRouter;
