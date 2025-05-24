import mongoose from "mongoose";

const fixedPaymentsSchema = new mongoose.Schema({
  typeOfPayment: {
    type: String,
    required: true,
    enum: ["englishFee", "graduationFee"],
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const FixedPayment = mongoose.model("FixedPayment", fixedPaymentsSchema);
export default FixedPayment;