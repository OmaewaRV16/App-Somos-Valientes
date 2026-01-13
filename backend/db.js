const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    // NO cerramos el proceso en producción
    return null;
  }
};

module.exports = connectDB;
