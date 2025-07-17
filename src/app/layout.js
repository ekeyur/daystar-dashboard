import { AuthProvider } from "@/contexts/authcontext";
import { SWRConfig } from "swr";
import "./globals.css";

export const metadata = {
  title: "Campaign Dashboard",
  description: "Current Campaign Dashboard | Daystar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="corporate">
      <body>
        <AuthProvider>
          <SWRConfig
            value={{
              errorRetryCount: 3,
              errorRetryInterval: 5000,
            }}
          >
            <div>{children}</div>
          </SWRConfig>
        </AuthProvider>
      </body>
    </html>
  );
}
