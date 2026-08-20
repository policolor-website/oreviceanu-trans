"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Plane,
  Car,
  Calendar,
  Users,
  ShieldCheck,
  UserCheck,
  Radar,
  MapPin,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import BuildingHero3D from "@/components/building-hero-3d";
import PlacesInput from "@/components/places-input";
import { brand } from "@/lib/brand";

// ============================================
// CONTENT — structured for easy i18n extraction
// All text here will be moved to messages/en.json
// ============================================

const howItWorks = [
  {
    icon: MapPin,
    title: "Enter your route",
    desc: "Pickup location, destination, date and time — tell us where and when.",
  },
  {
    icon: Star,
    title: "Get a fixed price",
    desc: "Transparent pricing with all services included. No surprises, no hidden fees.",
  },
  {
    icon: Car,
    title: "Relax and travel",
    desc: "Your chauffeur arrives on time and takes you safely to your destination.",
  },
];

const whyUs = [
  {
    icon: ShieldCheck,
    title: "Safe Travel",
    desc: "Travel with peace of mind — every ride is professionally planned, carefully executed and fully insured from start to finish.",
  },
  {
    icon: UserCheck,
    title: "Professional Chauffeur",
    desc: "Your personal chauffeur arrives impeccably dressed in a dark suit with shirt and tie. Always professional, always punctual.",
  },
  {
    icon: Radar,
    title: "Flight Monitoring",
    desc: "We track your flight in real time. Early arrival or delay — we adjust automatically and are there when you need us.",
  },
];

const whyUsImages = [
  "/fleet/bento-b.webp",
  "/fleet/chauffeur-driven-passenger-1.webp",
  "/fleet/bento-tall.webp",
];

const services = [
  {
    icon: Plane,
    title: "Airport Transfer",
    desc: "Smooth, punctual transfers to and from all major European airports.",
    image: "/fleet/chauffeur-driven-passenger-1.webp",
  },
  {
    icon: Car,
    title: "Chauffeur Service",
    desc: "Travel in comfort and elegance in our fleet of premium vehicles with professional chauffeurs.",
    image: "/fleet/off-limousine.webp",
  },
  {
    icon: Calendar,
    title: "Day Tours",
    desc: "Early morning departure or late arrival — we're on the road for you around the clock.",
    image: "/fleet/gal-1.webp",
  },
  {
    icon: Users,
    title: "Group Transfer",
    desc: "From minibus to coach — reliable transport with driver for groups of any size.",
    image: "/fleet/bento-wide.webp",
  },
];

const fleet = [
  { name: "Mercedes S-Class", class: "First Class Limousine", passengers: 3, luggage: 3, image: "/fleet/veh-s-klasse.webp" },
  { name: "Mercedes E-Class", class: "Business Class Limousine", passengers: 3, luggage: 3, image: "/fleet/veh-e-klasse.webp" },
  { name: "Mercedes V-Class", class: "Business Van", passengers: 7, luggage: 7, image: "/fleet/veh-v-klasse.webp" },
  { name: "Mercedes Sprinter", class: "Group Shuttle", passengers: 20, luggage: 20, image: "/fleet/veh-sprinter.webp" },
  { name: "Large Coach", class: "Travel Coach", passengers: 50, luggage: 50, image: "/fleet/veh-reisebus.webp" },
];

const routes = [
  { name: "Munich Airport MUC", distance: "40 km", time: "45 min" },
  { name: "Tegernsee", distance: "55 km", time: "1 hr" },
  { name: "Garmisch / Zugspitze", distance: "90 km", time: "1.5 hr" },
  { name: "Memmingen Airport", distance: "110 km", time: "1.5 hr" },
  { name: "Neuschwanstein", distance: "120 km", time: "2 hr" },
  { name: "Salzburg", distance: "145 km", time: "1.5 hr" },
  { name: "Innsbruck", distance: "160 km", time: "2 hr" },
  { name: "Nuremberg", distance: "170 km", time: "1.75 hr" },
];

