'use client';

import React from 'react';
import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

interface GalleryBlockProps {
  blockId: string;
  editable?: boolean;
  title: string;
  images: string[];
  // Добавляем этот проп в интерфейс, чтобы TS перестал ругаться
  imageQuery?: string; 
  blockStyle?: BlockStyleSettings;
}

export default function GalleryBlock({
  blockId,
  editable = false,
  title,
  images = [],
  imageQuery = '',
  blockStyle,
}: GalleryBlockProps) {
  const bg = blockStyle?.backgroundColor || '#ffffff';
  const color = blockStyle?.textColor || '#111111';
  const radius = blockStyle?.radius ?? 16;

  // Если массив images пуст, но есть imageQuery, можно генерировать заглушки
  const displayImages = images.length > 0 
    ? images 
    : Array(6).fill(null).map((_, i) => 
        imageQuery 
          ? `https://source.unsplash.com/featured/800x600?${encodeURIComponent(imageQuery)}&sig=${i}`
          : `https://via.placeholder.com/800x600?text=Gallery+Image+${i + 1}`
      );

  return (
    <section style={{ backgroundColor: bg, color }}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <InlineText
          blockId={blockId}
          propKey="title"
          value={title}
          editable={editable}
          as="h2"
          className="mb-12 text-center text-3xl font-black tracking-tight sm:text-4xl"
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayImages.map((src, index) => (
            <div 
              key={index} 
              className="group relative aspect-[4/3] overflow-hidden"
              style={{ borderRadius: radius }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}