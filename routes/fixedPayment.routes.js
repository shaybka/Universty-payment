
import express from "express";
import { createFixedPayment, deleteFixedPayment, getAllFixedPayments, getFixedPaymentById, updateFixedPayment } from "../controllers/fixedPayments.controller.js";
const fixedPaymentRouter = express.Router();


fixedPaymentRouter.post("/", createFixedPayment);
fixedPaymentRouter.get("/", getAllFixedPayments);
fixedPaymentRouter.get("/:id", getFixedPaymentById);
fixedPaymentRouter.delete("/:id", deleteFixedPayment);
fixedPaymentRouter.put("/:id", updateFixedPayment);

export default fixedPaymentRouter;