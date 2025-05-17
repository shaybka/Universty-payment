import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage,
    limits: {
        fileSize: 1024 * 1024 * 5, //the size of the file is limited to 5MB
    },
 });


export default upload;