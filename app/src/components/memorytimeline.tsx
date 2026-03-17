import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ImageIcon } from 'lucide-react';
import { DiaryCard } from './DiaryCard';
import type { DiaryEntry } from '@/types';

interface MemoryTimelineProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
  isGallery?: boolean;
}

export function MemoryTimeline({ entries, onDelete, isGallery = false }: MemoryTimelineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (entries.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lavender border border-[#E6E6FA]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {isGallery ? (
                <div className="w-24 h-24 bg-[#E6E6FA] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-12 h-12 text-[#9370DB]/50" />
                </div>
              ) : (
                <img
                  src="/lavender-flower.png"
                  alt="Lavanda"
                  className="w-24 h-24 mx-auto mb-6 opacity-50"
                />
              )}
            </motion.div>
            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {isGallery ? 'Nenhuma foto ainda' : 'Seu diário está vazio'}
            </h3>
            <p className="text-[#1a1a1a]/60 mb-6">
              {isGallery 
                ? 'Adicione fotos às suas entradas para vê-las aqui!' 
                : 'Comece a registrar suas memórias mais preciosas hoje!'}
            </p>
            {!isGallery && (
              <div className="flex justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9370DB]" />
                <span className="text-sm text-[#9370DB]">Clique em "Novo Post" para começar</span>
                <Sparkles className="w-5 h-5 text-[#9370DB]" />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // Distribute entries into columns for masonry effect
  const columns: DiaryEntry[][] = [[], [], []];
  entries.forEach((entry, index) => {
    columns[index % 3].push(entry);
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header - Only show on home view */}
        {!isGallery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-[#9370DB]" />
              <h2 
                className="text-3xl font-bold text-gradient-lavender"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Suas Memórias
              </h2>
              <BookOpen className="w-6 h-6 text-[#9370DB]" />
            </div>
            <p className="text-[#1a1a1a]/60">
              {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'} no seu diário
            </p>
          </motion.div>
        )}

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {column.map((entry, entryIndex) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0,
                      transition: { duration: 0.3 }
                    }}
                    transition={{
                      layout: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }}
                    style={{
                      marginTop: columnIndex === 1 && entryIndex % 2 === 0 ? '2rem' : '0',
                    }}
                  >
                    <DiaryCard
                      entry={entry}
                      onDelete={onDelete}
                      index={columnIndex * 100 + entryIndex}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
