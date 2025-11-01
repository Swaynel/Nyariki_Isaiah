import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ChatbotProvider } from '@/components/chatbot/ChatbotProvider';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-main' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-heading' 
});

export const metadata: Metadata = {
  title: 'Isaiah Nyariki - Backend Engineer',
  description: 'Portfolio of Isaiah Nyariki, a backend engineer specializing in Node.js and modern web technologies.',
  authors: [{ name: 'Isaiah Nyariki' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider>
          <ChatbotProvider>
            {children}
          </ChatbotProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}