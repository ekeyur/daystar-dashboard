import { AuthProvider } from "@/contexts/authcontext";
import ColorProvider from "@/components/ColorProvider";
import "./globals.css";

export const metadata = {
  title: "Live Ticker",
  description: "Live Ticker | Daystar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <ColorProvider>
            <div>{children}</div>
          </ColorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
