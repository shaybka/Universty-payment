import Student from "../models/student.model.js";
import { generateVerficationCode } from "../utils/generateVerfictaionCode.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import whatsappClient from "../utils/whatsappClient.js";

//  function to send WhatsApp messages
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const formattedPhone = phoneNumber.replace("+", "");

    // Ensure the WhatsApp client is ready
    if (!whatsappClient.info || !whatsappClient.info.wid) {
      throw new Error("WhatsApp client is not ready");
    }

    await whatsappClient.sendMessage(`${formattedPhone}@c.us`, message);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
    throw new Error("Failed to send WhatsApp message");
  }
};

//  function to handle errors
const handleError = (res, error, message = "Internal server error") => {
  console.error(message, error);
  res.status(500).json({ message, error: error.message });
};

// Register a new student
export const registerStudent = async (req, res) => {
  try {
    const {
      _id,
      fullName,
      phoneNumber,
      classname,
      gender,
      department,
      faculty,
    } = req.body;

    // Validate required fields
    if (
      !_id ||
      !fullName ||
      !phoneNumber ||
      !gender ||
      !department ||
      !faculty ||
      !classname
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the student already exists
       const existingStudent = await Student.findOne({ $or: [{ _id }, { phoneNumber }] });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this ID or phone number already exists",
      });
    }

    // Create a new student
    const newStudent = new Student({
      _id,
      fullName,
      phoneNumber,
      gender,
      department,
      classname,
      faculty,
      verficationCode: generateVerficationCode(),
      codeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    });

    const savedStudent = await newStudent.save();

    // Send verification code via WhatsApp
    await sendWhatsAppMessage(
      phoneNumber,
      `Your verification code is ${newStudent.verficationCode}. It expires in 10 minutes.`
    );

    res.status(201).json({
      message:
        "Student registered successfully. Verification code sent via WhatsApp.",
       message:" verification code sent via WhatsApp verify your account",
    });
  } catch (error) {
    handleError(res, error, "Error registering student");
  }
};

// Request a new verification code
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

    // Generate and save new verification code
    student.verficationCode = generateVerficationCode();
    student.codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await student.save();

    // Send verification code via WhatsApp
    await sendWhatsAppMessage(
      phoneNumber,
      `Your verification code is ${student.verficationCode}. It expires in 10 minutes.`
    );

    res.status(200).json({ message: "Verification code sent via WhatsApp" });
  } catch (error) {
    handleError(res, error, "Error sending verification code");
  }
};

// Login a student
export const loginStudent = async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    if (!phoneNumber || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Phone number and verification code are required" });
    }

    const student = await Student.findOne({ phoneNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate verification code and expiry
    if (student.verficationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (student.codeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Update student verification status
    student.isVerified = true;
    student.verficationCode = null; 
    student.codeExpiry = null; 
    await student.save();
    // Generate JWT token
    const token = jwt.sign({ studentId: student._id }, JWT_SECRET, {
      expiresIn: "7d",
    });



    const user ={
      _id: student._id,
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      isVerified: student.isVerified,
      classname: student.classname,

    }

    res.status(200).json({ message: "Login successful", token ,user });
  } catch (error) {
    handleError(res, error, "Error logging in student");
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Ensure the token contains the studentId
    if (!req.user || !req.user.studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // Find the student in the database using the studentId from the token
    const student = await Student.findById(req.user.studentId).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Create a user object with the necessary fields
    const user = {
      _id: student._id,
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      isVerified: student.isVerified,
      classname: student.classname,
    };

    // Respond with user details
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};