import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Voxora — Voice Accessibility SaaS",
    template: "%s | Voxora",
  },
  description:
    "Voxora helps teams build, govern, and measure accessible voice communication workflows from one secure workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
