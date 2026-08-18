"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

const navItems = [
  { href: "/", label: "Acasă" },
  { href: "/despre-noi", label: "Despre Noi" },
  { href: "/servicii", label: "Servicii" },
  { href: "/portofoliu", label: "Portofoliu" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-ink/95 backdrop-blur-md py-3 border-b border-gold/20" : "py-5 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group min-w-0 shrink">
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-display text-xl sm:text-2xl font-bold gold-text tracking-tight truncate">{brand.name}</span>
            <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-0.5 transition-colors duration-300 ${scrolled ? "text-ash" : "text-white/70"} truncate`}>{brand.tagline}</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors duration-300 ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "text-gold" : "text-white hover:text-gold"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href={`tel:${brand.phone}`} className={`flex items-center gap-2 text-sm transition-colors ${scrolled ? "text-ash hover:text-gold" : "text-white hover:text-gold"}`}>
            <Phone size={14} />
            <span>Cere o ofertă</span>
          </a>
        </div>

        <button
          className="lg:hidden w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white hover:text-gold transition-colors duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-ink/95 mt-3 mx-4 rounded-xl p-6 animate-fade-up border border-gold/20">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-white hover:text-gold text-base block py-2">
                {item.label}
              </Link>
            ))}
            <a href={`tel:${brand.phone}`} className="flex items-center gap-2 text-gold text-sm mt-4 pt-4 border-t border-gold/10">
              <Phone size={14} /> {brand.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
