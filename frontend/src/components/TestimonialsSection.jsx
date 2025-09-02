"use client";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "HealthcarePro made it so easy to book appointments and access my medical records. The doctors are amazing!",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content:
        "As a healthcare provider, this platform streamlines my practice and improves patient communication significantly.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mother",
      content:
        "The telemedicine feature is a lifesaver! I can consult with doctors without taking time off work.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What People Say About Us
          </h2>
          <p className="text-lg text-gray-600">
            Real stories from our patients and healthcare providers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