const testimonials = [
  {
    initials: "FP",
    name: "Fruzsina P.",
    location: "Munich",
    text: "Extremely reliable service! We booked round trip — always on time, super polite and helpful. They track when your flight lands and pick you up right at arrivals. We'll use your service again!",
  },
  {
    initials: "CU",
    name: "Clemens U.",
    location: "Munich",
    text: "As a consultant I travel a lot by plane and therefore drive almost every week — and I'm extremely satisfied! The cars are always immaculate, mostly upper-class limousines like the Mercedes S-Class.",
  },
  {
    initials: "AC",
    name: "Angeline C.",
    location: "Munich",
    text: "The entire booking process was highly professional and smooth. The team was reachable even in the early morning hours and responsive. The vehicle was perfect for our extensive luggage.",
  },
  {
    initials: "AM",
    name: "Andre M.",
    location: "Munich",
    text: "We had a four-day trip with our driver. Super service — helpful, punctual, very polite and always friendly. Dropped us directly at the hotel and reliably picked us up again.",
  },
  {
    initials: "SA",
    name: "Sarah A.",
    location: "Munich",
    text: "All I can say is: WOW. When we come to Munich, we will definitely not use any other car service — that much is certain!",
  },
  {
    initials: "GM",
    name: "G. M.",
    location: "Munich",
    text: "Fantastic service. Punctual, safe driving, clean and first-class vehicle. 10/10.",
  },
];

const faqItems = [
  {
    q: "What areas do you cover?",
    a: "We offer chauffeur and airport transfer services throughout Germany and to all major airports in Europe, including Frankfurt, Munich, Berlin, Paris, Amsterdam, Vienna, Zurich and more.",
  },
  {
    q: "What vehicle types do you offer?",
    a: "Mercedes E-Class and S-Class for up to three passengers, V-Class for up to six people with luggage, a Sprinter for 20 passengers and a 50-seat coach for larger groups.",
  },
  {
    q: "Are your services available 24/7?",
    a: "Yes, we are available 24/7. Whether early morning airport transfer or late night pickup — our chauffeurs are ready anytime.",
  },
  {
    q: "Can I book short-term?",
    a: "Yes, short-term bookings are possible depending on vehicle availability. For urgent requests, it's best to call us directly.",
  },
  {
    q: "Do you offer Meet & Greet at the airport?",
    a: "Of course. Your chauffeur welcomes you in the terminal with a name sign, helps with luggage and accompanies you to the vehicle — for a smooth, carefree experience.",
  },
  {
    q: "Do you track flight arrivals and delays?",
    a: "Yes. We monitor your flight in real-time to ensure punctual pickups — even if your flight arrives earlier or later than scheduled.",
  },
];

