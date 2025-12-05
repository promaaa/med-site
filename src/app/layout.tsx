import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Dr. Martin | Médecin Généraliste à Amiens",
  description: "Cabinet médical du Dr. Martin à Amiens. Consultations en médecine générale, soins spécialisés et télémédecine. Prenez rendez-vous en ligne facilement.",
  keywords: ["médecin", "généraliste", "Amiens", "consultation", "rendez-vous", "télémédecine", "Dr Martin"],
  authors: [{ name: "Dr. Martin" }],
  openGraph: {
    title: "Dr. Martin | Médecin Généraliste à Amiens",
    description: "Cabinet médical du Dr. Martin. Consultations en médecine générale, soins spécialisés et télémédecine.",
    type: "website",
    locale: "fr_FR",
    siteName: "Clinique Dr. Martin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Martin | Médecin Généraliste à Amiens",
    description: "Prenez rendez-vous en ligne facilement avec le Dr. Martin.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://dr-martin.fr",
    "name": "Cabinet Dr. Martin",
    "description": "Cabinet médical du Dr. Martin à Amiens. Consultations en médecine générale, soins spécialisés et télémédecine.",
    "url": "https://dr-martin.fr",
    "telephone": "+33322000000",
    "email": "contact@dr-martin.fr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "13 place Alphonse Fiquet",
      "addressLocality": "Amiens",
      "postalCode": "80000",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.8941,
      "longitude": 2.3023
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "14:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "€€",
    "medicalSpecialty": "GeneralPractice",
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Consultation générale"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Suivi médical"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Téléconsultation"
      }
    ],
    "sameAs": []
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://dr-martin.fr" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
