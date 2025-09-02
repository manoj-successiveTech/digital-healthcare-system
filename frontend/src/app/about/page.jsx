"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialization: "Internal Medicine",
      experience: "15+ years",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology",
      specialization: "Cardiovascular Surgery",
      experience: "20+ years",
      image: "👨‍⚕️",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Emergency Medicine",
      specialization: "Emergency Care",
      experience: "12+ years",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. James Wilson",
      role: "Head of Pediatrics",
      specialization: "Child Healthcare",
      experience: "18+ years",
      image: "👨‍⚕️",
    },
  ];

  const values = [
    {
      title: "Patient-Centered Care",
      description:
        "We put our patients at the heart of everything we do, ensuring personalized and compassionate care.",
      icon: "❤️",
    },
    {
      title: "Excellence in Medicine",
      description:
        "We maintain the highest standards of medical practice with continuous learning and innovation.",
      icon: "🏆",
    },
    {
      title: "Accessibility",
      description:
        "Quality healthcare should be accessible to everyone, regardless of their background or circumstances.",
      icon: "🤝",
    },
    {
      title: "Innovation",
      description:
        "We embrace cutting-edge technology and modern practices to improve patient outcomes.",
      icon: "💡",
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
              About <span className="text-blue-600">HealthcarePro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated to providing exceptional healthcare services with
              compassion, innovation, and excellence at the forefront of
              everything we do.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg">
                  To provide accessible, high-quality healthcare services that
                  improve the lives of our patients and communities. We are
                  committed to delivering personalized care with compassion,
                  respect, and clinical excellence.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-600 text-lg">
                  To be the leading healthcare provider, recognized for
                  innovation, quality, and patient satisfaction. We envision a
                  future where everyone has access to comprehensive healthcare
                  services that promote wellness and healing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                The principles that guide our commitment to exceptional
                healthcare
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-lg text-gray-600">
                Experienced medical professionals dedicated to your health and
                wellbeing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-1">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    {member.specialization}
                  </p>
                  <p className="text-gray-500 text-sm">{member.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg text-blue-100">
                Making a difference in healthcare, one patient at a time
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years of Excellence</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Lives Touched</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">1,200+</div>
                <div className="text-blue-100">Healthcare Professionals</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Patient Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
