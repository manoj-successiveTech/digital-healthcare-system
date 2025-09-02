import bcrypt from "bcryptjs";
import { connectDB } from "./src/config/db.js";
import User from "./src/models/User.js";

const addDoctorUser = async () => {
  try {
    console.log("🔧 Adding doctor user to database...");

    await connectDB();
    console.log("✅ Connected to database");

    // Check if doctor already exists
    const existingDoctor = await User.findOne({
      email: "doctor@healthcarepro.com",
    });

    if (existingDoctor) {
      console.log("✅ Doctor user already exists in database");
      console.log("==========================================");
      console.log("📧 Email: doctor@healthcarepro.com");
      console.log("🔑 Password: doctor123");
      console.log("👤 User Type: doctor");
      console.log("==========================================");
      process.exit(0);
    }

    // Create password hash
    const hashedPassword = await bcrypt.hash("doctor123", 12);

    // Create doctor user
    const doctorUser = new User({
      firstName: "Dr. John",
      lastName: "Smith",
      email: "doctor@healthcarepro.com",
      password: hashedPassword,
      userType: "doctor",
      phoneNumber: "9876543210",
      dateOfBirth: new Date("1985-01-01"),
      address: {
        street: "123 Medical Street",
        city: "Healthcare City",
        state: "HC",
        zipCode: "12345",
        country: "USA",
      },
      specialization: "General Medicine",
      isActive: true,
      isVerified: true,
    });

    await doctorUser.save();

    console.log("✅ Doctor user created successfully!");
    console.log("==========================================");
    console.log("📧 Email: doctor@healthcarepro.com");
    console.log("🔑 Password: doctor123");
    console.log("👤 User Type: doctor");
    console.log("🏥 Specialization: General Medicine");
    console.log("==========================================");
    console.log("💡 You can now login as doctor using these credentials");
  } catch (error) {
    console.error("❌ Error adding doctor:", error.message);
  } finally {
    process.exit(0);
  }
};

addDoctorUser();
