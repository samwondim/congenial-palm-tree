"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check, Users } from "lucide-react";

export default function RSVPPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: "0",
    meal: "",
    dietary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-serif text-3xl mb-4">Thank You!</h1>
          <p className="text-muted">
            {formData.attending === "yes"
              ? "We can't wait to celebrate with you!"
              : "We'll miss you, but understand!"}
          </p>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="font-serif text-4xl md:text-5xl mb-4">RSVP</h1>
            <p className="text-muted text-lg">
              Let us know if you can make it!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name(s)</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Will you attend?
                </label>
                <select
                  name="attending"
                  value={formData.attending}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                >
                  <option value="yes">Joyfully Accepts</option>
                  <option value="no">Regretfully Declines</option>
                </select>
              </div>

              {formData.attending === "yes" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Number of Guests
                      </span>
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/50 bg-background focus:outline-none focus:border-primary"
                    >
                      <option value="0">Just me</option>
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Meal Preference
                    </label>
                    <select
                      name="meal"
                      value={formData.meal}
                      onChange={handleChange}
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
                    <label className="block text-sm font-medium mb-2">
                      Dietary Restrictions
                    </label>
                    <textarea
                      name="dietary"
                      value={formData.dietary}
                      onChange={handleChange}
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
        </div>
      </section>
    </div>
  );
}