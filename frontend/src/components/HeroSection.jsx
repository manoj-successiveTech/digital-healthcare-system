"use client";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Your Health, Our <span className="text-blue-600">Priority</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Experience world-class healthcare with our comprehensive digital
          platform. Connect with top doctors, manage appointments, and take
          control of your health journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Book Appointment
          </button>
          <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
