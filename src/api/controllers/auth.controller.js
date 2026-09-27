const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const isMath = await user.comparePassword(password);
        if (!isMath) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };