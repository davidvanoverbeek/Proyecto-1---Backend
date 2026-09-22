const User = require("../models/users.model");

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

module.exports = { createUser, cahngeUserRole };