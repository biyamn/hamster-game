import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '햄져게임',
  description: '햄져의 똥을 치우는 게임입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`antialiased`}>
        <div className="mx-auto min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
