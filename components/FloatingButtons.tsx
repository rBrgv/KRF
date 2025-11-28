'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function FloatingButtons() {
  const pathname = usePathname();
  
  // Hide on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  // Base phone number (10 digits)
  const baseNumber = '6361079633';
  
  // Get from env or use default
  const envWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || baseNumber;
  const envPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || baseNumber;
  
  // Clean and format for WhatsApp (must be 12 digits with country code)
  const whatsappClean = envWhatsapp.replace(/[^0-9]/g, '');
  let whatsappWithCountry: string;
  
  if (whatsappClean.length === 12 && whatsappClean.startsWith('91')) {
    // Already has country code
    whatsappWithCountry = whatsappClean;
  } else if (whatsappClean.length === 10) {
    // 10 digits, add country code
    whatsappWithCountry = `91${whatsappClean}`;
  } else {
    // Fallback to hardcoded number
    whatsappWithCountry = '916361079633';
  }
  
  // Clean and format for tel link
  const phoneClean = envPhone.replace(/[^0-9]/g, '');
  const phoneForTel = phoneClean.length === 10 ? phoneClean : baseNumber;
  
  const whatsappUrl = `https://wa.me/${whatsappWithCountry}`;
  const telUrl = `tel:+91${phoneForTel}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" data-floating-buttons>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-green-500 text-white p-4 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-green-600 transition-all duration-300 hover:scale-110 flex items-center justify-center premium-glow"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </a>
      <a
        href={telUrl}
        className="group relative bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-110 flex items-center justify-center md:hidden"
        aria-label="Call"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}

