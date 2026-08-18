"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Truck, ArrowRight } from "lucide-react";

const zones = [
  { name: "București — Sectorul 1", area: "Piața Victoriei, Băneasa, Aviatorilor, Dorobanți, Chitila" },
  { name: "București — Sectorul 2", area: "Colentina, Obor, Pantelimon, Iancului, Aviației" },
  { name: "București — Sectorul 3", area: "Vitan, Titan, Balta Albă, Dristor, Lipscani" },
  { name: "București — Sectorul 4", area: "Olteniței, Berceni, Timpuri Noi, Văcărești" },
  { name: "București — Sectorul 5", area: "Rahova, Ferentari, Eroii Revoluției, Ghencea" },
  { name: "București — Sectorul 6", area: "Drumul Taberei, Militari, Crângași, Giulești" },
  { name: "Ilfov", area: "Pantelimon, Bragadiru, Popești-Leordeni, Voluntari, Chitila, Măgurele" },
  { name: "Transport Național", area: "Livrări în toată țara — orice destinație din România" },
];

export default function PortfolioPage() {
  return (
    <main className="pt-20">
      <section className="py-20 px-6 bg-canvas min-h-screen">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">Zone acoperite</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mb-6">Unde livrăm</h1>
            <p className="text-lg text-ash max-w-2xl mx-auto">
              Oferim transport marfă, mobilă și mutări în București, Ilfov și în toată țara. Indiferent de destinație, ajungem rapid și transportăm marfa în siguranță.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {zones.map((z, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="glass rounded-2xl p-6 hover:border-gold/20 transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream mb-2">{z.name}</h3>
                    <p className="text-sm text-ash leading-relaxed">{z.area}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <Truck size={40} className="text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-cream mb-4">
              Nu vezi zona ta? Livrăm oriunde în țara!
            </h2>
            <p className="text-ash mb-6">Contactează-ne pentru o ofertă personalizată de transport.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors duration-300"
            >
              Cere o ofertă <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
