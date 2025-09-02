import Link from "next/link";
import { memo } from "react";
import { FaHeartbeat } from "react-icons/fa";

// 🧠 MEMOIZATION: Navigation links array to prevent recreation on each render
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// 🧠 MEMOIZATION: Auth buttons to prevent unnecessary re-renders
const AuthButtons = memo(() => (
  <div className="flex gap-3">
    <Link
      href="/auth/login"
      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
    >
      Login
    </Link>
    <Link
      href="/auth/register"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Register
    </Link>
  </div>
));

// 🧠 MEMOIZATION: Navigation menu to prevent unnecessary re-renders
const NavigationMenu = memo(() => (
  <ul className="flex gap-6 text-gray-700 font-medium">
    {navLinks.map(({ href, label }) => (
      <li key={href}>
        <Link href={href} className="hover:text-blue-500 transition-colors">
          {label}
        </Link>
      </li>
    ))}
  </ul>
));

// 🧠 MEMOIZATION: Main Navbar component - only re-renders when props change
const Navbar = memo(() => {
  return (
    <nav className="w-full bg-white shadow-md flex items-center justify-between px-8 py-4 sticky top-0 z-50">
      {/* 🎯 BRAND: Logo and brand name */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl text-blue-600 group-hover:animate-pulse">
          <FaHeartbeat />
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors">
          Healthcare<span className="text-blue-600">Pro</span>
        </span>
      </Link>

      {/* 🧠 MEMOIZED: Navigation and auth sections */}
      <div className="flex items-center gap-8">
        <NavigationMenu />
        <AuthButtons />
      </div>
    </nav>
  );
});

// 🧠 MEMOIZATION: Display names for debugging
Navbar.displayName = "Navbar";
NavigationMenu.displayName = "NavigationMenu";
AuthButtons.displayName = "AuthButtons";

export default Navbar;
