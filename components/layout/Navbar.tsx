"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function Navbar() {
  const [imgError, setImgError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/transformations", label: t("nav.transformations") },
    { href: "/events", label: t("nav.events") },
    { href: "/contact", label: t("nav.contact") },
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
            {t("nav.login")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-200"></span>
          </Link>
          <LanguageSelector />
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
              {t("nav.login")}
            </Link>
            <div className="pt-2 border-t border-gray-800/50">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

