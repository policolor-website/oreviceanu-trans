"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  {
    href: "/fleet",
    label: "Fleet",
    children: [
      { href: "/fleet", label: "Overview" },
      { href: "/fleet/s-class", label: "First Class Limousine" },
      { href: "/fleet/e-class", label: "Business Class Limousine" },
      { href: "/fleet/v-class", label: "Business Van" },
      { href: "/fleet/sprinter", label: "Group Shuttle" },
      { href: "/fleet/coach", label: "Coach with Driver" },
    ],
  },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/airport-transfer", label: "Airport Transfer" },
      { href: "/services/chauffeur", label: "Chauffeur Service" },
      { href: "/services/diplomatic", label: "Diplomatic Chauffeur" },
      { href: "/services/group-transfer", label: "Group Transfer" },
      { href: "/services/day-tours", label: "Day Tours" },
      { href: "/services/event-transfer", label: "Event Transfer" },
      { href: "/services/fair-transfer", label: "Trade Fair Transfer" },
      { href: "/services/prices", label: "Prices & Tariffs" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "IT", label: "Italiano" },
  { code: "ZH", label: "中文" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/95 backdrop-blur-md py-3 border-b border-white/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group min-w-0 shrink">
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
              {brand.name}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-0.5 transition-colors duration-300 ${
                scrolled ? "text-ash" : "text-white/70"
              } truncate`}
            >
              {brand.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-8"
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.children ? item.label : null)}
            >
              <Link
                href={item.href}
                className={`text-sm tracking-wide transition-colors duration-300 flex items-center gap-1 ${
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                {item.children && <ChevronDown size={14} className="opacity-50" />}
              </Link>

              {/* Dropdown */}
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 pt-4 -ml-4">
                  <div className="glass rounded-xl py-3 min-w-[240px] shadow-2xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-2.5 text-sm text-ash hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side — language + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language switcher */}
          <div className="relative" onMouseLeave={() => setLangOpen(false)}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              onMouseEnter={() => setLangOpen(true)}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Globe size={15} />
              <span>{activeLang}</span>
              <ChevronDown size={12} className="opacity-50" />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 pt-4">
                <div className="glass rounded-xl py-3 min-w-[140px] shadow-2xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveLang(lang.code);
                        setLangOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-2 text-sm transition-colors ${
                        activeLang === lang.code
                          ? "text-white"
                          : "text-ash hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href={`tel:${brand.phone}`}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Phone size={14} />
            <span>Book now</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white hover:text-white transition-colors duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ink/95 mt-3 mx-4 rounded-xl p-6 animate-fade-up border border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="text-white hover:text-white text-base block py-3 border-b border-white/5"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="text-ash hover:text-white text-sm block py-2"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Language switcher mobile */}
            <div className="flex items-center gap-3 py-4 border-b border-white/5">
              <Globe size={16} className="text-white/50" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`text-sm ${activeLang === lang.code ? "text-white" : "text-ash"}`}
                >
                  {lang.code}
                </button>
              ))}
            </div>

            <a
              href={`tel:${brand.phone}`}
              className="flex items-center gap-2 text-white text-sm mt-4 pt-4"
            >
              <Phone size={14} /> {brand.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
