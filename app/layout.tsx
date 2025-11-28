import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "KR Fitness - Personal Fitness Trainer in Bangalore | Elite Training Studio",
  description: "Personal Fitness Trainer in Bangalore offering training methods designed to fit your unique fitness journey. Fitness is not a destination; it's a way of life. EREPS Level 4 certified trainer with 15+ years experience.",
  keywords: "personal trainer bangalore, fitness trainer, gym trainer, personal training studio, weight loss trainer, strength training, EREPS certified trainer",
  authors: [{ name: "KR Fitness Studio" }],
  openGraph: {
    title: "KR Fitness - Elite Personal Training Studio in Bangalore",
    description: "Transform your body and mind with personalized training programs from certified experts.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "KR Fitness - Personal Fitness Trainer in Bangalore",
    description: "Elite personal training with certified experts. Transform your fitness journey.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "KR Fitness Studio",
              "image": "/KR FITNESS LOGO BLACK BACKGROUND.png",
              "@id": "https://krfitnessstudio.com",
              "url": "https://krfitnessstudio.com",
              "telephone": "+916361079633",
              "email": "krpersonalfitnessstudio@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shiv krupa complex No.133 4th cross, Uttarahalli Hobli",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560061",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 12.9352,
                "longitude": 77.6245
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "06:00",
                "closes": "21:00"
              },
              "sameAs": [
                "https://www.instagram.com/coach_keerthiraj/",
                "https://www.facebook.com/people/Coach-Keerthi-Raj/61572878484146/"
              ],
              "priceRange": "$$"
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Keerthi Raj",
              "jobTitle": "Personal Fitness Trainer",
              "worksFor": {
                "@type": "LocalBusiness",
                "name": "KR Fitness Studio"
              },
              "email": "krpersonalfitnessstudio@gmail.com",
              "telephone": "+916361079633",
              "sameAs": [
                "https://www.instagram.com/coach_keerthiraj/",
                "https://www.facebook.com/people/Coach-Keerthi-Raj/61572878484146/"
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingButtons />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
