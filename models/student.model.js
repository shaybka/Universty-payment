import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    _id: {
      type: Number,
      required: [true, "Student ID is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+252\d{9}$/, "Phone number must be in the format +252XXXXXXXXX"],
    },
   
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: [true, "Faculty is required"],
    },
    classname:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },verficationCode: {
      type: String,
     
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    codeExpiry: {
      type: Date,
    
    },
  },
  { timestamps: true, _id: false }
);

export default mongoose.model("Student", studentSchema);