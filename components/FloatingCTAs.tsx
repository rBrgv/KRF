'use client';

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export function FloatingCTAs() {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href={telUrl}
        className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
        aria-label="Call"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}

