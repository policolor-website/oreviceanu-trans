"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Plane, Car, Shield, Users, MapPin, Calendar, Building, Tag } from "lucide-react";

const services = [
  { key: "airport", href: "/services/airport-transfer", icon: Plane },
  { key: "chauffeur", href: "/services/chauffeur", icon: Car },
  { key: "diplomatic", href: "/services/diplomatic", icon: Shield },
  { key: "group", href: "/services/group-transfer", icon: Users },
  { key: "dayTours", href: "/services/day-tours", icon: MapPin },
  { key: "event", href: "/services/event-transfer", icon: Calendar },
  { key: "fair", href: "/services/fair-transfer", icon: Building },
  { key: "prices", href: "/services/prices", icon: Tag },
];

export default function ServicesPage() {
  const t = useTranslations("ServicePages");
  const tServices = useTranslations("Services");

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
            {tServices("badge")}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
            {tServices("title")}
          </h1>
          <p className="text-lg text-ash leading-relaxed max-w-2xl mx-auto">
            {tServices("description")}
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    href={service.href}
                    className="block glass rounded-2xl p-8 h-full hover:border-electric/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-electric/20 flex items-center justify-center mb-6">
                      <Icon size={24} className="text-electric" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-cream mb-3">
                      {t(`${service.key}.badge`)}
                    </h3>
                    <p className="text-sm text-ash leading-relaxed mb-4">
                      {t(`${service.key}.description`)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-white group-hover:gap-3 transition-all">
                      {tServices("learnMore")} <ArrowRight size={16} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
