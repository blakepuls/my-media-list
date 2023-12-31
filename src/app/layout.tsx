import Search from "@/components/Search";
import "./globals.css";
import { Inter } from "next/font/google";
import UserMini from "@/components/UserMini";
import Providers from "./providers";
import Link from "next/link";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MyMediaList",
  description: "Track, rate, and share your favorite shows, books, and movies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-800 h-screen`}>
        <Providers>
          <Header />
          <div className="flex flex-col items-center gap-3">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
