import "./globals.css";

export const metadata = {
  title: "AuraTravel | GenAI Cultural Destination Discovery",
  description: "Explore the soul of metro cities through their rich heritage, cultural attractions, hidden gems, and local folklore powered by advanced Generative AI.",
  keywords: "travel, culture, metro cities, artificial intelligence, heritage, local legends, festivals, guide",
  authors: [{ name: "AuraTravel Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
