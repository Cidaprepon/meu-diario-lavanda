import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, BookOpen, Lock } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const features = [
    { icon: BookOpen, title: 'Diário Pessoal', desc: 'Guarde seus pensamentos e memórias' },
    { icon: Sparkles, title: 'Fotos & Áudios', desc: 'Adicione mídia às suas entradas' },
    { icon: Lock, title: 'Privado & Seguro', desc: 'Seus dados ficam no seu navegador' },
    { icon: Heart, title: 'Feito com Amor', desc: 'Design fofo e acolhedor' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lavender-lg border border-[#D8BFD8]/50 overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#9370DB] to-[#7B68EE] p-6 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-4"
                >
                  <img
                    src="/lavender-flower.png"
                    alt="Lavanda"
                    className="w-20 h-20 mx-auto object-contain drop-shadow-lg"
                  />
                </motion.div>

                <h2
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Sobre o Lavanda Dreams
                </h2>
                <p className="text-white/80 text-sm">
                  Seu diário pessoal fofo e acolhedor 💜
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[#1a1a1a]/70 text-center mb-6">
                  Um espaço seguro para guardar seus momentos mais preciosos.
                  Escreva, fotografe e grave suas memórias com carinho.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-[#E6E6FA]/50 rounded-2xl p-4 text-center hover:bg-[#D8BFD8]/50 transition-colors"
                    >
                      <feature.icon className="w-8 h-8 text-[#9370DB] mx-auto mb-2" />
                      <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-[#1a1a1a]/60">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-[#E6E6FA]">
                  <p className="text-sm text-[#1a1a1a]/60 flex items-center justify-center gap-1">
                    Feito com <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> e muito chá
                  </p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-1">
                    © {new Date().getFullYear()} Lavanda Dreams
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
