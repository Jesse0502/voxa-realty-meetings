import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";

const navLinks = [
  { label: "Sign In", to: "/login" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Voice Library", to: "/voice-library" },
];

interface PublicNavbarProps {
  onBookCall?: () => void;
}

export function PublicNavbar({ onBookCall }: PublicNavbarProps) {
  const location = useLocation();
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > lastY && y > 80);
      if (y > 80) setMobileMenuOpen(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-4 z-30 px-4 sm:top-6 transition-transform duration-300 ${
        navHidden ? "-translate-y-[calc(100%+1.5rem)]" : "translate-y-0"
      }`}
    >
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#071220]/65 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-[12px]">
        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <a href="/" className="flex items-center gap-2">
            <img src={voxaLogoDark} alt="Voxa Realty" className="h-9 w-auto sm:h-10" />
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? "text-[#119c9e]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {onBookCall ? (
              <Button
                className="hidden md:inline-flex h-10 rounded-xl bg-[#119c9e] px-4 text-sm font-semibold text-white hover:bg-[#0e8082]"
                onClick={onBookCall}
              >
                Book a call
              </Button>
            ) : (
              <Link
                to="/"
                className="hidden md:inline-flex h-10 items-center rounded-xl bg-[#119c9e] px-4 text-sm font-semibold text-white hover:bg-[#0e8082]"
              >
                Book a call
              </Link>
            )}
            <button
              className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-white/10 px-4 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center py-3 text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? "text-[#119c9e]"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/10 pt-3">
              {onBookCall ? (
                <Button
                  className="h-11 w-full rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookCall();
                  }}
                >
                  Book a call
                </Button>
              ) : (
                <Link
                  to="/"
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book a call
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
