import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authenticateToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }
    // Attach the decoded token to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Request is not authorized" });
  }
};