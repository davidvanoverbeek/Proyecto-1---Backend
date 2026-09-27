const { Router } = require("express");
const { createUser, cahngeUserRole, deleteUser } = require("../controllers/user.controller");
const { uploadUser } = require("../../middlewares/cloudinaryUpload");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");

const router = Router();

router.post("/", uploadUser, createUser);
router.patch("/:id/role", verifyToken, isAdmin, cahngeUserRole);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;