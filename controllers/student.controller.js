import Student from "../models/student.model.js";
import { generateVerficationCode } from "../utils/generateVerfictaionCode.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import whatsappClient from "../utils/whatsappClient.js";

export const registerStudent = async (req, res) => {
  try {
    const { _id, fullName, phoneNumber, gender, department, faculty } =
      req.body;

    // Validate required fields
    if (
      !_id ||
      !fullName ||
      !phoneNumber ||
      !gender ||
      !department ||
      !faculty
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStudent = new Student({
      _id,
      fullName,
      phoneNumber,
      gender,
      department,
      faculty,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({
      message: "Student registered successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const requestVerificationCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const student = await Student.findOne({ phoneNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const newCode = generateVerficationCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    student.verficationCode = newCode;
    student.codeExpiry = codeExpiry;
    await student.save();
    const formattedPhone = phoneNumber.replace("+", "");
    await whatsappClient.sendMessage(
      `${formattedPhone}@c.us`,
      `Your verification code is ${newCode}. It expires in 10 minutes.`
    );
    res.status(200).json({ message: "Verification code sent via WhatsApp" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    if (!phoneNumber || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Phone number and verification code are required" });
    }

    // Find the student by phone number
    const student = await Student.findOne({ phoneNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate verification code and check code expiry
    if (student.verficationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (student.codeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Generate JWT token once verification is successful
    const token = jwt.sign({ studentId: student._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in student:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
