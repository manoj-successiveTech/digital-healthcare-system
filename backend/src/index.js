import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import getPort from "get-port";
import http from "http";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { requestLogger, rateLimiter } from "./middlewares/auth.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
// GraphQL imports - currently disabled
// import { ApolloServer } from "@apollo/server";
// import { typeDefs } from "./schema/typedefs.js";
// import { resolvers } from "./schema/resolvers.js";

const app = express();

// Dynamic port assignment - will find available port starting from preferred port
const PREFERRED_PORT = parseInt(process.env.PORT) || 5000;

// Simple function to create default admin user for the system
const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists in database
    const existingAdmin = await User.findOne({
      email: "admin@healthcarepro.com",
    });

    if (!existingAdmin) {
      // Create password hash for security
      const hashedPassword = await bcrypt.hash("admin123456", 12);

      // Create new admin user with all required fields
      const adminUser = new User({
        firstName: "Admin",
        lastName: "Healthcare",
        email: "admin@healthcarepro.com",
        password: hashedPassword,
        userType: "admin",
        phoneNumber: "1234567890",
        dateOfBirth: new Date("1990-01-01"),
        address: {
          street: "123 Admin Street",
          city: "Healthcare City",
          state: "HC",
          zipCode: "12345",
          country: "USA",
        },
        specialization: "System Administration",
        isActive: true,
        isVerified: true,
      });

      await adminUser.save();
      console.log("✅ Default admin user created successfully!");
      console.log("📧 Admin Email: admin@healthcarepro.com");
      console.log("🔒 Admin Password: admin123456");
      console.log("👤 User Type: admin");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin user:", error.message);
  }
};

// Setup middleware for the Express app
app.use(requestLogger); // Log all incoming requests
app.use(rateLimiter); // Prevent too many requests from same IP
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow frontend connections
    credentials: true, // Allow cookies and authentication
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(helmet()); // Add security headers to responses
app.use(cookieParser()); // Parse cookies from requests
app.use(bodyParser.json()); // Parse JSON data from requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data from requests

// API Routes - these handle different parts of the application
app.use("/api/auth", authRoutes); // Login, register, logout routes
app.use("/api/users", userRoutes); // User management routes
app.use("/api/appointments", appointmentRoutes); // Appointment booking routes
app.use("/api/dashboard", dashboardRoutes); // Dashboard data routes

// Home route - shows basic server information
app.get("/", (req, res) => {
  res.json({
    message: "HealthcarePro Backend Server is running!",
    version: "1.0.0",
    port: res.locals.serverPort || PREFERRED_PORT,
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      appointments: "/api/appointments",
      dashboard: "/api/dashboard",
    },
    documentation:
      "See API_ROUTES_DOCUMENTATION.md for detailed API documentation",
    adminCredentials: {
      email: "admin@healthcarepro.com",
      password: "admin123456",
      userType: "admin",
    },
  });
});

// Error handling middleware (must be placed after all routes)
app.use(notFound); // Handle 404 errors when route not found
app.use(errorHandler); // Handle all other errors

// Start the server with dynamic port allocation
const startServer = async () => {
  try {
    // Connect to MongoDB database first
    await connectDB();
    console.log("✅ Database connected successfully");

    // Create default admin user after database connection
    await createDefaultAdmin();

    // Find an available port starting from preferred port
    const availablePort = await getPort({ port: PREFERRED_PORT });

    // Start the Express server on available port
    app.listen(availablePort, () => {
      console.log("🚀 Server started successfully!");
      console.log(`📡 Server running on port: ${availablePort}`);
      console.log(`🌐 Backend URL: http://localhost:${availablePort}`);

      // Store port for use in routes
      app.locals.serverPort = availablePort;
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit if server cannot start
  }
};

// Start the server
startServer();

/*
// GraphQL setup - Currently disabled
// TODO: Add proper GraphQL imports and setup if needed

const httpServer = http.createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,
    context: async () => ({ pubsub }),
  },
  wsServer
);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

await apolloServer.start();
// TODO: Add proper GraphQL imports and setup if needed
app.use(
  "/graphql",
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => ({ user: req.user, pubsub }),
  })
);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
});
*/
