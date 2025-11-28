import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-orange-600">KR FITNESS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-orange-600 transition-colors">
            About
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Services
          </Link>
          <Link href="/transformations" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Transformations
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Events
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Contact
          </Link>
        </nav>
        <Link
          href="/book-consultation"
          className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors"
        >
          Book Free Consultation
        </Link>
      </div>
    </header>
  );
}

