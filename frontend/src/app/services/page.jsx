"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ServicesSection from "../../components/ServicesSection";

export default function Services() {
  const allServices = [
    {
      title: "Primary Care",
      description:
        "Comprehensive primary healthcare services for all ages including routine check-ups, preventive care, and health screenings.",
      features: [
        "Annual Health Exams",
        "Vaccinations",
        "Health Screenings",
        "Chronic Disease Management",
      ],
      image: "🩺",
    },
    {
      title: "Specialist Consultations",
      description:
        "Expert care from board-certified specialists across various medical fields.",
      features: [
        "Cardiology",
        "Dermatology",
        "Orthopedics",
        "Neurology",
        "Gastroenterology",
      ],
      image: "👨‍⚕️",
    },
    {
      title: "Emergency Care",
      description:
        "24/7 emergency medical support when you need immediate medical attention.",
      features: [
        "24/7 Availability",
        "Emergency Room",
        "Urgent Care",
        "Trauma Care",
      ],
      image: "🚑",
    },
    {
      title: "Mental Health",
      description:
        "Comprehensive mental health and wellness support with licensed professionals.",
      features: [
        "Therapy Sessions",
        "Psychiatric Care",
        "Counseling",
        "Support Groups",
      ],
      image: "🧠",
    },
    {
      title: "Telemedicine",
      description:
        "Virtual consultations from the comfort of your home with our telemedicine platform.",
      features: [
        "Video Consultations",
        "Online Prescriptions",
        "Remote Monitoring",
        "Follow-up Care",
      ],
      image: "📱",
    },
    {
      title: "Laboratory Services",
      description:
        "State-of-the-art laboratory testing and diagnostic services.",
      features: [
        "Blood Tests",
        "Imaging Studies",
        "Pathology",
        "Genetic Testing",
      ],
      image: "🔬",
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
              Our Medical <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet all your
              medical needs with the highest standards of care and
              professionalism.
            </p>
          </div>
        </section>

        {/* Detailed Services */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{service.image}</div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Services Include:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Quality Healthcare?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Learn more about our comprehensive healthcare services and how we
              can help you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
