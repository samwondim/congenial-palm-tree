"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { weddingData } from "@/data/wedding";

export default function StoryPage() {
  const { story, couple } = weddingData;

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
              Our Love Story
            </h1>
            <p className="text-muted text-lg">
              The journey of {couple.name1} & {couple.name2}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary" />

            {story.map((item, index) => (
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
                    className={`bg-background p-6 rounded-lg shadow-sm ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <span className="text-primary font-serif text-3xl block mb-2">
                      {item.year}
                    </span>
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

      <section className="py-16 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/30 p-8 rounded-lg"
          >
            <h2 className="font-serif text-2xl mb-4">And the journey continues...</h2>
            <p className="text-muted">
              We can&apos;t wait to write the next chapter with you by our side.
              <br />
              See you at the wedding!
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
