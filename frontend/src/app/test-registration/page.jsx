"use client";
import { useState } from "react";

export default function TestRegistration() {
  const [result, setResult] = useState("");

  const testRegistration = async () => {
    try {
      const testData = {
        firstName: "TestUser",
        lastName: "Frontend",
        email: "testfrontend@example.com",
        password: "password123",
        userType: "patient",
        phoneNumber: "+1-555-9999",
        dateOfBirth: "1990-01-01",
        address: {
          street: "123 Test Frontend St",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "USA",
        },
      };

      console.log("Sending data:", testData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setResult(
          `✅ SUCCESS: ${data.message}\nUser ID: ${data.user.id}\nEmail: ${data.user.email}`
        );
      } else {
        setResult(`❌ ERROR: ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const loginData = {
        email: "testfrontend@example.com",
        password: "password123",
        userType: "patient",
      };

      console.log("Login data:", loginData);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        setResult(
          `✅ LOGIN SUCCESS: ${data.message}\nUser: ${data.user.firstName} ${
            data.user.lastName
          }\nToken: ${data.token.substring(0, 20)}...`
        );
      } else {
        setResult(`❌ LOGIN ERROR: ${data.message || "Login failed"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setResult(`❌ LOGIN NETWORK ERROR: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🧪 API Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Registration & Login
          </h2>

          <div className="space-y-4">
            <button
              onClick={testRegistration}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Test Registration
            </button>

            <button
              onClick={testLogin}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              🔑 Test Login
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/auth/register"
            className="text-blue-600 hover:underline mr-4"
          >
            ← Back to Registration
          </a>
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login →
          </a>
        </div>
      </div>
    </div>
  );
}
