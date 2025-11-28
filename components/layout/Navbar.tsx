"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [imgError, setImgError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/transformations", label: "Transformations" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          {!imgError ? (
            <img
              src="/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png"
              alt="KR Fitness Logo"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              style={{ maxWidth: '140px' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">KR FITNESS</span>
          )}
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-red-400 transition-all duration-200 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-300 hover:text-red-400 transition-all duration-200 relative group"
          >
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-200"></span>
          </Link>
          <Link
            href="/book"
            className="group relative rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:scale-105"
          >
            <span className="relative z-10">Book Consultation</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800/50 bg-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-gray-300 hover:text-red-400 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-red-400 transition-colors py-2"
            >
              Login
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all mt-4"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

