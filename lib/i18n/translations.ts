export type Translations = {
  nav: {
    home: string;
    about: string;
    services: string;
    transformations: string;
    events: string;
    contact: string;
    login: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    ctaSecondary: string;
  };
  common: {
    learnMore: string;
    contactUs: string;
    readMore: string;
    viewAll: string;
    back: string;
  };
};

const translations: Record<string, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      transformations: 'Transformations',
      events: 'Events',
      contact: 'Contact',
      login: 'Login',
    },
    hero: {
      title: 'Transform with Keerthi Raj.',
      subtitle: 'Train Anywhere. One Plan.',
      description: 'Discover your personalized Health Score in less than 60 seconds.',
      cta: 'Start Your Health Check',
      ctaSecondary: 'Meet Your Coach',
    },
    common: {
      learnMore: 'Learn More',
      contactUs: 'Contact Us',
      readMore: 'Read More',
      viewAll: 'View All',
      back: 'Back',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      about: 'के बारे में',
      services: 'सेवाएं',
      transformations: 'परिवर्तन',
      events: 'इवेंट्स',
      contact: 'संपर्क',
      login: 'लॉगिन',
    },
    hero: {
      title: 'कीर्ति राज के साथ बदलें।',
      subtitle: 'कहीं भी प्रशिक्षण। एक योजना।',
      description: '60 सेकंड से कम समय में अपना व्यक्तिगत स्वास्थ्य स्कोर खोजें।',
      cta: 'अपनी स्वास्थ्य जांच शुरू करें',
      ctaSecondary: 'अपने कोच से मिलें',
    },
    common: {
      learnMore: 'अधिक जानें',
      contactUs: 'संपर्क करें',
      readMore: 'अधिक पढ़ें',
      viewAll: 'सभी देखें',
      back: 'वापस',
    },
  },
  kn: {
    nav: {
      home: 'ಮುಖಪುಟ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      services: 'ಸೇವೆಗಳು',
      transformations: 'ರೂಪಾಂತರಗಳು',
      events: 'ಕಾರ್ಯಕ್ರಮಗಳು',
      contact: 'ಸಂಪರ್ಕಿಸಿ',
      login: 'ಲಾಗಿನ್',
    },
    hero: {
      title: 'ಕೀರ್ತಿ ರಾಜ್ ಜೊತೆ ರೂಪಾಂತರಿಸಿ।',
      subtitle: 'ಎಲ್ಲಿಯಾದರೂ ತರಬೇತಿ. ಒಂದು ಯೋಜನೆ।',
      description: '60 ಸೆಕೆಂಡ್ಗಳಿಗಿಂತ ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸ್ಕೋರ್ ಅನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ।',
      cta: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಪರಿಶೀಲನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
      ctaSecondary: 'ನಿಮ್ಮ ತರಬೇತುದಾರರನ್ನು ಭೇಟಿ ಮಾಡಿ',
    },
    common: {
      learnMore: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ',
      contactUs: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      readMore: 'ಹೆಚ್ಚು ಓದಿ',
      viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
      back: 'ಹಿಂದೆ',
    },
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      about: 'எங்களைப் பற்றி',
      services: 'சேவைகள்',
      transformations: 'மாற்றங்கள்',
      events: 'நிகழ்வுகள்',
      contact: 'தொடர்பு',
      login: 'உள்நுழை',
    },
    hero: {
      title: 'கீர்த்தி ராஜ் உடன் மாற்றுங்கள்।',
      subtitle: 'எங்கும் பயிற்சி. ஒரு திட்டம்।',
      description: '60 வினாடிகளுக்குள் உங்கள் தனிப்பட்ட சுகாதார மதிப்பெண்ணைக் கண்டறியவும்।',
      cta: 'உங்கள் சுகாதார சோதனையைத் தொடங்கவும்',
      ctaSecondary: 'உங்கள் பயிற்சியாளரைச் சந்திக்கவும்',
    },
    common: {
      learnMore: 'மேலும் அறிக',
      contactUs: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
      readMore: 'மேலும் படிக்க',
      viewAll: 'அனைத்தையும் பார்க்க',
      back: 'பின்',
    },
  },
  te: {
    nav: {
      home: 'హోమ్',
      about: 'మా గురించి',
      services: 'సేవలు',
      transformations: 'మార్పులు',
      events: 'ఈవెంట్‌లు',
      contact: 'సంప్రదించండి',
      login: 'లాగిన్',
    },
    hero: {
      title: 'కీర్తి రాజ్ తో మార్చండి।',
      subtitle: 'ఎక్కడైనా శిక్షణ. ఒక ప్రణాళిక।',
      description: '60 సెకన్లలో మీ వ్యక్తిగత ఆరోగ్య స్కోర్‌ను కనుగొనండి।',
      cta: 'మీ ఆరోగ్య తనిఖీని ప్రారంభించండి',
      ctaSecondary: 'మీ శిక్షకుడిని కలవండి',
    },
    common: {
      learnMore: 'మరింత తెలుసుకోండి',
      contactUs: 'మమ్మల్ని సంప్రదించండి',
      readMore: 'మరింత చదవండి',
      viewAll: 'అన్నీ వీక్షించండి',
      back: 'వెనక్కి',
    },
  },
};

export default translations;

