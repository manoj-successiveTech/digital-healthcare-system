"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission logic here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      title: "Emergency Services",
      details: "24/7 Emergency Hotline",
      contact: "1-800-EMERGENCY",
      icon: "🚨",
    },
    {
      title: "General Inquiries",
      details: "Mon - Fri, 8AM - 6PM",
      contact: "1-800-HEALTHCARE",
      icon: "📞",
    },
    {
      title: "Email Support",
      details: "Response within 24 hours",
      contact: "support@healthcarepro.com",
      icon: "📧",
    },
  ];

  const departments = [
    {
      name: "Appointments",
      phone: "(555) 123-0001",
      email: "appointments@healthcarepro.com",
    },
    {
      name: "Billing",
      phone: "(555) 123-0002",
      email: "billing@healthcarepro.com",
    },
    {
      name: "Medical Records",
      phone: "(555) 123-0003",
      email: "records@healthcarepro.com",
    },
    {
      name: "Insurance",
      phone: "(555) 123-0004",
      email: "insurance@healthcarepro.com",
    },
    {
      name: "Patient Services",
      phone: "(555) 123-0005",
      email: "patients@healthcarepro.com",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Contact <span className="text-blue-600">HealthcarePro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Get in touch with our team for appointments,
              inquiries, or any healthcare-related questions.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl text-center shadow hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 mb-1 text-sm">{info.details}</p>
                  <p className="text-blue-700 font-medium text-base">
                    {info.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Departments */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Appointment Request</option>
                      <option value="billing">Billing Inquiry</option>
                      <option value="medical">Medical Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Enter your message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Department Contacts */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Department Contacts
                </h2>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {dept.name}
                      </h3>
                      <p className="text-gray-600 mb-1">📞 {dept.phone}</p>
                      <p className="text-gray-600">📧 {dept.email}</p>
                    </div>
                  ))}
                </div>

                {/* Office Hours */}
                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM
                    </p>
                    <p>
                      <strong>Saturday:</strong> 9:00 AM - 4:00 PM
                    </p>
                    <p>
                      <strong>Sunday:</strong> Emergency Services Only
                    </p>
                    <p>
                      <strong>Emergency:</strong> 24/7 Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
