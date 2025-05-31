
import Payment from "../models/payment.model.js";
import axios from "axios";
import { SIFALO_PASSWORD, SIFALO_USERNAME } from "../config/config.js";

export const processPayment = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      department,
      phoneNumber,
      type,
      amount,
      semesterNumber,
    } = req.body;

    
    if (
      !studentId ||
      !fullName ||
      !department ||
      !phoneNumber ||
      !type ||
      !amount
    ) {
      return res
        .status(400)
        .json({ message: "All payment and fee fields are required" });
    }

    
    const feeObject = { type, amount, isPaid: false };

   
    if (type === "semesterFee") {
      if (semesterNumber === undefined || semesterNumber === null) {
        return res
          .status(400)
          .json({ message: "Semester number is required for semester fee" });
      }
      feeObject.semesterNumber = semesterNumber;
    }

    
    const fees = [feeObject];

    
    let paymentGateway = "";
    if (
      phoneNumber.startsWith("90") ||
      phoneNumber.startsWith("61") ||
      phoneNumber.startsWith("63")
    ) {
      paymentGateway = "waafi";
    } else {
      paymentGateway = "edahab";
    }

    
    const payload = {
      account: phoneNumber,
      gateway: paymentGateway,
      amount: amount.toString(),
      currency: "USD", // fixed currency as USD
      order_id: `ORDER-${Date.now()}`,
    };

    console.log("Sending payload to Sifalo Pay:", payload);

    let sifaloResponse;
    try {
      sifaloResponse = await axios.post(
        "https://api.sifalopay.com/gateway/",
        payload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${SIFALO_USERNAME}:${SIFALO_PASSWORD}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (axiosError) {
      console.error("Error sending payload to Sifalo Pay:", axiosError);
      return res.status(500).json({
        message: "Error communicating with Sifalo Pay",
        error: axiosError.message,
      });
    }

    // Check Sifalo's response code
    if (sifaloResponse.data.code === "601") {
      feeObject.isPaid = true;
      const newPayment = new Payment({
        studentId,
        fullName,
        department,
        phoneNumber,
        fees,
      });
      await newPayment.save();
      return res.status(201).json({
        message: sifaloResponse.data.response,
        payment: newPayment,
        sifaloResponse: sifaloResponse.data,
      });
    } else {
      // For non-success responses (603, 604, 600)
      return res.status(400).json({
        message: sifaloResponse.data.response,
        code: sifaloResponse.data.code,
      });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getMyAllPayments = async (req, res) => {
  try {
    let { studentId } = req.params;

   
    studentId = Number(studentId);

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Use aggregation to join the department name from the faculties collection.
    const payments = await Payment.aggregate([
      { $match: { studentId } },
      {
        $lookup: {
          from: "faculties",
          let: { deptId: "$department" },
          pipeline: [
            { $unwind: "$departments" },
            { $match: { $expr: { $eq: ["$departments._id", "$$deptId"] } } },
            { $project: { "departments.name": 1, _id: 0 } },
          ],
          as: "facultyDept",
        },
      },
      {
        $addFields: {
          departmentName: {
            $arrayElemAt: ["$facultyDept.departments.name", 0],
          },
        },
      },
      {
        $project: { facultyDept: 0 },
      },
    ]);

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this student" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
