"use client";

import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { brand } from "@/lib/brand";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">Contact</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-cream mb-6">Ai nevoie de transport?</h1>
          <p className="text-lg text-ash max-w-2xl mx-auto">
            Cere o ofertă personalizată pentru transport marfă, mobilă sau mutări. Lasă-ne datele și te contactăm!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Date contact */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gold mb-6">Date de contact</h2>
            <div className="space-y-4">
              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-cream mb-1">Sediul nostru</h3>
                    <p className="text-sm text-ash">{brand.address}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Phone size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-cream mb-1">Telefon</h3>
                    <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-sm text-ash hover:text-gold transition-colors">{brand.phone}</a>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Mail size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-cream mb-1">Email</h3>
                    <a href={`mailto:${brand.email}`} className="text-sm text-ash hover:text-gold transition-colors">{brand.email}</a>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Clock size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-cream mb-1">Program de lucru</h3>
                    <p className="text-sm text-ash">{brand.program}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formular */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gold mb-6">Trimite-ne un mesaj</h2>
            {submitted ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Send size={24} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-cream mb-2">Mesaj trimis!</h3>
                <p className="text-ash">Echipa noastră vă va contacta în cel mai scurt timp posibil.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="glass rounded-2xl p-8 space-y-5"
              >
                <div>
                  <label className="block text-sm text-ash mb-2">Nume complet *</label>
                  <input type="text" required className="w-full bg-ink/50 border border-gold/10 rounded-lg px-4 py-3 text-cream focus:border-gold/40 focus:outline-none transition-colors" placeholder="Numele Dvs." />
                </div>
                <div>
                  <label className="block text-sm text-ash mb-2">E-mail *</label>
                  <input type="email" required className="w-full bg-ink/50 border border-gold/10 rounded-lg px-4 py-3 text-cream focus:border-gold/40 focus:outline-none transition-colors" placeholder="email@exemplu.ro" />
                </div>
                <div>
                  <label className="block text-sm text-ash mb-2">Telefon *</label>
                  <input type="tel" required className="w-full bg-ink/50 border border-gold/10 rounded-lg px-4 py-3 text-cream focus:border-gold/40 focus:outline-none transition-colors" placeholder="07xx xxx xxx" />
                </div>
                <div>
                  <label className="block text-sm text-ash mb-2">Tip serviciu</label>
                  <select className="w-full bg-ink/50 border border-gold/10 rounded-lg px-4 py-3 text-cream focus:border-gold/40 focus:outline-none transition-colors">
                    <option value="" className="bg-ink">Selectați...</option>
                    <option value="marfa" className="bg-ink">Transport Marfă Național</option>
                    <option value="mobila" className="bg-ink">Transport Mobilă & Obiecte Voluminoase</option>
                    <option value="mutari" className="bg-ink">Mutări Rezidențiale & Sedii</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-ash mb-2">Mesaj *</label>
                  <textarea required rows={4} className="w-full bg-ink/50 border border-gold/10 rounded-lg px-4 py-3 text-cream focus:border-gold/40 focus:outline-none transition-colors resize-none" placeholder="Descrieți pe scurt ce doriți să transportați..." />
                </div>
                <button type="submit" className="w-full py-4 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors flex items-center justify-center gap-2">
                  Trimite mesaj <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
