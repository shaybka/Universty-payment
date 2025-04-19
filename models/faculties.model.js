import mongoose from "mongoose";
const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: [true, "Department name is required"],
    trim: true,
  },
  semesterFee: {
    type: Number,
    required: [true, "Semester fee is required"],
    min: [0, "Fee cannot be negative"],
  },
}, { _id: true });

const facultySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Faculty name is required"],
      trim: true,
      unique: true,
    },
    departments: [departmentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Faculty", facultySchema);
