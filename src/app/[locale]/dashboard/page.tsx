"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { User, Mail, Phone, Calendar, Car, MapPin, Clock, FileText, LogOut, CheckCircle2, XCircle, Clock as ClockIcon } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

interface Booking {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  pickup_time: string | null;
  vehicle: string;
  passengers: string;
  extra_info: string | null;
  distance: string | null;
  duration: string | null;
  price: number | null;
  currency: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { labelKey: string; color: string; icon: any }> = {
  pending: { labelKey: "statusPending", color: "text-yellow-400 bg-yellow-400/10", icon: ClockIcon },
  confirmed: { labelKey: "statusConfirmed", color: "text-green-400 bg-green-400/10", icon: CheckCircle2 },
  completed: { labelKey: "statusCompleted", color: "text-blue-400 bg-blue-400/10", icon: CheckCircle2 },
  cancelled: { labelKey: "statusCancelled", color: "text-red-400 bg-red-400/10", icon: XCircle },
};

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/checkout");
      return;
    }
    setUser(session.user);

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setProfile(profileData);
    setEditForm({
      full_name: profileData?.full_name || "",
      phone: profileData?.phone || "",
    });

    // Load bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    setBookings(bookingsData || []);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editForm.full_name, phone: editForm.phone })
      .eq("id", user.id);
    if (!error) {
      setProfile({ ...profile!, full_name: editForm.full_name, phone: editForm.phone });
      setEditing(false);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">{t("title")}</h1>
            <p className="text-ash">{t("welcome")}, {profile?.full_name || user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-ash hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
          >
            <LogOut size={16} /> {tNav("logout")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{t("profile")}</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-ash hover:text-white transition-colors"
                >
                  {t("edit")}
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tAuth("fullName")}</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tAuth("phone")}</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-white text-ink font-semibold rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? t("saving") : t("save")}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2.5 text-sm text-ash hover:text-white border border-white/10 rounded-lg transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-white/40" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{tAuth("fullName")}</p>
                    <p className="text-sm text-white">{profile?.full_name || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-white/40" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{tAuth("email")}</p>
                    <p className="text-sm text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-white/40" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{tAuth("phone")}</p>
                    <p className="text-sm text-white">{profile?.phone || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">{t("overview")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash">{t("totalBookings")}</span>
                <span className="font-display text-2xl font-bold text-white">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash">{t("confirmed")}</span>
                <span className="font-display text-2xl font-bold text-green-400">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash">{t("completed")}</span>
                <span className="font-display text-2xl font-bold text-blue-400">
                  {bookings.filter((b) => b.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-ash">{t("totalSpent")}</span>
                <span className="font-display text-2xl font-bold text-white">
                  €{bookings.reduce((sum, b) => sum + (b.price || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick action */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-6">{t("newBooking")}</h2>
              <p className="text-sm text-ash mb-6">
                {t("newBookingDesc")}
              </p>
            </div>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-ink font-semibold rounded-lg py-3 hover:bg-white/90 transition-colors"
            >
              {t("bookNow")} <Car size={16} />
            </Link>
          </div>
        </div>

        {/* Bookings history */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-white mb-6">{t("bookingHistory")}</h2>

          {bookings.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Car size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-ash mb-2">{t("noBookings")}</p>
              <Link href="/booking" className="text-sm text-white hover:underline">
                {t("bookFirstRide")} →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <div key={booking.id} className="glass rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-white/40 mt-0.5" />
                        <div>
                          <p className="text-sm text-white font-medium">
                            {booking.origin} → {booking.destination}
                          </p>
                          <p className="text-xs text-stone mt-1">
                            {t("bookedOn")} {new Date(booking.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                          <StatusIcon size={12} /> {t(status.labelKey)}
                        </span>
                        <span className="font-display text-xl font-bold text-white">
                          €{booking.price}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Calendar size={11} /> {t("pickupDate")}
                        </p>
                        <p className="text-sm text-white">{booking.pickup_date || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Clock size={11} /> {t("pickupTime")}
                        </p>
                        <p className="text-sm text-white">{booking.pickup_time || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Car size={11} /> {t("vehicle")}
                        </p>
                        <p className="text-sm text-white">{booking.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("distance")}</p>
                        <p className="text-sm text-white">{booking.distance} · {booking.duration}</p>
                      </div>
                    </div>

                    {booking.extra_info && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("extraInfo")}</p>
                        <p className="text-sm text-ash">{booking.extra_info}</p>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                        <button className="inline-flex items-center gap-2 text-xs text-ash hover:text-white transition-colors">
                          <FileText size={14} /> {t("downloadInvoice")}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
