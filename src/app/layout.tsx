import './globals.css';

export const metadata = {
  title: 'WhatsApp Receptionist - AI-Powered Booking',
  description: '24/7 AI receptionist for WhatsApp bookings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}