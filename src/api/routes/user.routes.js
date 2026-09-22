const { Router } = require("express");
const { createUser } = require("../controllers/user.controller");
const { uploadUser } = require("../../middlewares/cloudinaryUpload");

const router = Router();

router.post("/", uploadUser, createUser);

module.exports = router;