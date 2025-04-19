import express from "express";
import connectDB from "./config/db.js";
import facultyRoutes from "./routes/faculty.routes.js";
import userrouter from "./routes/user.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/faculties", facultyRoutes);
app.use("/api/v1/students", userrouter);


app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
