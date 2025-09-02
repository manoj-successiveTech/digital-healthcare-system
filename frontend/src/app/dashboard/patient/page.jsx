"use client";
import { useAuth } from "../../../components/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { usersAPI, appointmentsAPI } from "../../../services/api";
import Link from "next/link";
import { useState, useEffect } from "react";

function PatientDashboardContent() {
  const { user, logout } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPatientRecords, setShowPatientRecords] = useState(false);
  const [showContactDoctor, setShowContactDoctor] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [bookingAppointment, setBookingAppointment] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await appointmentsAPI.getAppointments();

      if (response.success) {
        // Transform API response to match UI format
        const transformedAppointments = response.appointments.map((apt) => ({
          id: apt._id,
          doctor: `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`,
          specialty: apt.doctor.department,
          specialization: apt.doctor.specialization,
          date: new Date(apt.appointmentDate).toLocaleDateString(),
          time: apt.timeSlot.start,
          status: apt.status,
          reason: apt.reason,
          appointmentDate: apt.appointmentDate,
          doctorId: apt.doctor._id,
        }));
        setUpcomingAppointments(transformedAppointments);
      } else {
        console.error("Failed to fetch appointments:", response.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      setBookingAppointment(true);

      // Find the selected doctor from available doctors
      const selectedDoctor = availableDoctors.find(
        (doctor) =>
          `Dr. ${doctor.firstName} ${doctor.lastName}` ===
          appointmentData.doctor
      );

      if (!selectedDoctor) {
        alert("Please select a valid doctor.");
        return;
      }

      // Convert 12-hour time format to 24-hour format
      const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");
        if (hours === "12") {
          hours = "00";
        }
        if (modifier === "PM" && hours !== "12") {
          hours = parseInt(hours, 10) + 12;
        }
        return `${hours.padStart(2, "0")}:${minutes}`;
      };

      const startTime24 = convertTo24Hour(appointmentData.time);
      const endTime24 = calculateEndTime(startTime24);

      // Prepare appointment data for API
      const apiAppointmentData = {
        doctor: selectedDoctor._id,
        appointmentDate: appointmentData.date,
        timeSlot: {
          start: startTime24,
          end: endTime24,
        },
        reason: appointmentData.reason || "General consultation",
        symptoms: "",
        priority: "normal",
        isEmergency: false,
      };

      console.log("Sending appointment data:", apiAppointmentData);

      const response = await appointmentsAPI.createAppointment(
        apiAppointmentData
      );

      if (response.success) {
        alert(
          `Appointment booked successfully! Status: ${response.appointment.status}`
        );
        setShowBookingForm(false);
        setSelectedDepartment("");
        setAvailableDoctors([]);
        // Refresh appointments list
        fetchAppointments();
      } else {
        console.error("Booking failed:", response);
        alert(
          `Failed to book appointment: ${response.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setBookingAppointment(false);
    }
  };

  // Helper function to calculate end time (30 minutes after start time)
  const calculateEndTime = (startTime24h) => {
    const [hours, minutes] = startTime24h.split(":");
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes
    return endDate.toTimeString().slice(0, 5); // Return in HH:MM format
  };

  const fetchDoctorsByDepartment = async (department) => {
    if (!department) {
      setAvailableDoctors([]);
      return;
    }

    try {
      setLoadingDoctors(true);
      const response = await usersAPI.getDoctorsByDepartment(department);

      if (response.success) {
        setAvailableDoctors(response.doctors);
      } else {
        console.error("Failed to fetch doctors:", response.message);
        setAvailableDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setAvailableDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    fetchDoctorsByDepartment(department);
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
                Patient Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
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
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your healthcare needs with our easy-to-use patient portal.
          </p>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {loadingAppointments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading appointments...</p>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => {
                  const getStatusColor = (status) => {
                    switch (status) {
                      case "scheduled":
                        return "bg-yellow-100 text-yellow-800";
                      case "confirmed":
                        return "bg-green-100 text-green-800";
                      case "completed":
                        return "bg-blue-100 text-blue-800";
                      case "cancelled":
                        return "bg-red-100 text-red-800";
                      default:
                        return "bg-gray-100 text-gray-800";
                    }
                  };

                  const getStatusDisplay = (status) => {
                    switch (status) {
                      case "scheduled":
                        return "Pending";
                      case "confirmed":
                        return "Confirmed";
                      case "completed":
                        return "Completed";
                      case "cancelled":
                        return "Cancelled";
                      default:
                        return status;
                    }
                  };

                  return (
                    <div
                      key={appointment.id || index}
                      className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">
                              {appointment.doctor}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {getStatusDisplay(appointment.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {appointment.specialty} -{" "}
                            {appointment.specialization}
                          </p>
                          {appointment.reason && (
                            <p className="text-sm text-gray-500 italic">
                              Reason: {appointment.reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.date}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowBookingForm(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Essential Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Patient Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Appointment */}
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Appointment</h3>
              <p className="text-sm opacity-90">
                Schedule appointments with your healthcare providers
              </p>
            </button>

            {/* View Records */}
            <button
              onClick={() => alert("Medical records feature coming soon!")}
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                📋
              </div>
              <h3 className="text-lg font-semibold mb-2">View Records</h3>
              <p className="text-sm opacity-90">
                Access your medical history and test results
              </p>
            </button>

            {/* Contact Doctor */}
            <button
              onClick={() => setShowContactDoctor(true)}
              className="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition-colors text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="text-lg font-semibold mb-2">Contact Doctor</h3>
              <p className="text-sm opacity-90">
                Communicate with your healthcare team
              </p>
            </button>
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Health Tip of the Day
          </h3>
          <p className="text-gray-700">
            Stay hydrated! Drinking adequate water helps maintain your body's
            vital functions and supports overall health. Aim for 8 glasses of
            water daily.
          </p>
        </div>

        {/* Book Appointment Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Book Appointment
                  </h2>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedDepartment("");
                      setAvailableDoctors([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const appointmentData = {
                      doctor: formData.get("doctor"),
                      specialty: formData.get("department"),
                      date: formData.get("date"),
                      time: formData.get("time"),
                      reason: formData.get("reason"),
                    };
                    handleBookAppointment(appointmentData);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        name="department"
                        value={selectedDepartment}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Internal Medicine">
                          Internal Medicine
                        </option>
                        <option value="General Surgery">General Surgery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doctor
                      </label>
                      {loadingDoctors ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                          Loading doctors...
                        </div>
                      ) : (
                        <select
                          name="doctor"
                          required
                          disabled={!selectedDepartment}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">
                            {selectedDepartment
                              ? "Select Doctor"
                              : "Please select department first"}
                          </option>
                          {availableDoctors.map((doctor) => (
                            <option
                              key={doctor._id}
                              value={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                            >
                              Dr. {doctor.firstName} {doctor.lastName} -{" "}
                              {doctor.specialization}
                            </option>
                          ))}
                        </select>
                      )}
                      {selectedDepartment &&
                        availableDoctors.length === 0 &&
                        !loadingDoctors && (
                          <p className="text-sm text-red-600 mt-1">
                            No doctors available in this department.
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <select
                        name="time"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="">Select Time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Visit (Optional)
                      </label>
                      <textarea
                        name="reason"
                        placeholder="Brief description of your concern..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setSelectedDepartment("");
                        setAvailableDoctors([]);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingAppointment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingAppointment ? "Booking..." : "Book Appointment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Contact Doctor Modal */}
        {showContactDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Doctor
                  </h2>
                  <button
                    onClick={() => setShowContactDoctor(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      📧 Send Message
                    </h3>
                    <textarea
                      placeholder="Type your message to your doctor..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows="4"
                    ></textarea>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Send Message
                    </button>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      📞 Emergency Contact
                    </h3>
                    <p className="text-green-700 mb-2">
                      For urgent medical concerns:
                    </p>
                    <div className="space-y-1">
                      <p>
                        <strong>Emergency:</strong> 911
                      </p>
                      <p>
                        <strong>Hospital:</strong> +1-555-HOSPITAL
                      </p>
                      <p>
                        <strong>Your Doctor:</strong> +1-555-DOC-CARE
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      💬 Chat Support
                    </h3>
                    <p className="text-purple-700 mb-2">
                      Live chat with medical staff (9 AM - 5 PM)
                    </p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PatientDashboard() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}
