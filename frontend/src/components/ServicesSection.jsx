"use client";

export default function ServicesSection() {
  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive primary healthcare services for all ages",
      image: "🩺",
    },
    {
      title: "Specialist Consultations",
      description: "Expert care from cardiologists, dermatologists, and more",
      image: "👨‍⚕️",
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency medical support when you need it most",
      image: "🚑",
    },
    {
      title: "Mental Health",
      description: "Professional mental health and wellness support",
      image: "🧠",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive healthcare services tailored to your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-5xl mb-4">{service.image}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button className="text-blue-600 font-medium hover:text-blue-700">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
