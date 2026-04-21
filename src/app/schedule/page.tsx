"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Heart } from "lucide-react";
import { weddingData } from "@/data/wedding";

export default function SchedulePage() {
  const { schedule, date } = weddingData;
  const weddingDate = new Date(date);
  const formattedDate = weddingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-10 h-10 mx-auto text-primary mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Wedding Day Schedule
            </h1>
            <p className="text-muted text-lg">{formattedDate}</p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-secondary" />

            {schedule.map((item, index) => (
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

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/10 p-8 rounded-lg"
          >
            <h2 className="font-serif text-2xl mb-4">Questions?</h2>
            <p className="text-muted mb-4">
              If you have any questions about the day, feel free to reach out!
            </p>
            <a
              href="mailto:sarahandjames@wedding.com"
              className="text-primary hover:text-primary-light underline"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}