import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

export const SIFALO_USERNAME = process.env.SIFALO_USERNAME;
export const SIFALO_PASSWORD = process.env.SIFALO_PASSWORD;