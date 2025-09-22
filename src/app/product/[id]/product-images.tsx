"use client";
import Image from 'next/image';
import { useState } from 'react';

export default function ProductImages({ images, title }: { images: string[]; title: string }) {
  const validImages = images.filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div>
      <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
        <Image
          src={validImages[activeIdx]}
          alt={`${title} main`}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {validImages.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${activeIdx === idx ? 'border-purple-600' : 'border-gray-200'}`}
            >
              <Image src={img} alt={`${title} ${idx + 1}`} width={150} height={150} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
