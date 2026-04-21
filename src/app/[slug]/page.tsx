"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Heart,
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  Building,
  Car,
  Hotel,
  Upload,
  Image as ImageIcon,
  Check,
  Users,
  Gift,
  Plane,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface WeddingData {
  id: string;
  slug: string;
  name1: string;
  name2: string;
  last_name: string;
  wedding_date: string;
  story: Array<{ year: string; title: string; description: string }>;
  schedule: Array<{ time: string; event: string; location: string; description: string }>;
  venues: {
    ceremony: { name: string; address: string; city: string; time: string; description: string };
    reception: { name: string; address: string; city: string; time: string; description: string };
  };
  photos: Array<{ id: number; src: string; alt: string; category: string }>;
  faq: Array<{ question: string; answer: string }>;
  registry: Array<{ name: string; url: string }>;
  accommodations: Array<{ name: string; distance: string; phone: string }>;
  guest_photos: string[];
  rsvps: Array<{ name: string; email: string; attending: string; guests: string; meal: string; dietary: string }>;
}

const defaultData: WeddingData = {
  id: "",
  slug: "",
  name1: "Sarah",
  name2: "James",
  last_name: "",
  wedding_date: "2026-09-15",
  story: [
    { year: "2018", title: "We Met", description: "A mutual friend's birthday party brought us together." },
    { year: "2019", title: "First Date", description: "Coffee at the local bookstore turned into a 5-hour conversation." },
    { year: "2023", title: "The Proposal", description: "Under the stars, he got down on one knee." },
    { year: "2026", title: "The Wedding", description: "And now, we're ready to start this next chapter." },
  ],
  schedule: [
    { time: "2:00 PM", event: "Ceremony", location: "St. Mary's Cathedral", description: "The moment we've been waiting for" },
    { time: "3:30 PM", event: "Cocktail Hour", location: "Garden", description: "Enjoy drinks and hors d'oeuvres" },
    { time: "5:00 PM", event: "Reception", location: "Ballroom", description: "First dance and welcome" },
    { time: "6:00 PM", event: "Dinner", location: "Ballroom", description: "Three course dinner" },
    { time: "8:30 PM", event: "First Dance", location: "Ballroom", description: "Our first dance as a married couple" },
    { time: "9:00 PM", event: "Party!", location: "Ballroom", description: "Dance the night away" },
  ],
  venues: {
    ceremony: { name: "St. Mary's Cathedral", address: "123 Church Street", city: "San Francisco, CA 94102", time: "2:00 PM", description: "Join us for our ceremony." },
    reception: { name: "The Grand Ballroom", address: "456 Vineyard Lane", city: "Napa, CA 94558", time: "5:00 PM", description: "Celebrate with us!" },
  },
  photos: [
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", alt: "Couple", category: "engagement" },
    { id: 2, src: "https://images.unsplash.com/photo-1511285560982-1356c11d4606?w=800", alt: "Rings", category: "details" },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", alt: "Walking", category: "engagement" },
    { id: 4, src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800", alt: "Flowers", category: "details" },
    { id: 5, src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=800", alt: "Portrait", category: "portrait" },
    { id: 6, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800", alt: "Cake", category: "details" },
  ],
  faq: [
    { question: "What is the dress code?", answer: "Formal attire. Cocktail dresses for ladies, suits for gentlemen." },
    { question: "Is there parking?", answer: "Yes, complimentary parking at both venues." },
    { question: "Can I bring a plus one?", answer: "Only those named on the invitation." },
    { question: "Are children welcome?", answer: "Adult-only celebration." },
  ],
  registry: [
    { name: "Crate & Barrel", url: "https://www.crateandbarrel.com" },
    { name: "Williams Sonoma", url: "https://www.williams-sonoma.com" },
    { name: "Honeymoon Fund", url: "#" },
  ],
  accommodations: [
    { name: "The Ritz-Carlton", distance: "5 min", phone: "(555) 123-4567" },
    { name: "Marriott Downtown", distance: "10 min", phone: "(555) 234-5678" },
  ],
  guest_photos: [],
  rsvps: [],
};

export default function WeddingPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [guestPhotos, setGuestPhotos] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: "0",
    meal: "",
    dietary: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      const { data, error } = await supabase
        .from("couples")
        .select("*")
        .eq("slug", slug.toLowerCase())
        .eq("status", "published")
        .single();

      if (error || !data) {
        setWeddingData(defaultData as WeddingData);
      } else {
        setWeddingData({
          ...defaultData,
          ...data,
          story: data.story || defaultData.story,
          schedule: data.schedule || defaultData.schedule,
          venues: data.venues || defaultData.venues,
          photos: data.photos || defaultData.photos,
          faq: data.faq || defaultData.faq,
          registry: data.registry || defaultData.registry,
          accommodations: data.accommodations || defaultData.accommodations,
          guest_photos: data.guest_photos || [],
        });
        setGuestPhotos(data.guest_photos || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  const couple = weddingData || defaultData;
  const uploadUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/upload`;
    }
    return "";
  }, []);

  const filteredPhotos =
    selectedCategory === "all"
      ? (couple.photos || defaultData.photos)
      : (couple.photos || defaultData.photos).filter((p) => p.category === selectedCategory);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRsvpSubmitted(true);

    // Save RSVP to database
    if (weddingData) {
      const newRsvps = [...(weddingData.rsvps || []), rsvpData];
      await supabase.from("couples").update({ rsvps: newRsvps }).eq("id", weddingData.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const fakeUrl = URL.createObjectURL(selectedFile);
    const newGuestPhotos = [fakeUrl, ...guestPhotos];
    setGuestPhotos(newGuestPhotos);
    setSelectedFile(null);
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);

    // Upload to storage and save URL
    // Note: Actual uploads need server-side handling
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
            alt="Wedding couple"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm md:text-base uppercase tracking-[0.3em] mb-4"
          >
            We&apos;re Getting Married
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4"
          >
            {couple.name1} <span className="text-accent">&</span> {couple.name2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl font-light mb-8"
          >
            {couple.wedding_date} • {couple.venues?.ceremony?.city || "San Francisco, CA"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CountdownTimer targetDate={couple.wedding_date} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="animate-bounce">
            <ArrowRight className="w-6 h-6 rotate-90 text-white/70" />
          </div>
        </motion.div>
      </section>

      {/* Save the Date */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-8 h-8 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl text-foreground mb-6">Save the Date</h2>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              We are so excited to celebrate our special day with you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue Preview */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-background p-8 rounded-lg shadow-sm"
            >
              <Calendar className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-serif text-2xl mb-2">The Ceremony</h3>
              <p className="text-muted mb-2">{couple.venues?.ceremony?.time}</p>
              <p className="text-foreground">{couple.venues?.ceremony?.name}</p>
              <p className="text-sm text-muted">{couple.venues?.ceremony?.city}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-background p-8 rounded-lg shadow-sm"
            >
              <MapPin className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-serif text-2xl mb-2">The Reception</h3>
              <p className="text-muted mb-2">{couple.venues?.reception?.time}</p>
              <p className="text-foreground">{couple.venues?.reception?.name}</p>
              <p className="text-sm text-muted">{couple.venues?.reception?.city}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-20 px-4 bg-background scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Our Story</h2>
            <p className="text-muted text-lg">The journey of {couple.name1} & {couple.name2}</p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary" />
            {(couple.story || defaultData.story).map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 pl-12 md:pl-0 md:px-8">
                  <div
                    className={`bg-secondary/20 p-6 rounded-lg ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <span className="text-primary font-serif text-3xl block mb-2">{item.year}</span>
                    <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 px-4 bg-secondary/20 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Wedding Day Schedule</h2>
            <p className="text-muted text-lg">{couple.wedding_date}</p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-secondary" />
            {(couple.schedule || defaultData.schedule).map((item, index) => (
              <motion.div
                key={item.event}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 bg-background p-6 rounded-lg shadow-sm border border-secondary/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <h3 className="font-serif text-xl text-primary">{item.event}</h3>
                    <span className="text-lg font-medium">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-muted text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section id="venues" className="py-20 px-4 bg-background scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MapPin className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Venues</h2>
            <p className="text-muted text-lg">Where to go and how to get there</p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-background rounded-lg shadow-sm border border-secondary/30 overflow-hidden"
          >
            <div className="h-64 bg-secondary/30 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019204339422!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsNDYnMjQuNCJOIFxiMjAuNDlNTOU1!5e0!3m2!1sen!2sus!4v"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-2">{couple.venues?.ceremony?.name}</h3>
                  <p className="text-muted mb-2">{couple.venues?.ceremony?.address}</p>
                  <p className="text-muted mb-4">{couple.venues?.ceremony?.city}</p>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span>{couple.venues?.ceremony?.time}</span>
                  </div>
                  <p className="text-muted mt-4">{couple.venues?.ceremony?.description}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(couple.venues?.ceremony?.address + ", " + couple.venues?.ceremony?.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
                >
                  <Car className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-background rounded-lg shadow-sm border border-secondary/30 overflow-hidden"
          >
            <div className="h-64 bg-secondary/30 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019204339422!2d-122.28!3d38.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCoDE4LjAxLjIiTiAxMjIuMjFNTTU1!5e0!3m2!1sen!2sus!4v"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-2">{couple.venues?.reception?.name}</h3>
                  <p className="text-muted mb-2">{couple.venues?.reception?.address}</p>
                  <p className="text-muted mb-4">{couple.venues?.reception?.city}</p>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span>{couple.venues?.reception?.time}</span>
                  </div>
                  <p className="text-muted mt-4">{couple.venues?.reception?.description}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(couple.venues?.reception?.address + ", " + couple.venues?.reception?.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
                >
                  <Car className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="font-serif text-2xl text-center mb-8">Where to Stay</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(couple.accommodations || defaultData.accommodations).map((hotel) => (
              <div key={hotel.name} className="bg-secondary/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="w-5 h-5 text-primary" />
                  <h4 className="font-serif">{hotel.name}</h4>
                </div>
                <p className="text-sm text-muted mb-2">{hotel.distance} from venue</p>
                <a href={`tel:${hotel.phone}`} className="text-sm text-primary hover:text-primary-light">
                  {hotel.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section id="photos" className="py-20 px-4 bg-secondary/20 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Photos</h2>
            <p className="text-muted text-lg">Our favorite moments together</p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {["all", ...new Set((couple.photos || defaultData.photos).map((p) => p.category))].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-secondary/30 text-muted hover:bg-secondary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedPhoto(photo.id as number)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setSelectedPhoto(null)}
            >
              <ArrowRight className="w-8 h-8 rotate-45" />
            </button>
            <Image
              src={filteredPhotos.find((p) => p.id === selectedPhoto)?.src || ""}
              alt={filteredPhotos.find((p) => p.id === selectedPhoto)?.alt || ""}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </section>

      {/* Memories */}
      <section id="memories" className="py-20 px-4 bg-background scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Share Your Memories</h2>
            <p className="text-muted text-lg">Scan to share photos from our special day</p>
          </motion.div>
        </div>

        <div className="max-w-lg mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-secondary/20 p-8 rounded-lg text-center"
          >
            <h3 className="font-serif text-xl mb-6">Scan to Upload Your Photos</h3>
            <div className="bg-white p-4 rounded-lg inline-block mb-6">
              {uploadUrl && <QRCodeSVG value={uploadUrl} size={200} level="H" includeMargin />}
            </div>
            <p className="text-muted text-sm">
              or visit: <br />
              <span className="text-primary font-medium break-all">{uploadUrl}</span>
            </p>
          </motion.div>
        </div>

        <div className="max-w-lg mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-background p-8 rounded-lg shadow-sm border border-secondary/30"
          >
            <h3 className="font-serif text-xl mb-6 text-center">Upload Photos Directly</h3>

            {!uploadSuccess ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-secondary rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-10 h-10 text-muted mb-2" />
                    <span className="text-muted">
                      {selectedFile ? selectedFile.name : "Click to select photos"}
                    </span>
                  </label>
                </div>

                <button
                  onClick={handlePhotoUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Photo
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Check className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium">Photo uploaded!</p>
                <p className="text-muted">Thank you for sharing!</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl text-center mb-8">Guest Photos</h3>
          {guestPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {guestPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aspect-square relative overflow-hidden rounded-lg"
                >
                  <Image src={photo} alt={`Guest photo ${index + 1}`} fill className="object-cover" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <ImageIcon className="w-12 h-12 mx-auto text-muted mb-4" />
              <p className="text-muted">No photos yet. Be the first to share your memories!</p>
            </div>
          )}
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-20 px-4 bg-secondary/20 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">RSVP</h2>
            <p className="text-muted text-lg">Let us know if you can make it!</p>
          </motion.div>
        </div>

        <div className="max-w-lg mx-auto">
          {rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-background p-8 rounded-lg"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-serif text-3xl mb-4">Thank You!</h3>
              <p className="text-muted">
                {rsvpData.attending === "yes"
                  ? "We can't wait to celebrate with you!"
                  : "We'll miss you, but understand!"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-background p-8 rounded-lg shadow-sm"
            >
              <form onSubmit={handleRsvpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name(s)</label>
                  <input
                    type="text"
                    required
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={rsvpData.email}
                    onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Will you attend?</label>
                  <select
                    value={rsvpData.attending}
                    onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                  >
                    <option value="yes">Joyfully Accepts</option>
                    <option value="no">Regretfully Declines</option>
                  </select>
                </div>

                {rsvpData.attending === "yes" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Number of Guests
                        </span>
                      </label>
                      <select
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                      >
                        <option value="0">Just me</option>
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Meal Preference</label>
                      <select
                        value={rsvpData.meal}
                        onChange={(e) => setRsvpData({ ...rsvpData, meal: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                      >
                        <option value="">Select meal</option>
                        <option value="beef">Beef</option>
                        <option value="chicken">Chicken</option>
                        <option value="fish">Fish</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
                      <textarea
                        value={rsvpData.dietary}
                        onChange={(e) => setRsvpData({ ...rsvpData, dietary: e.target.value })}
                        placeholder="Any allergies or dietary needs..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-light transition-colors font-medium"
                >
                  Send RSVP
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* Registry */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Registry</h2>
            <p className="text-muted text-lg">Your presence at our wedding is the greatest gift of all</p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-secondary/20 p-8 rounded-lg text-center mb-12"
          >
            <p className="text-lg text-muted leading-relaxed">
              However, if you do wish to honor us with a gift, we&apos;ve registered
              at the following stores.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {(couple.registry || defaultData.registry).map((item, index) => (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 rounded-lg shadow-sm border border-secondary/30 hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {item.name === "Honeymoon Fund" ? (
                      <Plane className="w-7 h-7 text-primary" />
                    ) : (
                      <Gift className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <span className="font-serif text-xl group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <HelpCircle className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4">FAQ</h2>
            <p className="text-muted text-lg">Frequently asked questions</p>
          </motion.div>
        </div>

        <div className="max-w-2xl mx-auto">
          {(couple.faq || defaultData.faq).map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="border-b border-secondary/30"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left"
              >
                <span className="font-medium text-lg pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openFaqIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-muted">{item.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/30 p-8 rounded-lg"
          >
            <h3 className="font-serif text-2xl mb-4">Still Have Questions?</h3>
            <p className="text-muted mb-4">Don&apos;t hesitate to reach out!</p>
            <a href={`mailto:${couple.slug}@wedding.com`} className="text-primary hover:text-primary-light underline">
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}