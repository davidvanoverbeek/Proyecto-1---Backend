const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ Conectando con la BBDD`);
    } catch (error) {
        console.error("❌ Error al conectar con la BBDD", error.message);
    }
};

module.exports = connect;