import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Header } from "../components/ux/Header";
import { ContextStore } from "../components/ux/providers/store";
import { mergeClassNames } from "../lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Dog walking service in Gig Harbor, WA",
  title: "Paws on the Harbor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={mergeClassNames(
          "flex min-h-screen min-w-full",
          inter.className,
        )}
      >
        <div className="flex flex-col w-full px-5 py-2">
          <ContextStore>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <div className="flex flex-col h-full mx-auto px-5 py-2"> */}
              {/* Consider adding a prop for the client component button for singing out. */}
              <Header />
              <div className="flex-1 flex justify-center">{children}</div>
              {/* </div> */}
            </ThemeProvider>
          </ContextStore>
        </div>
      </body>
    </html>
  );
}
