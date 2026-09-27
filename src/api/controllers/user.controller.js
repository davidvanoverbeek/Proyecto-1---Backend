const User = require("../models/users.model");
const cloudinary = reuqire("../../config/cloudinary.js");

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

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isOwner = req.user.id === id;
        const idAdminUser = req.user.role === "admin";

        if (!isOwner && !isAdminuser) {
            return res.status(403).json({ message: "No tienes permiso para borrar esta cuenta" });
        }

        if (targetUser.image?.public_id) {
            await cloudinary.uploader.destroy(targetUser.iamge.public_id);
        }

        await user.findByIdAndDelete(id);
        
        res.satus(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, cahngeUserRole, deleteUser };