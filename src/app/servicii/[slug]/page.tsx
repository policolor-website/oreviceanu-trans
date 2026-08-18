"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Truck, Package, Home, Check } from "lucide-react";
import { brand } from "@/lib/brand";

const servicesData: Record<string, {
  icon: any;
  title: string;
  hero: string;
  description: string;
  features: string[];
  image: string;
}> = {
  "transport-marfa-national": {
    icon: Truck,
    title: "Transport Marfă Național",
    hero: "Transport Marfă Național",
    description: "Oreviceanu Trans oferă servicii de transport rutier de mărfuri pe tot teritoriul României. Cu autoutilitare moderne și șoferi profesioniști, asigurăm livrări rapide și sigure indiferent de destinație. Transportăm marfă generală, colete, paleți, materiale de construcții, echipamente și orice tip de încărcătură care necesită transport rutier. Ne adaptăm la nevoile fiecărui client, oferind soluții flexibile și prețuri corecte. Indiferent dacă ai nevoie de o cursă locală în București sau de un transport național, suntem partenerul de încredere de care ai nevoie.",
    features: [
      "Transport rutier de mărfuri în toată țara",
      "Autoutilitare moderne și întreținute",
      "Șoferi profesioniști cu experiență",
      "Transport marfă generală, colete, paleți",
      "Materiale de construcții, echipamente, încărcături diverse",
      "Curse locale București & Ilfov",
      "Transport național — orice destinație în România",
      "Livrări rapide și sigure",
      "Prețuri corecte și transparente",
      "Disponibilitate flexibilă în funcție de nevoi",
    ],
    image: "/transport/van-1.jpg",
  },
  "transport-mobila-obiecte-voluminoase": {
    icon: Package,
    title: "Transport Mobilă & Obiecte Voluminoase",
    hero: "Transport Mobilă & Obiecte Voluminoase",
    description: "Transportăm mobilă, electrocasnice și obiecte voluminoase cu maximă grijă și atenție. Asigurăm manipularea, încărcarea și descărcarea în condiții de siguranță, folosind materiale de protecție pentru a preveni deteriorarea. Indiferent dacă ai cumpărat mobilă nouă din magazin, dacă te muți sau dacă trebuie să transporți un obiect voluminos, echipa noastră de profesioniști se ocupă de tot. Dispunem de autoutilitare potrivite pentru orice volum de încărcătură.",
    features: [
      "Transport mobilă nouă din magazin la domiciliu",
      "Transport electrocasnice (frigidere, mașini de spălat, aragaze)",
      "Transport obiecte voluminoase și grele",
      "Manipulare, încărcare și descărcare cu grijă",
      "Materiale de protecție pentru prevenirea deteriorării",
      "Autoutilitare potrivite pentru orice volum",
      "Personal calificat pentru manipularea obiectelor fragile",
      "Transport din/in București și în toată țara",
      "Programare flexibilă în funcție de disponibilitate",
      "Prețuri corecte în funcție de distanță și volum",
    ],
    image: "/transport/van-2.jpg",
  },
  "mutari-rezidentiale-sedii": {
    icon: Home,
    title: "Mutări Rezidențiale & Sedii",
    hero: "Mutări Rezidențiale & Sedii",
    description: "Efectuăm mutări complete pentru apartamente, case, birouri și sedii de firme. Ne ocupăm de tot: ambalare, încărcare, transport și descărcare. Personalul nostru este calificat și experimentat în mutări, asigurându-se că toate bunurile ajung în siguranță la destinație. Folosim materiale de ambalare de calitate pentru protejarea mobilei și a obiectelor fragile. Indiferent de mărimea mutării — de la un apartament cu o cameră la un sediu de firmă — oferim servicii complete la prețuri corecte.",
    features: [
      "Mutări apartamente și case",
      "Mutări birouri și sedii de firme",
      "Ambalare profesională cu materiale de calitate",
      "Demontare și remontare mobilă",
      "Încărcare, transport și descărcare completă",
      "Protejarea mobilei și a obiectelor fragile",
      "Personal calificat și experimentat în mutări",
      "Autoutilitare potrivite pentru orice volum de mutare",
      "Mutări locale București & Ilfov",
      "Mutări naționale în toată țara",
    ],
    image: "/transport/van-3.jpg",
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];

  if (!service) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-cream mb-4">Serviciu negăsit</h1>
          <Link href="/servicii" className="text-gold hover:underline">← Înapoi la servicii</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center max-w-3xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto">
              <service.icon size={32} className="text-gold" />
            </div>
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">{brand.name}</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mb-4">{service.hero}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-canvas">
        <div className="max-w-4xl mx-auto">
          <Link href="/servicii" className="inline-flex items-center gap-2 text-ash hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Toate serviciile
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">{service.title}</h2>
            <p className="text-lg text-ash leading-relaxed mb-12">{service.description}</p>

            <h3 className="font-display text-xl font-bold text-cream mb-6">Ce oferim:</h3>
            <div className="space-y-3">
              {service.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-gold" />
                  </span>
                  <span className="text-cream text-sm leading-relaxed">{feat}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mt-16 glass rounded-2xl p-8 text-center"
          >
            <h3 className="font-display text-2xl font-bold text-cream mb-4">
              Vrei o ofertă personalizată? Apelează-ne!
            </h3>
            <p className="text-ash mb-6"><a href={`tel:${brand.phone.replace(/\./g, "")}`} className="text-gold text-2xl font-bold">{brand.phone}</a></p>
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
