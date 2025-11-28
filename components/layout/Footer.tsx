import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-red-500 mb-4">KR FITNESS STUDIO</h3>
            <p className="text-sm text-gray-400">
              A fit body and mind is key to a healthier lifestyle. Transform your body and mind with personalized training programs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-400 transition-colors">
                  About Keerthi
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-red-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/transformations" className="text-gray-400 hover:text-red-400 transition-colors">
                  Transformation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Phone: <a href="tel:+916361079633" className="hover:text-red-400 transition-colors">63610 79633</a></li>
              <li>Email: <a href="mailto:krpersonalfitnessstudio@gmail.com" className="hover:text-red-400 transition-colors">krpersonalfitnessstudio@gmail.com</a></li>
              <li className="mt-3">
                <span className="block">Shiv krupa complex No.133 4th cross,</span>
                <span className="block">Uttarahalli Hobli</span>
                <span className="block">Bengaluru, Karnataka 560061</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Follow Us</h4>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/coach_keerthiraj/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/people/Coach-Keerthi-Raj/61572878484146/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>Copyright &copy; {new Date().getFullYear()} KR Fitness Studio. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy-policy" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-red-400 transition-colors">Terms & Conditions</Link>
            <Link href="/return-refund-policy" className="hover:text-red-400 transition-colors">Return & Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
