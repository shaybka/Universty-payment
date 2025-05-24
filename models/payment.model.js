import mongoose from "mongoose";
const { Schema } = mongoose;

const feeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["english", "semesterFee", "graduation"], 
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    semesterNumber: {
      type: Number,
      min: 1,
      validate: {
        validator: function (value) {
          // Check for semesterFee type
          if (this.type === "semesterFee" && (value === undefined || value === null)) {
            return false;
          }
          return true;
        },
        message: "Semester number is required for semester fees",
      },
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
    department: {
      type: Schema.Types.ObjectId,
      required: [true, "Department is required"],
      ref: "Department",
    },
    fees: [feeSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);