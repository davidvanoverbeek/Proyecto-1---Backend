const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../api/models/product.model");

const products = [
    {
        name: "camiseta basica",
        description: "Camiseta de algodon 100%, corte regular",
        price: 14.99,
        stock: 50,
        category: "ropa",
    },
    {
        name: "Zapatillas running",
        description: "Zapatillas ligeras para entrenamiento diario",
        price: 59.99,
        stock: 20,
        category: "calzado",
    },
    {
        name: "Mochila urbana",
        description: "Mochila resistente al agua con compartimento para portátil",
        price: 39.99,
        stock: 15,
        category: "accesorios",
    },
    {
        name: "Auriculares inalámbricos",
        description: "Auriculares bluetooth con cancelación de ruido",
        price: 79.99,
        stock: 30,
        category: "electrónica",
    },
    {
        name: "Botella térmica",
        description: "Botella de acero inoxidable, mantiene la temperatura 12h",
        price: 19.99,
        stock: 40,
        category: "accesorios",
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectando a MongoDB");

        await Product.deleteMany();
        console.log("Productos anteriores eliminados");

        await Product.insertMany(products);
        console.log("Productos insertados correctamente");

        process.exit(0);
    } catch (error) {
        console.error("Error en el seeder: ", error.message);
        process.exit(1);
    }
};

seedProducts();