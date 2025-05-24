import FixedPayment from "../models/fixedPayments.model.js";

// Create a new fixed payment
export const createFixedPayment = async (req, res) => {
  try {
    const { typeOfPayment, amount } = req.body;
    console.log("Received data:", req.body);
    console.log("Type of payment:", typeOfPayment);
    console.log("Amount:", amount);

    if (!typeOfPayment || !amount) {
      return res
        .status(400)
        .json({ message: "Type of payment and amount are required" });
    }

    const newFixedPayment = new FixedPayment({ typeOfPayment, amount });
    const savedFixedPayment = await newFixedPayment.save();

    res.status(201).json({
      message: "Fixed payment created successfully",
      fixedPayment: savedFixedPayment,
    });
  } catch (error) {
    console.error("Error creating fixed payment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//get all fixed payments

export const getAllFixedPayments = async (req, res) => {
  try {
    const fixedPayments = await FixedPayment.find();
    res.status(200).json({
      message: "Fixed payments retrieved successfully",
      fixedPayments,
    });
  } catch (error) {
    console.error("Error retrieving fixed payments:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// get specific fixed payment by id
export const getFixedPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const fixedPayment = await FixedPayment.findById(id);
    if (!fixedPayment) {
      return res.status(404).json({ message: "Fixed payment not found" });
    }
    const response = {
      typeOfPayment: fixedPayment.typeOfPayment,
      amount: fixedPayment.amount,
    };

    res.status(200).json({
      message: "Fixed payment retrieved successfully",
      response,
    });
  } catch (error) {
    console.error("Error retrieving fixed payment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//delete fixed payment
export const deleteFixedPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFixedPayment = await FixedPayment.findByIdAndDelete(id);
    if (!deletedFixedPayment) {
      return res.status(404).json({ message: "Fixed payment not found" });
    }
    res.status(200).json({
      message: "Fixed payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fixed payment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


// update fixed payment
export const updateFixedPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { typeOfPayment, amount } = req.body;

    const updatedFixedPayment = await FixedPayment.findByIdAndUpdate(
      id,
      { typeOfPayment, amount },
      { new: true }
    );

    if (!updatedFixedPayment) {
      return res.status(404).json({ message: "Fixed payment not found" });
    }

    res.status(200).json({
      message: "Fixed payment updated successfully",
      fixedPayment: updatedFixedPayment,
    });
  } catch (error) {
    console.error("Error updating fixed payment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};