"use client";

export default function FeaturesSection() {
  const features = [
    {
      icon: "🏥",
      title: "Expert Doctors",
      description:
        "Connect with certified healthcare professionals across all specialties",
    },
    {
      icon: "📅",
      title: "Easy Scheduling",
      description:
        "Book appointments 24/7 with our intuitive scheduling system",
    },
    {
      icon: "💊",
      title: "Digital Prescriptions",
      description:
        "Get electronic prescriptions sent directly to your pharmacy",
    },
    {
      icon: "📱",
      title: "Telemedicine",
      description: "Consult with doctors from the comfort of your home",
    },
    {
      icon: "📋",
      title: "Health Records",
      description: "Secure access to your complete medical history anytime",
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description:
        "Never miss appointments or medication with intelligent alerts",
    },
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for better health management in one integrated
            platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
