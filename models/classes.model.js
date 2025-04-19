import mongoose from "mongoose";
const { Schema } = mongoose;

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    schedule: {
      type: String,
      required: [true, "Schedule is required"],
    },
  },
  { _id: true }
);

const classesSchema = new Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department ID is required"],
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["freshman", "sophomore", "junior", "senior"],
    },
    classes: [classSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classesSchema);
