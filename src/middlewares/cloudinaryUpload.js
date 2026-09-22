const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "proyecto1-users",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const uploadUser = multer({ storage }).single("image");

module.exports = { uploadUser };