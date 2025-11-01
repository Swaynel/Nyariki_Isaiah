import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import { ChatbotProvider } from '@/src/components/chatbot/ChatbotProvider';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-main' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-heading' 
});

export const metadata: Metadata = {
  title: 'Isaiah Nyariki - Web Developer',
  description: 'Portfolio of Isaiah Nyariki, a web developer specializing in JavaScript and modern web technologies.',
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