import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/healthcarepro";

export const connectDB = async () => {
  try {
    // Set mongoose options for better connection handling
    mongoose.set("strictQuery", false);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📂 Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n🔧 Local MongoDB Connection Issue:");
      console.log("Please make sure MongoDB is installed and running:");
      console.log(
        "1. Check if MongoDB service is running: sudo systemctl status mongod"
      );
      console.log("2. Start MongoDB service: sudo systemctl start mongod");
      console.log("3. Or install MongoDB: sudo apt-get install mongodb");
    } else if (error.message.includes("Authentication failed")) {
      console.log("\n🔐 Authentication Issue:");
      console.log("Please check your MongoDB credentials in .env file");
    } else if (error.message.includes("network")) {
      console.log("\n🌐 Network Issue:");
      console.log("Please check your internet connection for MongoDB Atlas");
    }

    process.exit(1);
  }
};
