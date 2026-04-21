"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Search, Plus, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [searchSlug, setSearchSlug] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
            alt="Wedding"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 mx-auto mb-6 text-accent" />
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4">
              Wedding Sites
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
              Create beautiful wedding websites for your special day
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchSlug.trim()) {
                  window.location.href = `/${searchSlug.trim().toLowerCase()}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder="Search for a wedding..."
                className="flex-1 px-6 py-4 rounded-full text-foreground bg-white/95 backdrop-blur-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-light transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="animate-bounce">
            <ArrowRight className="w-6 h-6 rotate-90 text-white/70" />
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl mb-4">How It Works</h2>
            <p className="text-muted text-lg mb-16">Create your wedding site in minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: MessageCircle,
                title: "1. Start on Telegram",
                description: "Message our bot to begin creating your wedding site",
              },
              {
                icon: Plus,
                title: "2. Add Your Details",
                description: "Share names, date, venue, and photos through chat",
              },
              {
                icon: Heart,
                title: "3. Share Your Site",
                description: "Get a unique URL to share with your guests",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl mb-4">What&apos;s Included</h2>
            <p className="text-muted text-lg">Everything you need for your wedding</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Countdown Timer", desc: "Days until your wedding" },
              { title: "Love Story", desc: "Timeline of your relationship" },
              { title: "Schedule", desc: "Day-of itinerary" },
              { title: "Venues", desc: "Locations with maps" },
              { title: "Photo Gallery", desc: "Share your photos" },
              { title: "Guest Memories", desc: "QR code for guests to upload" },
              { title: "RSVP", desc: "Collect responses" },
              { title: "Registry", desc: "Link to gifts" },
              { title: "FAQ", desc: "Common questions answered" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h2 className="font-serif text-4xl mb-4">Ready to Get Started?</h2>
            <p className="text-muted text-lg mb-8">
              Create your wedding site right from Telegram - no account needed
            </p>
            <a
              href="https://t.me/your_bot_username"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-light transition-colors text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Start on Telegram
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}