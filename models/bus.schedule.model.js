import mongoose from "mongoose";
const { Schema } = mongoose;

const busSchema = new Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    sem:{
      type: Number,
      required: [true, "Semester is required"],
    },
    Schedule: {
      type: String,
      required: [true, " Schedule URL is required"],
    },
    isActive:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bus", busSchema);
