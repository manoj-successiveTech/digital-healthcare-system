"use client";
import { useAuth } from "../../../components/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Link from "next/link";
import { useState, useEffect } from "react";

// Simple icons for the simplified dashboard
import { FaUserMd, FaUser, FaUsers, FaUserShield } from "react-icons/fa";

function StatCard({ icon, title, value, color }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4 border-l-4 hover:shadow-lg transition-shadow"
      style={{ borderColor: color }}
    >
      <div className="text-3xl" style={{ color }}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("authToken") || localStorage.getItem("token")
            }`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && data.data) setDashboardData(data.data);
        else setError("Failed to load dashboard data");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <FaUserShield className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-blue-600">
                HealthcarePro
              </span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <strong>Admin Healthcare</strong>
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Simple Stats - Only Doctors and Patients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={<FaUserMd />}
            title="Doctors"
            value={dashboardData?.totalDoctors || 1}
            color="#22c55e"
          />
          <StatCard
            icon={<FaUser />}
            title="Patients"
            value={dashboardData?.totalPatients || 2}
            color="#a21caf"
          />
        </div>

        {/* Recent User Registrations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUsers className="text-blue-500" /> Recent User Registrations
          </h2>
          <div className="space-y-4">
            {dashboardData?.recentUsers?.length > 0 ? (
              dashboardData.recentUsers.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-lg">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {u.userType} •{" "}
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      u.userType === "doctor"
                        ? "bg-green-100 text-green-800"
                        : u.userType === "patient"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.userType}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent users found
              </p>
            )}
          </div>
        </div>

        {/* Simple Management Actions - Only Patient and Doctor Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/admin/add-doctor"
            className="bg-green-600 text-white p-8 rounded-lg flex flex-col items-center hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FaUserMd className="text-4xl mb-3" />
            <span className="text-xl font-semibold">Manage Doctors</span>
            <span className="text-sm mt-2 opacity-90">
              View, add, and manage doctor accounts
            </span>
          </Link>
          <Link
            href="/dashboard/admin/add-patient"
            className="bg-purple-600 text-white p-8 rounded-lg flex flex-col items-center hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FaUser className="text-4xl mb-3" />
            <span className="text-xl font-semibold">Manage Patients</span>
            <span className="text-sm mt-2 opacity-90">
              View, add, and manage patient accounts
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
