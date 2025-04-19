import mongoose from "mongoose";
const { Schema } = mongoose;

const busSchema = new Schema(
  {
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bus", busSchema);
