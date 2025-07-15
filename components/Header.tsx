import React from "react";
import Link from "next/link";
import {  Eye } from "lucide-react";

import { SignInButton } from "./auth/sign-in-button";
import { ThemeToggle } from "./theme-toggle";

const Header = () => {
  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/about", label: "About EyeNet" },
  ];

  return (
    <div className="w-full fixed top-0 z-50 bg-background/95">
      <div className="  inset-0 border-b border-primary/10">
        <header className="relative max-w-6xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <Eye className="h-7 w-7 text-primary animate-pulse-gentle" />
              <div className="">
                <span className="font-semibold text-lg  bg-clip-text ">
                  EyeNet
                </span>
              </div>
            </Link>
            {/* Header */}
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <SignInButton />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
