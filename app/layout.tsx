import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "KR Fitness - Best Gym in Bangalore | Gym Near Me | Online Gym Training",
  description: "Best gym in Bangalore with personal training, online gym programs, and fitness coaching. Find gym near me in Bengaluru. EREPS Level 4 certified trainer with 15+ years experience. Transform your body with personalized training.",
  keywords: "gym in bangalore, gym near me, online gym, best gym bangalore, gym bangalore, fitness gym bangalore, personal trainer bangalore, gym trainer bangalore, gym in bengaluru, gym near me bangalore, online gym training, home gym trainer bangalore, fitness studio bangalore, weight loss gym bangalore, strength training gym bangalore, EREPS certified trainer, personal training studio bangalore",
  authors: [{ name: "KR Fitness Studio" }],
  openGraph: {
    title: "KR Fitness - Elite Personal Training Studio in Bangalore",
    description: "Transform your body and mind with personalized training programs from certified experts.",
    type: "website",
    locale: "en_IN",
    url: "https://krfitnessstudio.com",
    siteName: "KR Fitness Studio",
    images: [
      {
        url: "https://krfitnessstudio.com/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png",
        width: 1200,
        height: 630,
        alt: "KR Fitness Studio - Personal Training in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KR Fitness - Personal Fitness Trainer in Bangalore",
    description: "Elite personal training with certified experts. Transform your fitness journey.",
    images: ["https://krfitnessstudio.com/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://krfitnessstudio.com",
    languages: {
      'en': 'https://krfitnessstudio.com',
      'hi': 'https://krfitnessstudio.com?lang=hi',
      'kn': 'https://krfitnessstudio.com?lang=kn',
      'ta': 'https://krfitnessstudio.com?lang=ta',
      'te': 'https://krfitnessstudio.com?lang=te',
    },
  },
  icons: {
    icon: '/KR FITNESS LOGO BLACK BACKGROUND.png',
    apple: '/KR FITNESS LOGO BLACK BACKGROUND.png',
    shortcut: '/KR FITNESS LOGO BLACK BACKGROUND.png',
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
        <link rel="icon" type="image/png" href="/KR FITNESS LOGO BLACK BACKGROUND.png" />
        <link rel="apple-touch-icon" href="/KR FITNESS LOGO BLACK BACKGROUND.png" />
        <link rel="shortcut icon" href="/KR FITNESS LOGO BLACK BACKGROUND.png" />
        <link rel="preload" href="https://www.youtube.com/iframe_api" as="script" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "Gym", "ExerciseGym"],
              "name": "KR Fitness Studio",
              "alternateName": "KR Fitness Gym Bangalore",
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
                "https://www.facebook.com/people/Coach-Keerthi-Raj/61572878484146/",
                "https://www.youtube.com/@KrFitnessStudio"
              ],
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "2394",
                "reviewCount": "2394"
              },
              "areaServed": {
                "@type": "City",
                "name": "Bengaluru",
                "@id": "https://www.wikidata.org/wiki/Q1355"
              },
              "hasMap": "https://www.google.com/maps/place/KR+Fitness+Studio",
              "servesCuisine": null,
              "menu": null,
              "sport": "Fitness Training",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Personal Training",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Online Training",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Group Classes",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Gym Equipment",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Weight Training",
                  "value": true
                }
              ],
              "keywords": "gym in bangalore, gym near me, online gym, best gym bangalore, gym bangalore, fitness gym bangalore, gym in bengaluru"
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
                "https://www.facebook.com/people/Coach-Keerthi-Raj/61572878484146/",
                "https://www.youtube.com/@KrFitnessStudio"
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AggregateRating",
              "itemReviewed": {
                "@type": "LocalBusiness",
                "name": "KR Fitness Studio"
              },
              "ratingValue": "5",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "2394",
              "reviewCount": "2394"
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
