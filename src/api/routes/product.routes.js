const { Router } = require("express");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const { uploadUser } = require("../../middlewares/cloudinaryUpload");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, isAdmin, uploadUser, createProduct);
router.patch("/:id", verifyToken, isAdmin, uploadUser, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
