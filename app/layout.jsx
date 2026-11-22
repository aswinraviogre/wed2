import './globals.css';

export const metadata = {
  metadataBase: new URL('https://satish-weds-alekhya.com'),
  title: 'Satish & Alekhya | Wedding Invitation',
  description:
    "Sandhya & Jeevan Reddy and Sujatha & Rajagopal Thirumala cordially invite you to celebrate the wedding of Satish Reddy & Alekhya on December 21–23, 2026 in New Jersey, USA. Sacred Muhurtham on Dec 23, 2026 at Royal Albert's Palace, Fords, NJ.",
  keywords: [
    'Satish Reddy',
    'Alekhya',
    'Indian Wedding',
    'Telugu Wedding',
    'Wedding Invitation',
    "Royal Albert's Palace",
    'Fords',
    'Avenel',
    'New Jersey',
    'Mehandi',
    'Haldi',
  ],
  authors: [{ name: 'Satish Reddy & Alekhya' }],
  openGraph: {
    type: 'website',
    title: 'Satish & Alekhya | Wedding Invitation',
    description:
      "Celebrate the wedding of Satish Reddy & Alekhya on December 21–23, 2026 at Royal Albert's Palace, Fords, NJ. Auspicious Muhurtham: Dec 23, 2026 at 9:30 AM.",
    images: [
      {
        url: '/images/hero-flatlay.jpg',
        width: 1200,
        height: 630,
        alt: 'Satish & Alekhya Wedding Celebration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satish & Alekhya | Wedding Invitation',
    description:
      'Join Satish Reddy & Alekhya for their wedding celebrations on December 21–23, 2026 in New Jersey, USA.',
    images: ['/images/hero-flatlay.jpg'],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%235A1827'/><circle cx='50' cy='50' r='44' fill='none' stroke='%23D4AF37' stroke-width='2'/><path d='M50 20 C56 32 64 42 74 48 C64 54 56 64 50 76 C44 64 36 54 26 48 C36 42 44 32 50 20 Z' fill='%23D4AF37'/><circle cx='50' cy='48' r='7' fill='%23FAF6EE'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#2A0B0E] text-[#FFF6D8] font-sans selection:bg-[#C9922F] selection:text-[#2A0B0E] antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
