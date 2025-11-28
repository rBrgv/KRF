"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";

const certifications = [
  { name: "NSCA", image: "NSCA.jpg" },
  { name: "SCA", image: "SCA.jpg" },
  { name: "N.S.D.C", image: "N.S.D.jpg" },
  { name: "FSSA Functional Training", image: "FSSA FUNCTIONAL TRAINING .jpg" },
  { name: "INFS Nutrition", image: "INFS NUTRITION .jpg" },
  { name: "Nightingales Lifesaving Services", image: "NIGHTINGALES LIFESAVING SERVICES .jpg" },
  { name: "ISFA", image: "ISFA .jpg" },
  { name: "FSSA", image: "FSSA .jpg" },
  { name: "Thai Bodyworks", image: "THAI BODYWORKS .jpg" },
];

export function CertificationsGallery() {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">International Certifications</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {certifications.map((cert, idx) => (
          <ScrollAnimation key={idx} delay={idx * 50}>
            <div className="premium-card rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <img
                  src={`/about/${encodeURIComponent(cert.image)}`}
                  alt={`${cert.name} Certification`}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="text-gray-600 text-xs text-center p-4">Certificate</div>';
                    }
                  }}
                />
              </div>
              <p className="text-white text-xs font-semibold text-center">{cert.name}</p>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </div>
  );
}




