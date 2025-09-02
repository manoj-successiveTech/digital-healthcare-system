"use client";
import { useAuth } from "../../../components/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import {
  dashboardAPI,
  appointmentsAPI,
  apiHelper,
} from "../../../services/api";
import { useState, useEffect } from "react";
import Link from "next/link";

function DoctorDashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("appointments");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [updatingAppointment, setUpdatingAppointment] = useState(null);

  // Filter appointments for today
  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  // Calculate stats from real data
  const doctorStats = [
    {
      title: "Today's Appointments",
      count: todayAppointments.length.toString(),
      icon: "📅",
    },
    {
      title: "Total Appointments",
      count: appointments.length.toString(),
      icon: "👥",
    },
    {
      title: "Pending Appointments",
      count: appointments
        .filter((apt) => apt.status === "scheduled")
        .length.toString(),
      icon: "📋",
    },
    {
      title: "Confirmed Today",
      count: todayAppointments
        .filter((apt) => apt.status === "confirmed")
        .length.toString(),
      icon: "💬",
    },
  ];

  const recentPatients = dashboardData?.recentPatients || [];

  // Get pending appointments (scheduled status)
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getDashboard();

        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(apiHelper.handleError(err));
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await appointmentsAPI.getAppointments();

        if (response.success) {
          setAppointments(response.appointments || []);
        } else {
          console.error("Failed to load appointments:", response.message);
        }
      } catch (err) {
        console.error("Appointments fetch error:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    if (user) {
      fetchDashboardData();
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
      case "scheduled":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      setUpdatingAppointment(appointmentId);
      const status = action === "confirm" ? "confirmed" : "cancelled";

      const response = await appointmentsAPI.updateAppointment(appointmentId, {
        status,
      });

      if (response.success) {
        // Update the local state
        setAppointments((prev) =>
          prev.map((apt) =>
            apt._id === appointmentId ? { ...apt, status } : apt
          )
        );
      } else {
        setError(`Failed to ${action} appointment: ${response.message}`);
      }
    } catch (err) {
      console.error(`Error ${action}ing appointment:`, err);
      setError(`Failed to ${action} appointment`);
    } finally {
      setUpdatingAppointment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
                HealthcarePro
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">
                Doctor Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Dr. {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {doctorStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{stat.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 bg-white rounded-lg shadow p-1">
            {[
              { id: "appointments", label: "Today's Appointments", icon: "📅" },
              { id: "allAppointments", label: "All Appointments", icon: "📋" },
              { id: "patients", label: "Recent Patients", icon: "👥" },
              {
                id: "pendingAppointments",
                label: "Pending Appointments",
                icon: "⏰",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "appointments" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Today's Appointments
                </h2>
                {loadingAppointments && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </div>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">👤</div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patient?.firstName}{" "}
                            {appointment.patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.reason || "General consultation"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.patient?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {appointment.timeSlot?.start} -{" "}
                            {appointment.timeSlot?.end}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.isEmergency && (
                            <div className="text-xs text-red-600 font-medium">
                              🚨 Emergency
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {(appointment.status === "pending" ||
                            appointment.status === "scheduled") && (
                            <>
                              <button
                                onClick={() =>
                                  handleAppointmentAction(
                                    appointment._id,
                                    "confirm"
                                  )
                                }
                                disabled={
                                  updatingAppointment === appointment._id
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                              >
                                {updatingAppointment === appointment._id
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>
                              <button
                                onClick={() =>
                                  handleAppointmentAction(
                                    appointment._id,
                                    "cancel"
                                  )
                                }
                                disabled={
                                  updatingAppointment === appointment._id
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "cancel"
                                )
                              }
                              disabled={updatingAppointment === appointment._id}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-gray-500">
                      {loadingAppointments
                        ? "Loading appointments..."
                        : "No appointments scheduled for today"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "allAppointments" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Appointments
                </h2>
                {loadingAppointments && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">👤</div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patient?.firstName}{" "}
                            {appointment.patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.reason || "General consultation"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}{" "}
                            • {appointment.patient?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {appointment.timeSlot?.start} -{" "}
                            {appointment.timeSlot?.end}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.isEmergency && (
                            <div className="text-xs text-red-600 font-medium">
                              🚨 Emergency
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {(appointment.status === "pending" ||
                            appointment.status === "scheduled") && (
                            <>
                              <button
                                onClick={() =>
                                  handleAppointmentAction(
                                    appointment._id,
                                    "confirm"
                                  )
                                }
                                disabled={
                                  updatingAppointment === appointment._id
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                              >
                                {updatingAppointment === appointment._id
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>
                              <button
                                onClick={() =>
                                  handleAppointmentAction(
                                    appointment._id,
                                    "cancel"
                                  )
                                }
                                disabled={
                                  updatingAppointment === appointment._id
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "cancel"
                                )
                              }
                              disabled={updatingAppointment === appointment._id}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-500">
                      {loadingAppointments
                        ? "Loading appointments..."
                        : "No appointments found"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Patients
              </h2>
              <div className="space-y-4">
                {recentPatients.length > 0 ? (
                  recentPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">👤</div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last visit: {patient.lastVisit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {patient.condition}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {patient.status}
                          </p>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                          Records
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-gray-500">No recent patients</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "pendingAppointments" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pending Appointments
                </h2>
                {loadingAppointments && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingAppointments.length > 0 ? (
                  pendingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 border-yellow-200 bg-yellow-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">⏰</div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patient?.firstName}{" "}
                            {appointment.patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.reason || "General consultation"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}{" "}
                            • {appointment.patient?.email}
                          </p>
                          {appointment.patient?.phone && (
                            <p className="text-xs text-gray-500">
                              📞 {appointment.patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {appointment.timeSlot?.start} -{" "}
                            {appointment.timeSlot?.end}
                          </p>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                            Pending Approval
                          </span>
                          {appointment.isEmergency && (
                            <div className="text-xs text-red-600 font-medium">
                              🚨 Emergency
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleAppointmentAction(
                                appointment._id,
                                "confirm"
                              )
                            }
                            disabled={updatingAppointment === appointment._id}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 flex items-center space-x-1"
                          >
                            {updatingAppointment === appointment._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Confirming...</span>
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                <span>Confirm</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleAppointmentAction(appointment._id, "cancel")
                            }
                            disabled={updatingAppointment === appointment._id}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 flex items-center space-x-1"
                          >
                            {updatingAppointment === appointment._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Cancelling...</span>
                              </>
                            ) : (
                              <>
                                <span>✗</span>
                                <span>Decline</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⏰</div>
                    <p className="text-gray-500">
                      {loadingAppointments
                        ? "Loading pending appointments..."
                        : "No pending appointments to review"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      New appointment requests will appear here for your
                      approval
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center">
              <div className="text-2xl mb-2">👥</div>
              <div>View All Patients</div>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center">
              <div className="text-2xl mb-2">📝</div>
              <div>Write Prescription</div>
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center">
              <div className="text-2xl mb-2">📊</div>
              <div>Medical Reports</div>
            </button>
            <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div>Settings</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DoctorDashboard() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardContent />
    </ProtectedRoute>
  );
}
