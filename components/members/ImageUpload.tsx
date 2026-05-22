'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Upload } from 'lucide-react';
import Image from 'next/image';

interface Props {
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({
  preview,
  onFileSelect,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onFileSelect(file, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
        Profile Photo
      </h2>

      <div className="flex items-center gap-5">
        {/* Preview / Placeholder */}
        <div className="relative flex-shrink-0">
          {preview ? (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-red-600/40">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="flex-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          >
            <Upload className="w-4 h-4" />
            {preview ? 'Change Photo' : 'Upload Photo'}
          </motion.button>
          <p className="text-zinc-600 text-xs mt-2">
            JPG, PNG or WEBP · Max 5MB
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
