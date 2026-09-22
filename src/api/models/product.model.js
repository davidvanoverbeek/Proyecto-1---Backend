const mongoos = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        price: {
            type: Number,
            required: true,
            min: [0, "El precio no puede ser negativo"],
        },
        stock: {
            type: Number,
            required: true,
            min: [0, "El stock no puede ser negativo"],
            default: 0.
        },
        category: { type: String, trim: true, required: true },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;