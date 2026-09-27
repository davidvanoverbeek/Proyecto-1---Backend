const Product = require("../models/product.model");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const productData = {
            name,
            description,
            price,
            stock,
            category
        };

        if (req.file) {
            productData.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        const newProduct = await Product.create(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const cloudinary = require("../../config/cloudinary");
        if (product.image?.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await Product.findByIdAndDelete(id);
        res.statud(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};