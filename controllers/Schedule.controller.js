import cloudinary from "../config/cloudinary.js";
import Bus from "../models/bus.schedule.model.js";

// Register a new Bus schedule
export const registerBusSchedule = async (req, res) => {
  try {
    const { sem, year } = req.body;
    const scheduleFile = req.file;

    // Validate required fields
    if (!sem || !year || !scheduleFile) {
      return res.status(400).json({
        message: "Semester number, year, and schedule file are required",
      });
    }

    // Validate file type
    if (scheduleFile.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // Upload schedule file to Cloudinary
    const encodedFile = `data:${scheduleFile.mimetype};base64,${scheduleFile.buffer.toString("base64")}`;
    const uploadResponse = await cloudinary.uploader.upload(encodedFile, {
      folder: "bus-schedules",
    });
    const scheduleUrl = uploadResponse.secure_url;

    // Check if a schedule already exists for the given semester and year
    const existingSchedule = await Bus.findOne({ sem, year });
    if (existingSchedule) {
      // Update the existing schedule
      existingSchedule.Schedule = scheduleUrl;
      const updatedSchedule = await existingSchedule.save();
      return res.status(200).json({
        message: "Bus schedule updated successfully",
        schedule: updatedSchedule,
      });
    }

    // Create a new bus schedule
    const newBusSchedule = new Bus({
      sem,
      year,
      Schedule: scheduleUrl,
    });

    const savedBusSchedule = await newBusSchedule.save();

    res.status(201).json({
      message: "Bus schedule registered successfully",
      schedule: savedBusSchedule,
    });
  } catch (error) {
    console.error("Error registering bus schedule:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};