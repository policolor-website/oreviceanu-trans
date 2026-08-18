"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Truck, Package, Home, Award, ShieldCheck, Sparkles, TrendingUp, Users, Clock, Briefcase } from "lucide-react";
import BuildingHero3D from "@/components/building-hero-3d";
import { brand } from "@/lib/brand";

// ============================================
// SERVICII — 3 servicii Oreviceanu Trans
// ============================================
const services = [
  {
    slug: "transport-marfa-national",
    icon: Truck,
    title: "Transport Marfă Național",
    short: "Transport rutier de mărfuri în toată țara",
    text: "Oferim transport rutier de mărfuri pe tot teritoriul României, cu autoutilitare moderne și șoferi profesioniști. Livrăm rapid și sigur, indiferent de destinație.",
    image: "/transport/van-1.jpg",
  },
  {
    slug: "transport-mobila-obiecte-voluminoase",
    icon: Package,
    title: "Transport Mobilă & Obiecte Voluminoase",
    short: "Mobilă, electrocasnice, obiecte grele și voluminoase",
    text: "Transportăm mobilă, electrocasnice și obiecte voluminoase cu maximă grijă. Asigurăm manipularea, încărcarea și descărcarea în condiții de siguranță.",
    image: "/transport/van-2.jpg",
  },
  {
    slug: "mutari-rezidentiale-sedii",
    icon: Home,
    title: "Mutări Rezidențiale & Sedii",
    short: "Mutări apartamente, case, birouri, sedii firme",
    text: "Efectuăm mutări complete pentru apartamente, case, birouri și sedii de firme. Personal calificat, ambalare, încărcare, transport și descărcare.",
    image: "/transport/van-3.jpg",
  },
];

// ============================================
// VALORI — Oreviceanu Trans
// ============================================
const values = [
  { icon: ShieldCheck, title: "Siguranță", text: "Transportăm marfa ta cu maximă grijă. Asigurăm manipularea și livrarea în condiții de siguranță deplină." },
  { icon: Award, title: "Punctualitate", text: "Livram la timp, de fiecare dată. Respectăm programările și termenele stabilite cu clienții noștri." },
  { icon: Sparkles, title: "Flotă Modernă", text: "Autoutilitare întreținute și dotate corespunzător pentru orice tip de transport, indiferent de volum." },
  { icon: TrendingUp, title: "Prețuri Corecte", text: "Oferim prețuri transparente și competitive. Fără costuri ascunse, fără surprize la final." },
];

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 4;
      const animRange = heroHeight - window.innerHeight;
      setScrollProgress(Math.max(0, Math.min(1, scrollY / animRange)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Doors start opening → show hero text immediately
  const handleDoorsOpen = () => {
    setTextVisible(true);
  };

  // Fade out hero text only when user scrolls well past the doors section
  const heroTextOpacity = !textVisible
    ? 0
    : scrollProgress < 0.6
      ? 1
      : 1 - ((scrollProgress - 0.6) / 0.2); // fade out between 60%-80%

  return (
    <main>
      {/* ============================================ */}
      {/* HERO — 3D Building animation */}
      {/* ============================================ */}
      <section className="relative h-[300vh] bg-ink">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <BuildingHero3D onDoorsOpen={handleDoorsOpen} />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/40 via-transparent to-ink/80 pointer-events-none" />

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-4xl text-center px-6 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-xs tracking-[0.25em] uppercase text-gold">Transport marfă • Logistică • Livrări naționale & internaționale</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-display text-6xl md:text-8xl font-bold leading-[0.95] mb-10"
            >
              <span className="gold-text">{brand.name}</span>
              <br />
              <span className="text-white text-3xl md:text-5xl italic font-normal">Transportăm sigur, livrăm la timp</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
            >
              <Link
                href="/servicii"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-gold font-semibold rounded-lg hover:border-gold/50 hover:shadow-[0_4px_30px_rgba(255,107,0,0.25)] transition-all duration-300"
              >
                Serviciile noastre <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-gold font-semibold rounded-lg hover:border-gold/50 hover:shadow-[0_4px_30px_rgba(255,107,0,0.25)] transition-all duration-300"
              >
                Cere o ofertă de transport
              </Link>
            </motion.div>
          </div>

          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 transition-opacity duration-700"
            style={{ opacity: textVisible ? 1 : 0 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DESPRE COMPANIE */}
      {/* ============================================ */}
      <section className="py-24 px-6 relative bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">Cine suntem</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6 leading-tight">
                Transportăm sigur, livrăm <span className="gold-text">la timp</span>
              </h2>
              <p className="text-lg text-ash leading-relaxed mb-6">
                Oreviceanu Trans SRL este o firmă de transport marfă din București, cu experiență în livrări rapide și sigure pe tot teritoriul României. Flotă modernă, șoferi profesioniști și soluții de transport adaptate nevoilor fiecărui client. Laureați Șoimii Transporturilor 2024-2026.
              </p>
              <ul className="grid grid-cols-2 gap-3 mb-8">
                {["Transport marfă național", "Transport mobilă & obiecte voluminoase", "Mutări rezidențiale & sedii", "Autoutilitare moderne", "Șoferi profesioniști", "Livrări rapide & sigure"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-ash">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/despre-noi" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
                Despre noi <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden glass">
                <img
                  src="/transport/van-about.jpg"
                  alt="Oreviceanu Trans"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 hidden md:block">
                <p className="font-display text-4xl font-bold gold-text">5+</p>
                <p className="text-xs text-ash tracking-wide uppercase mt-1">Ani experiență</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATISTICI */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Briefcase, value: "500+", label: "Livrări realizate" },
              { icon: Users, value: "200+", label: "Clienți mulțumiți" },
              { icon: Award, value: "5.0", label: "Rating clienți" },
              { icon: Clock, value: "24/7", label: "Disponibilitate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 mx-auto">
                  <stat.icon size={24} className="text-gold" />
                </div>
                <p className="font-display text-4xl font-bold gold-text mb-2">{stat.value}</p>
                <p className="text-xs text-ash tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VALORI */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">De ce să ne alegi</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">Calitățile noastre</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="glass rounded-2xl p-6 hover:border-gold/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <val.icon size={20} className="text-gold" />
                  </div>
                  <span className="font-display text-2xl font-bold text-stone">0{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-cream mb-3">{val.title}</h3>
                <p className="text-xs text-ash leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICII */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">Ce facem</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">Serviciile noastre</h2>
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
                    <div className="relative h-48 overflow-hidden bg-ink/50 flex items-center justify-center">
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

      {/* ============================================ */}
      {/* CTA */}
      {/* ============================================ */}
      <section className="py-32 px-6 bg-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Ai nevoie de transport? <span className="gold-text">Cere o ofertă!</span>
          </h2>
          <p className="text-lg text-ash mb-10">
            Contactează-ne pentru o ofertă personalizată de transport marfă, mobilă sau mutări. Lasă-ne datele și te contactăm!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors duration-300 text-lg"
          >
            Cere o ofertă <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