// ============================================
// COMPONENT
// ============================================
export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    vehicle: "E-Class",
  });
  const [priceResult, setPriceResult] = useState<any>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

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

  const handleDoorsOpen = () => setTextVisible(true);

  const handleGetPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.origin || !bookingForm.destination) {
      setPriceError("Please enter pickup and destination.");
      return;
    }
    setPriceLoading(true);
    setPriceError(null);
    setPriceResult(null);
    try {
      const res = await fetch("/api/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: bookingForm.origin,
          destination: bookingForm.destination,
          vehicle: bookingForm.vehicle,
          time: bookingForm.time,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPriceError(data.error || "Failed to calculate price.");
      } else {
        setPriceResult(data);
      }
    } catch {
      setPriceError("Network error. Please try again.");
    } finally {
      setPriceLoading(false);
    }
  };

  const heroTextOpacity = !textVisible
    ? 0
    : scrollProgress < 0.6
      ? 1
      : 1 - ((scrollProgress - 0.6) / 0.2);

  return (
    <main>
      {/* ============================================ */}
      {/* HERO — 3D Car animation */}
      {/* ============================================ */}
      <section className="relative h-[110vh] bg-ink">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <BuildingHero3D onDoorsOpen={handleDoorsOpen} />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/40 via-transparent to-ink/80 pointer-events-none" />

          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass"
            >
              <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
              <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white whitespace-nowrap">24-hour airport transfer - Professional chauffeurs</span>
            </motion.div>
          </div>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-4xl text-center px-6 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl md:text-9xl font-bold leading-[0.95] mb-4 flex flex-col items-center"
            >
              <span className="text-white">{brand.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-sm md:text-lg italic font-normal text-center px-4"
            >
              Exclusive airport transfers in Munich, Frankfurt, Berlin, Cologne/Bonn, Hamburg, Düsseldorf &amp; more
            </motion.p>
          </div>

          <div
            className="absolute top-[68%] left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl text-center px-6 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 hover:shadow-[0_4px_30px_rgba(0,128,255,0.15)] transition-all duration-300"
              >
                About us <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 hover:shadow-[0_4px_30px_rgba(0,128,255,0.15)] transition-all duration-300"
              >
                Our services <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 transition-opacity duration-700"
            style={{ opacity: textVisible ? 1 : 0 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BOOKING BAR — wide linear form below hero */}
      {/* ============================================ */}
      <section className="bg-canvas px-6 py-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 shadow-2xl"
          >
            <form onSubmit={handleGetPrice} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">Pickup</label>
                <PlacesInput
                  value={bookingForm.origin}
                  onChange={(val) => setBookingForm({ ...bookingForm, origin: val })}
                  placeholder="Airport, hotel, address..."
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">Destination</label>
                <PlacesInput
                  value={bookingForm.destination}
                  onChange={(val) => setBookingForm({ ...bookingForm, destination: val })}
                  placeholder="Where to?"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">Vehicle</label>
                <select
                  value={bookingForm.vehicle}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicle: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                >
                  <option>E-Class</option>
                  <option>S-Class</option>
                  <option>V-Class</option>
                  <option>Sprinter</option>
                  <option>Coach</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={priceLoading}
                  className="w-full bg-ink text-white font-semibold rounded-lg py-3 border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {priceLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Get price <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>

            {priceError && (
              <div className="mt-4 text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3 border border-red-400/20">
                {priceError}
              </div>
            )}

            {priceResult && (
              <>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price details */}
                <div className="glass rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 uppercase tracking-wide">Fixed price</span>
                    <span className="font-display text-3xl font-bold text-white">
                      €{priceResult.price.total}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-ash">
                    <div className="flex justify-between">
                      <span>Distance</span>
                      <span className="text-white">{priceResult.route.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span className="text-white">{priceResult.route.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle</span>
                      <span className="text-white">{priceResult.price.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate</span>
                      <span className="text-white">€{priceResult.price.perKm}/km</span>
                    </div>
                    {priceResult.price.breakdown.nightSurcharge && (
                      <div className="flex justify-between">
                        <span>Night surcharge</span>
                        <span className="text-white">{priceResult.price.breakdown.nightSurcharge}</span>
                      </div>
                    )}
                    {priceResult.price.breakdown.airportFee && (
                      <div className="flex justify-between">
                        <span>Airport fee</span>
                        <span className="text-white">+€{priceResult.price.breakdown.airportFee}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-stone pt-2 border-t border-white/10">
                    {priceResult.route.startAddress} → {priceResult.route.endAddress}
                  </div>
                </div>
                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-white/10 min-h-[200px]">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "200px" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?saddr=${encodeURIComponent(priceResult.route.startAddress)}&daddr=${encodeURIComponent(priceResult.route.endAddress)}&output=embed`}
                    title="Route map"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Stripe checkout — redirect to /api/checkout
                    alert("Stripe checkout coming soon!");
                  }}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300"
                >
                  Reserve now <ArrowRight size={18} />
                </button>
              </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
      <section className="py-24 px-6 bg-canvas">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Easy booking</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
              In a few steps to your <span className="neon-text">chauffeur</span>
            </h2>
            <p className="text-lg text-ash max-w-2xl mx-auto">
              Enter your route, receive a transparent fixed price and lean back. No waiting, no hidden costs — just a professional chauffeur ready on time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-electric/10 flex items-center justify-center mb-6 mx-auto">
                  <step.icon size={28} className="text-electric" />
                </div>
                <div className="font-display text-5xl font-bold text-stone mb-4">0{i + 1}</div>
                <h3 className="font-display text-xl font-bold text-cream mb-3">{step.title}</h3>
                <p className="text-sm text-ash leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRAVEL WITH CONFIDENCE — FAQ left + features right */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Why choose us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              Travel with <span className="neon-text">confidence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT — FAQ */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">FAQ</span>
              <h3 className="font-display text-2xl font-bold text-cream mb-8">Frequently asked questions</h3>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <div key={i} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-display text-sm font-bold text-cream pr-4">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-white flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openFaq === i ? "200px" : "0px" }}
                    >
                      <p className="px-5 pb-5 text-sm text-ash leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — comfort text + 3 features */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Our promise</span>
              <h3 className="font-display text-2xl font-bold text-cream mb-6">
                Your comfort and safety, <span className="neon-text">redefined</span>
              </h3>
              <p className="text-sm text-ash leading-relaxed mb-10">
                At TrendMyDrive, we're redefining airport travel across Germany and Europe — with a first-class chauffeur service built on comfort, reliability and style. Whether you're arriving or departing, we ensure a smooth, stress-free journey from your doorstep to any major European airport — and back.
              </p>

              <div className="space-y-6">
                {whyUs.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center">
                      <item.icon size={22} className="text-electric" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-cream mb-2">{item.title}</h4>
                      <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICES — 4 cards */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">What we offer</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              Our <span className="neon-text">services</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              We specialize in first-class chauffeur service — focused on comfort, punctuality and professionalism.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href="/services"
                  className="group block glass rounded-2xl overflow-hidden hover:border-electric/30 transition-all duration-500 h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover bw-image group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-electric/20 backdrop-blur-sm flex items-center justify-center">
                        <srv.icon size={20} className="text-electric" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-cream">{srv.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-ash leading-relaxed mb-4">{srv.desc}</p>
                    <span className="text-white text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FLEET — 5 vehicles */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Our vehicles</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              Our <span className="neon-text">fleet</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              From elegant limousines to spacious coaches — choose the right vehicle for any occasion. All vehicles are premium equipped and impeccably maintained.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {fleet.map((vehicle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl overflow-hidden hover:border-electric/30 transition-all duration-500"
              >
                <div className="relative h-40 overflow-hidden bg-ink/50">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover bw-image"
                  />
                  <div className="absolute inset-0 bg-ink/30" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-cream mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-white/60 uppercase tracking-wide mb-4">{vehicle.class}</p>
                  <div className="flex items-center gap-4 text-xs text-ash">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-electric" /> {vehicle.passengers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane size={14} className="text-electric" /> {vehicle.luggage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Book your chauffeur */}
      {/* ============================================ */}
      <section className="py-32 px-6 bg-canvas relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/fleet/cta-experience.webp" alt="" className="w-full h-full object-cover bw-image" />
          <div className="absolute inset-0 bg-ink/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Book your chauffeur today — <span className="neon-text">wherever you are in Europe</span>
          </h2>
          <p className="text-lg text-ash mb-10">
            Whether flight, business appointment or special event — we ensure a smooth, punctual and luxurious ride. With 24/7 availability and coverage of all major European airports, your perfect ride is just one click away.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-ink text-white font-semibold rounded-lg border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 text-lg"
          >
            Request a quote <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS — Google reviews */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Reviews</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              What our <span className="neon-text">customers say</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              Thousands of satisfied passengers trust us — for airport transfers, business trips and special occasions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-white fill-white" />
                  ))}
                </div>
                <p className="text-sm text-ash leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{review.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cream">{review.name}</p>
                    <p className="text-xs text-stone">Google Review · {review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* POPULAR ROUTES — from Munich */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-canvas">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">Popular routes</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              Routes we drive <span className="neon-text">regularly</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              From the city center to the airport, into the mountains or across the border. Distance and approximate travel time from Munich.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-xl p-5 hover:border-electric/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-electric" />
                  <h3 className="font-display text-sm font-bold text-cream">{route.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-ash">
                  <span>{route.distance}</span>
                  <span className="text-stone">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {route.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-stone mt-8">
            Travel times are approximate and may vary depending on traffic.
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <section className="py-32 px-6 bg-canvas">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Experience chauffeur travel <span className="neon-text">as it should be</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-ink text-white font-semibold rounded-lg border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 text-lg"
          >
            Get in touch <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
