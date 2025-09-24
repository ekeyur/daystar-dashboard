import { AuthProvider } from "@/contexts/authcontext";
import "./globals.css";

export const metadata = {
  title: "Live Ticker",
  description: "Live Ticker | Daystar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="corporate">
      <body>
        <AuthProvider>
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
