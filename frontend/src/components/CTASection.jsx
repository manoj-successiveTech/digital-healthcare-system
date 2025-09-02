"use client";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      id="contact"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Take Control of Your Health?
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Join thousands of patients who trust HealthcarePro for their medical
          needs. Start your journey to better health today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-8 text-blue-100 text-sm">
          <p>📞 24/7 Support: 1-800-HEALTHCARE</p>
          <p>📧 Email: support@healthcarepro.com</p>
        </div>
      </div>
    </section>
  );
}
