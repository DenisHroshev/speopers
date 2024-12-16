"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    document.title = "SpecOper App";
  }, []);

  const onLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={bodyStyle}
      >
        <header
          style={{
            ...headerStyle,
            borderBottom: pathname === "/" ? "none" : "2px solid #333",
            boxShadow:
              pathname === "/" ? "0px 4px 6px rgba(0, 0, 0, 0.5)" : "none",
          }}
        >
          <div style={logoStyle}>
            <Link href="/" passHref>
              <div style={logoContainerStyle}>
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  style={logoImageStyle}
                />
                <span style={logoTextStyle}>SPECOPER</span>
              </div>
            </Link>
          </div>
          <nav style={menuStyle}>
            <Link href="/" style={menuItemStyle}>
              Головна
            </Link>
            <Link href="/operations" style={menuItemStyle}>
              Операції
            </Link>
            <Link href="/transports" style={menuItemStyle}>
              Транспорт
            </Link>
            {isLoggedIn ? (
              <a style={menuItemStyle} onClick={onLogout}>
                Вихід
              </a>
            ) : (
              <Link href="/login" style={menuItemStyle}>
                Вхід
              </Link>
            )}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

// Додано стилі для фону
const bodyStyle = {
  backgroundColor: "#1A1A1D",
  color: "#F0F0F0",
  margin: 0,
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif",
  overflow: "hidden", // Забороняємо прокрутку на рівні сторінки
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 50px",
};

const logoStyle = {
  display: "flex",
  alignItems: "center",
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const logoImageStyle = {
  width: "40px",
  height: "40px",
  marginRight: "10px",
};

const logoTextStyle = {
  color: "#FFA500",
  fontSize: "24px",
  fontWeight: "bold",
};

const menuStyle = {
  display: "flex",
  gap: "20px",
};

const menuItemStyle = {
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.3s, transform 0.3s",
  cursor: "pointer",
  ":hover": {
    color: "#AAAAAA",
    transform: "translateY(-2px)",
  },
};
