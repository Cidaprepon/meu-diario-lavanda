import { motion } from 'framer-motion';
import { ImageIcon, Mic, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onStartWriting: () => void;
  stats?: {
    totalEntries: number;
    totalImages: number;
    totalAudios: number;
  };
}

export function Hero({ onStartWriting, stats }: HeroProps) {
  const floatingIcons = [
    { Icon: ImageIcon, delay: 0, position: 'top-20 left-[10%]' },
    { Icon: Mic, delay: 0.2, position: 'top-32 right-[15%]' },
    { Icon: FileText, delay: 0.4, position: 'bottom-32 left-[15%]' },
    { Icon: Sparkles, delay: 0.6, position: 'bottom-20 right-[10%]' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 lavender-pattern-bg" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E6E6FA]/50 via-transparent to-[#E6E6FA]/30" />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} hidden lg:block`}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: 0.8 + delay, duration: 0.5 },
            scale: { delay: 0.8 + delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
            rotate: { delay: 0.8 + delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
            y: { delay: 1.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="w-14 h-14 bg-white/80 rounded-2xl shadow-lavender flex items-center justify-center">
            <Icon className="w-7 h-7 text-[#9370DB]" />
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Decorative Flower */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-6"
        >
          <img 
            src="/lavender-flower.png" 
            alt="Lavanda" 
            className="w-24 h-24 mx-auto object-contain animate-float"
          />
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ 
              delay: 0.4, 
              duration: 1.2, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-lavender"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Meu Diário de Lavanda
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg sm:text-xl text-[#1a1a1a]/70 mb-8"
        >
          Guarde seus momentos mais preciosos com carinho 💜
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStartWriting}
            size="lg"
            className="bg-gradient-to-r from-[#9370DB] to-[#7B68EE] hover:from-[#7B68EE] hover:to-[#9370DB] text-white rounded-full px-8 py-6 text-lg shadow-lavender-lg hover:shadow-lavender-hover transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Começar a Escrever
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex justify-center gap-8 sm:gap-12"
        >
          {[
            { value: stats?.totalEntries ?? 0, label: 'Memórias' },
            { value: stats?.totalImages ?? 0, label: 'Fotos' },
            { value: stats?.totalAudios ?? 0, label: 'Áudios' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                key={stat.value}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-2xl sm:text-3xl font-bold text-[#9370DB]"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-[#1a1a1a]/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
