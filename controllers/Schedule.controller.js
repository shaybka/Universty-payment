import cloudinary from "../config/cloudinary.js";
import Bus from "../models/bus.schedule.model.js";

// Register a new Bus schedule
export const registerBusSchedule = async (req, res) => {
  try {
    const { sem, year } = req.body;
    const scheduleFile = req.file; 
    console.log("Received file:", scheduleFile);
    // Validate required fields
    if (!sem || !year || !scheduleFile) {
      return res.status(400).json({
        message: "Semester number, year, and schedule file are required",
      });
    }

    // Upload schedule file to Cloudinary
    let scheduleUrl = "";
    if (scheduleFile) {
      const encodedFile = `data:${scheduleFile.mimetype};base64,${scheduleFile.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(encodedFile, {
        folder: "bus-schedules",
      });
      scheduleUrl = uploadResponse.secure_url;
    }

    // Create a new bus schedule
    const newBusSchedule = new Bus({
      sem: sem,
      year: year,
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