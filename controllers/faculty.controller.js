import Faculty from "../models/faculties.model.js";

//create faculty
export const createFaculty = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const newFaculty = new Faculty({ name });
    const savedFaculty = await newFaculty.save();

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: savedFaculty,
    });
  } catch (error) {
    console.error("Error creating faculty:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Add a department to a faculty and semester fee
export const addDepartmentToFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name, semesterFee, semesters } = req.body;

    if (!name || semesterFee === undefined || semesters === undefined) {
      return res
        .status(400)
        .json({ message: "Department name, semester fee, and number of semesters are required" });
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    // Check if the department already exists
    if (faculty.departments.some(dept => dept.name === name)) {
      return res.status(400).json({ message: "Department already exists" }); 
    }

    const newDepartment = { name, semesterFee, semesters };
    faculty.departments.push(newDepartment);
    await faculty.save();

    const addedDept = faculty.departments[faculty.departments.length - 1];

    res.status(200).json({
      message: "Department added successfully",
      department: addedDept,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Faculty.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getDepartmentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params; 
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (faculty.departments.length === 0) {
      return res.status(404).json({ message: "No departments found for this faculty" });
    }

    res.status(200).json(faculty.departments);
  } catch (error) {
    console.error("Error fetching departments by faculty:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



//get department semester fee

export const getDepartmentSemesterFee = async (req, res) => {
  try {
    const { facultyId, departmentId } = req.params;
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    const department = faculty.departments.id(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    if (department.semesterFee === undefined) {
      return res.status(404).json({ message: "Semester fee not found" });
    }
    const response = {
      value: department.semesterFee,
      type: "semesterFee",
    };

    res.status(200).json({ message: "Department fee fetched successfully", response });

  }
  catch(error) {
    console.error("Error fetching department semester fee:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}