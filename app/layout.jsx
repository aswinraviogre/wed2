import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://satish-weds-alekhya.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
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
    siteName: 'Satish & Alekhya Wedding Invitation',
    title: 'Satish & Alekhya | Wedding Invitation',
    description:
      "Celebrate the wedding of Satish Reddy & Alekhya on December 21–23, 2026 at Royal Albert's Palace, Fords, NJ. Auspicious Muhurtham: Dec 23, 2026 at 9:30 AM.",
    images: [
      {
        url: '/images/og-thumbnail.jpg',
        width: 768,
        height: 1024,
        type: 'image/jpeg',
        alt: 'Satish Reddy & Alekhya Wedding Invitation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satish & Alekhya | Wedding Invitation',
    description:
      'Join Satish Reddy & Alekhya for their wedding celebrations on December 21–23, 2026 in New Jersey, USA.',
    images: ['/images/og-thumbnail.jpg'],
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
        {/* WhatsApp & Social Media Thumbnail Meta Tags */}
        <link rel="image_src" href="/images/og-thumbnail.jpg" />
        <meta property="og:image" content="/images/og-thumbnail.jpg" />
        <meta property="og:image:secure_url" content="/images/og-thumbnail.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="768" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content="Satish Reddy & Alekhya Wedding Invitation" />
      </head>
      <body className="bg-[#2A0B0E] text-[#FFF6D8] font-sans selection:bg-[#C9922F] selection:text-[#2A0B0E] antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
