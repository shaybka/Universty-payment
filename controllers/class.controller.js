import Class from "../models/classes.model.js";
import cloudinary from "../config/cloudinary.js"; 

// Register a single class
export const registerClass = async (req, res) => {
  try {
    const { departmentId, semNum, yearOfStudy, className } = req.body;
    const classScheduleFile = req.file; 

    // Validate required fields
    if (!departmentId || !semNum || !yearOfStudy || !className || !classScheduleFile) {
      return res.status(400).json({
        message: "Department ID, semester number, year of study, class name, and class schedule file are required",
      });
    }

    // Upload class schedule file to Cloudinary
    let classScheduleUrl = "";
    if (classScheduleFile) {
      const encodedFile = `data:${classScheduleFile.mimetype};base64,${classScheduleFile.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(encodedFile, {
        folder: "class-schedules",
      });
      classScheduleUrl = uploadResponse.secure_url;
    }

    // Create a new class
    const newClass = new Class({
      departmentId,
      semNum,
      yearOfStudy,
      className,
      classSchedule: classScheduleUrl, 
    });

    const savedClass = await newClass.save();

    res.status(201).json({
      message: "Class registered successfully",
      class: savedClass,
    });
  } catch (error) {
    console.error("Error registering class:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// update a class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params; 
    const { departmentId, semNum, yearOfStudy, className } = req.body;
    const classScheduleFile = req.file; 

    // Find the class by ID
    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Upload new class schedule file to Cloudinary if provided
    let classScheduleUrl = existingClass.classSchedule; 
    if (classScheduleFile) {
      const encodedFile = `data:${classScheduleFile.mimetype};base64,${classScheduleFile.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(encodedFile, {
        folder: "class-schedules",
      });
      classScheduleUrl = uploadResponse.secure_url;
    }

    // Update class details
    existingClass.departmentId = departmentId || existingClass.departmentId;
    existingClass.semNum = semNum || existingClass.semNum;
    existingClass.yearOfStudy = yearOfStudy || existingClass.yearOfStudy;
    existingClass.className = className || existingClass.className;
    existingClass.classSchedule = classScheduleUrl;

    const updatedClass = await existingClass.save();

    res.status(200).json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// delete a class

export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params; 
        // Find and delete the class by ID
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
        return res.status(404).json({ message: "Class not found" });
        }
    
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// get specific departments classes

export const getClassesByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const classes = await Class.find({ departmentId });
    if (classes.length === 0) {
      return res.status(404).json({ message: "No classes found for this department" });
    }
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes by department:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}