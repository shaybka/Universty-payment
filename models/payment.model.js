import mongoose from "mongoose";
const { Schema } = mongoose;

const feeSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Fee type is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: [0, "Fee amount cannot be negative"],
    },
    isPaid: {
      type: Boolean,
      default: false, 
      
    },
  },
  { _id: false } 
);

const paymentSchema = new Schema(
  {
    studentId: {
      type: Number,
      required: [true, "Student ID is required"],
    },
    fullName: {
      type: String,
      required: [true, "Student full name is required"],
      trim: true,
    },
    departmentName: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["freshman", "sophomore", "junior", "senior"], 
    },
    fees: [feeSchema], 
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);