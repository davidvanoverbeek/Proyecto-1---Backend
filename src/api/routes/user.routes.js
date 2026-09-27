const { Router } = require("express");
const { createUser, cahngeUserRole, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { uploadUser } = require("../../middlewares/cloudinaryUpload");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const { addFavorite, removeFavorite } = require("../controllers/user.controller");
const { verify } = require("jsonwebtoken");

const router = Router();

router.post("/", uploadUser, createUser);
router.patch("/:id/role", verifyToken, isAdmin, cahngeUserRole);
router.delete("/:id", verifyToken, deleteUser);
router.post("/favorites", verifyToken, addFavorite);
router.delete("/favorites/:productId", verifyToken, removeFavorite);
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserById);
router.patch("/:id", verifyToken, uploadUser, updateUser);

module.exports = router;