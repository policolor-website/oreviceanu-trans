import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { brand } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl font-bold text-white">{brand.name}</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ash mt-1">{brand.tagline}</span>
            </div>
            <p className="text-sm text-ash leading-relaxed mb-6">
              {brand.description}
            </p>
            <p className="text-xs text-stone">24/7 — Available across Germany & Europe</p>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">Fleet</h4>
            <ul className="space-y-3">
              <li><Link href="/fleet/s-class" className="text-sm text-ash hover:text-white transition-colors">First Class Limousine</Link></li>
              <li><Link href="/fleet/e-class" className="text-sm text-ash hover:text-white transition-colors">Business Class Limousine</Link></li>
              <li><Link href="/fleet/v-class" className="text-sm text-ash hover:text-white transition-colors">Business Van</Link></li>
              <li><Link href="/fleet/sprinter" className="text-sm text-ash hover:text-white transition-colors">Group Shuttle</Link></li>
              <li><Link href="/fleet/coach" className="text-sm text-ash hover:text-white transition-colors">Coach with Driver</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services/airport-transfer" className="text-sm text-ash hover:text-white transition-colors">Airport Transfer</Link></li>
              <li><Link href="/services/chauffeur" className="text-sm text-ash hover:text-white transition-colors">Chauffeur Service</Link></li>
              <li><Link href="/services/diplomatic" className="text-sm text-ash hover:text-white transition-colors">Diplomatic Chauffeur</Link></li>
              <li><Link href="/services/group-transfer" className="text-sm text-ash hover:text-white transition-colors">Group Transfer</Link></li>
              <li><Link href="/services/day-tours" className="text-sm text-ash hover:text-white transition-colors">Day Tours</Link></li>
              <li><Link href="/services/event-transfer" className="text-sm text-ash hover:text-white transition-colors">Event Transfer</Link></li>
              <li><Link href="/services/fair-transfer" className="text-sm text-ash hover:text-white transition-colors">Trade Fair Transfer</Link></li>
              <li><Link href="/services/prices" className="text-sm text-ash hover:text-white transition-colors">Prices & Tariffs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-white/50 mt-0.5 shrink-0" />
                <p className="text-sm text-ash">{brand.address}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-white/50 mt-0.5 shrink-0" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-sm text-ash hover:text-white transition-colors">{brand.phone}</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-white/50 mt-0.5 shrink-0" />
                <a href={`mailto:${brand.email}`} className="text-sm text-ash hover:text-white transition-colors">{brand.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-white/50 mt-0.5 shrink-0" />
                <p className="text-sm text-ash">{brand.program}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full mb-8 bg-white/10" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-stone hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-xs text-stone hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-xs text-stone hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
