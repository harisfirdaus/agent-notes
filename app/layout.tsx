import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentNotes",
  description: "Agent-controlled note database with a human-friendly PWA interface."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
