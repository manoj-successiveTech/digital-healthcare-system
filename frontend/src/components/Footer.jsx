export default function Footer() {
  return (
    <footer className="w-full bg-white shadow text-center py-4 mt-8 border-t border-gray-200">
      <span className="text-gray-600">
        &copy; {new Date().getFullYear()} HealthcarePro. All rights reserved.
      </span>
    </footer>
  );
}
