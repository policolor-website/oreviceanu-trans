"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Truck, Package, Home } from "lucide-react";

const services = [
  {
    slug: "transport-marfa-national",
    icon: Truck,
    title: "Transport Marfă Național",
    text: "Oferim transport rutier de mărfuri pe tot teritoriul României, cu autoutilitare moderne și șoferi profesioniști. Livrăm rapid și sigur, indiferent de destinație.",
    image: "/transport/van-1.jpg",
  },
  {
    slug: "transport-mobila-obiecte-voluminoase",
    icon: Package,
    title: "Transport Mobilă & Obiecte Voluminoase",
    text: "Transportăm mobilă, electrocasnice și obiecte voluminoase cu maximă grijă. Asigurăm manipularea, încărcarea și descărcarea în condiții de siguranță.",
    image: "/transport/van-2.jpg",
  },
  {
    slug: "mutari-rezidentiale-sedii",
    icon: Home,
    title: "Mutări Rezidențiale & Sedii",
    text: "Efectuăm mutări complete pentru apartamente, case, birouri și sedii de firme. Personal calificat, ambalare, încărcare, transport și descărcare.",
    image: "/transport/van-3.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-20">
      <section className="py-20 px-6 bg-canvas min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">Ce facem</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mb-6">Serviciile noastre</h1>
            <p className="text-lg text-ash max-w-2xl mx-auto">
              Transport marfă, mobilă și mutări în toată țara. Flotă modernă, șoferi profesioniști, livrări rapide și sigure. Seriozitate și punctualitate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, i) => {
              const animations = [
                { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
                { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
                { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
              ];
              const anim = animations[i % 3];
              return (
                <motion.div
                  key={srv.slug}
                  initial={anim.initial}
                  whileInView={anim.animate}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Link
                    href={`/servicii/${srv.slug}`}
                    className="group block glass rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 h-full"
                  >
                    <div className="relative h-48 overflow-hidden bg-ink/50">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                          <srv.icon size={20} className="text-gold" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-cream">{srv.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-ash leading-relaxed mb-4">{srv.text}</p>
                      <span className="text-gold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Vezi mai mult <ArrowRight size={14} />
                      </span>
                    </div>
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
