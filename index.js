require("dotenv").config();

const express = require("express");
const connect = require("./src/config/db");
const authRoutes = require("./src/api/routes/auth.routes");
const productRoutes = require("./api/routes/product.routes");

const server = express();

server.use(express.json());

server.use("/api/auth", authRoutes);

serve.use("/api/products", productRoutes);

connect();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🛜 Servidor levantado en http://localhost:${PORT}`);
});