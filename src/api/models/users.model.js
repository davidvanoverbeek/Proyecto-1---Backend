const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, trim: true, required: true, unique: true },
        email: { type: String, trim: true, required: true, unique: true },
        password: {
            type:String,
            trim: true,
            required: true,
            minlength: [
                8,
                "La contraseña tiene que tener un minimo de 8 caracteres de longitud",
            ],
        },
        role: { type: String, enum: ["user", "admin"], defalult: "user" },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        relatedData: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Productos"
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next(); 
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;