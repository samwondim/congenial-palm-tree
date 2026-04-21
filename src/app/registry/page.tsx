"use client";

import { motion } from "framer-motion";
import { Heart, Gift, Plane } from "lucide-react";
import { weddingData } from "@/data/wedding";

export default function RegistryPage() {
  const { registry } = weddingData;

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
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Registry</h1>
            <p className="text-muted text-lg">
              Your presence at our wedding is the greatest gift of all
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
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
              at the following stores. Thank you for your generosity and for
              being part of our special day!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {registry.map((item, index) => (
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

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-8 h-8 mx-auto text-primary mb-4" />
            <p className="text-muted">
              Your love and support mean everything to us
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}