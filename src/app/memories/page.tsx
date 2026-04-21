"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Upload, Image as ImageIcon, Check } from "lucide-react";

export default function MemoriesPage() {
  const [guestPhotos, setGuestPhotos] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/upload`;
    }
    return "";
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fakeUrl = URL.createObjectURL(selectedFile);
    setGuestPhotos([fakeUrl, ...guestPhotos]);
    setSelectedFile(null);
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

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
              Share Your Memories
            </h1>
            <p className="text-muted text-lg">
              Scan to share photos from our special day
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 mb-16">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-background p-8 rounded-lg shadow-sm border border-secondary/30 text-center"
          >
            <h2 className="font-serif text-xl mb-6">
              Scan to Upload Your Photos
            </h2>
            <div className="bg-white p-4 rounded-lg inline-block mb-6">
              {uploadUrl && (
                <QRCodeSVG
                  value={uploadUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              )}
            </div>
            <p className="text-muted text-sm mb-4">
              or visit: <br />
              <span className="text-primary font-medium break-all">
                {uploadUrl}
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 mb-16">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-background p-8 rounded-lg shadow-sm border border-secondary/30"
          >
            <h2 className="font-serif text-xl mb-6 text-center">
              Upload Photos Directly
            </h2>

            {!uploadSuccess ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-secondary rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-10 h-10 text-muted mb-2" />
                    <span className="text-muted">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to select photos"}
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleUpload}
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
      </section>

      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl text-center mb-8">
            Guest Photos
          </h2>
          {guestPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {guestPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aspect-square relative overflow-hidden rounded-lg"
                >
                  <Image
                    src={photo}
                    alt={`Guest photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <ImageIcon className="w-12 h-12 mx-auto text-muted mb-4" />
              <p className="text-muted">
                No photos yet. Be the first to share your memories!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}