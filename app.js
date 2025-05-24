import express from "express";
import connectDB from "./config/db.js";
import facultyRoutes from "./routes/faculty.routes.js";
import userrouter from "./routes/user.routes.js";
import classRouter from "./routes/class.routes.js";
import busScheduleRouter from "./routes/busSchedule.routes.js";
import fixedPaymentRouter from "./routes/fixedPayment.routes.js";
import processPaymentRouter from "./routes/payment.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/faculties", facultyRoutes);
app.use("/api/v1/students", userrouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/busSchedules",busScheduleRouter);
app.use("/api/v1/fixedPaymentRouter",fixedPaymentRouter)
app.use("/api/v1/processPaymentRouter",processPaymentRouter)


app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
