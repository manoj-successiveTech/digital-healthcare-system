"use client";

export default function StatsSection() {
  const stats = [
    {
      number: "10,000+",
      label: "Happy Patients",
      icon: "👥",
    },
    {
      number: "1,200+",
      label: "Expert Doctors",
      icon: "👨‍⚕️",
    },
    {
      number: "24/7",
      label: "Emergency Support",
      icon: "🚨",
    },
    {
      number: "98%",
      label: "Patient Satisfaction",
      icon: "❤️",
    },
  ];

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-lg text-blue-100">
            Numbers that speak for our commitment to excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
