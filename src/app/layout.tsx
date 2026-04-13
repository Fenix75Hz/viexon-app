import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import "./globals.css";

const themeScript = `
(() => {
  const storageKey = "viexon-theme";
  const root = document.documentElement;
  const storedTheme = window.localStorage.getItem(storageKey);
  const theme =
    storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
`;

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Viexon | Gestão comercial premium",
  description:
    "Centralize pedidos, estoque, clientes, consignado e financeiro em uma plataforma premium para operação comercial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
