const User = require("../models/users.model");
const cloudinary = require("../../config/cloudinary.js");
const Product = require("../models/product.model")

const createUser = async (req,res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(409).json({ message: "El usuario o email ya existe" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "La imagen es obligatoria" });
        }

        const newUser = await User.create({
            username,
            email,
            password,
            role: "user",
            image: {
                url: req.file.path,
                public_id: req.file.filename,
            },
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cahngeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "rol no valido" });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true },
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).jsonm({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").populate("favorites");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("favorites");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const isOwner = req.user.id === id;
        if (!isOwner) {
            return res.status(403).json({
                message: "Solo puedes actualizar tu propia cuenta",
            });
        }

        const { username, email, password } = req.body;
        const updateData = { username, email, password };

        if (req.file) {
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key],
        );

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        Object.assign(targetUser, updateData);
        await targetUser.save();

        const userResponse = targetUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isOwner = req.user.id === id;
        const isAdminUser = req.user.role === "admin";

        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: "No tienes permiso para borrar esta cuenta" });
        }

        if (targetUser.image?.public_id) {
            const publicId = targetUser.image && targetUser.image.public_id;
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            };
        }

        await User.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: productId} },
            { new: true},
        )
            .select("-password")
            .populate("favorites");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: productId } },
            { new: true },
        )
            .select("-password")
            .populate("favorites");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser, 
    cahngeUserRole,
    getUsers,
    getUserById,
    updateUser, 
    deleteUser, 
    addFavorite,
    removeFavorite,    
};