import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Trash2, Heart, Calendar } from 'lucide-react';
import type { DiaryEntry } from '@/types';

interface DiaryCardProps {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
  index: number;
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  excited: '🤩',
  grateful: '🥰',
  sad: '😢',
};

const moodLabels: Record<string, string> = {
  happy: 'Feliz',
  calm: 'Calmo',
  excited: 'Animado',
  grateful: 'Grato',
  sad: 'Triste',
};

export function DiaryCard({ entry, onDelete, index }: DiaryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const randomRotation = ((index % 3) - 1) * 1.5; // -1.5, 0, or 1.5 degrees

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: randomRotation }}
      whileInView={{ opacity: 1, y: 0, rotate: randomRotation }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ 
        y: -10, 
        rotate: 0, 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="diary-card bg-white rounded-3xl shadow-lavender border border-[#E6E6FA] overflow-hidden"
    >
      {/* Image */}
      {entry.image && (
        <div className="relative">
          <img
            src={entry.image}
            alt="Diary entry"
            className="w-full h-48 sm:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(entry.createdAt)}</span>
          </div>
          
          {entry.mood && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="px-3 py-1 bg-[#E6E6FA] rounded-full text-sm flex items-center gap-1"
              title={moodLabels[entry.mood]}
            >
              <span>{moodEmojis[entry.mood]}</span>
              <span className="hidden sm:inline text-[#1a1a1a]/70">{moodLabels[entry.mood]}</span>
            </motion.span>
          )}
        </div>

        {/* Text */}
        {entry.text && (
          <p className="text-[#1a1a1a]/80 mb-4 leading-relaxed whitespace-pre-wrap">
            {entry.text}
          </p>
        )}

        {/* Audio Player */}
        {entry.audio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-[#E6E6FA] to-[#D8BFD8] rounded-2xl p-4 flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAudio}
                className="w-10 h-10 bg-white rounded-full shadow-lavender flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-[#9370DB]" />
                ) : (
                  <Play className="w-5 h-5 text-[#9370DB] ml-0.5" />
                )}
              </motion.button>

              {/* Waveform Visualization */}
              <div className="flex-1 flex items-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-[#9370DB]/60 rounded-full"
                    animate={
                      isPlaying
                        ? {
                            height: ['20%', '80%', '20%'],
                          }
                        : { height: '30%' }
                    }
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                      repeat: isPlaying ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    style={{ height: '30%' }}
                  />
                ))}
              </div>

              {entry.audioDuration && (
                <span className="text-sm text-[#9370DB] font-medium">
                  {Math.floor(entry.audioDuration / 60)}:
                  {(entry.audioDuration % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
            <audio
              ref={audioRef}
              src={entry.audio}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6E6FA]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
              isLiked
                ? 'bg-pink-50 text-pink-500'
                : 'hover:bg-[#E6E6FA] text-[#1a1a1a]/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{isLiked ? 'Curtido' : 'Curtir'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(entry.id)}
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-red-50 text-[#1a1a1a]/60 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Excluir</span>
          </motion.button>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-3 right-3 opacity-30">
        <img
          src="/lavender-flower.png"
          alt=""
          className="w-8 h-8 object-contain"
        />
      </div>
    </motion.div>
  );
}
