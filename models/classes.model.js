import mongoose from "mongoose";
const { Schema } = mongoose;

const classesSchema = new Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department ID is required"],
    },
    semNum: {
      type: Number,
      required: [true, "semister Numberis required "],
    },
    yearOfStudy: {
      type: Number,
      required: [true, "Academic year is required"],
      min: [2000, "Enter a valid year"],
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    classSchedule: {
      type: String,
      required: [true, "Class schedule is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classesSchema);
