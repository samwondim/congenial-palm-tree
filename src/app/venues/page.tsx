"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Building, Car, Hotel } from "lucide-react";
import { weddingData } from "@/data/wedding";

export default function VenuesPage() {
  const { venues, accommodations } = weddingData;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MapPin className="w-10 h-10 mx-auto text-primary mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Venues</h1>
            <p className="text-muted text-lg">
              Where to go and how to get there
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
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
                  <h2 className="font-serif text-2xl mb-2">
                    {venues.ceremony.name}
                  </h2>
                  <p className="text-muted mb-2">{venues.ceremony.address}</p>
                  <p className="text-muted mb-4">{venues.ceremony.city}</p>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span>{venues.ceremony.time}</span>
                  </div>
                  <p className="text-muted mt-4">{venues.ceremony.description}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    venues.ceremony.address + ", " + venues.ceremony.city
                  )}`}
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
                  <h2 className="font-serif text-2xl mb-2">
                    {venues.reception.name}
                  </h2>
                  <p className="text-muted mb-2">{venues.reception.address}</p>
                  <p className="text-muted mb-4">{venues.reception.city}</p>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span>{venues.reception.time}</span>
                  </div>
                  <p className="text-muted mt-4">{venues.reception.description}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    venues.reception.address + ", " + venues.reception.city
                  )}`}
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
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl text-center mb-8">
              Where to Stay
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {accommodations.map((hotel) => (
                <div
                  key={hotel.name}
                  className="bg-background p-6 rounded-lg shadow-sm border border-secondary/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Hotel className="w-5 h-5 text-primary" />
                    <h3 className="font-serif">{hotel.name}</h3>
                  </div>
                  <p className="text-sm text-muted mb-2">{hotel.distance} from venue</p>
                  <a
                    href={`tel:${hotel.phone}`}
                    className="text-sm text-primary hover:text-primary-light"
                  >
                    {hotel.phone}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}