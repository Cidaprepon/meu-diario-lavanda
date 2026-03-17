import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookHeart, Plus, Image, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onNewPost: () => void;
  onHome: () => void;
  onGallery: () => void;
  onAbout: () => void;
  currentView: 'home' | 'gallery';
}

export function Header({ onNewPost, onHome, onGallery, onAbout, currentView }: HeaderProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { id: 'home', label: 'Home', icon: BookHeart, onClick: onHome, active: currentView === 'home' },
    { id: 'gallery', label: 'Galeria', icon: Image, onClick: onGallery, active: currentView === 'gallery' },
    { id: 'about', label: 'Sobre', icon: Info, onClick: onAbout, active: false },
  ];

  return (
    <motion.header
      initial={{ y: -100, scale: 0.9 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ 
        duration: 1, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
    >
      <div className="bg-glass rounded-full px-6 py-3 shadow-lavender-lg border border-white/50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={onHome}
          >
            <div className="relative">
              <img 
                src="/lavender-flower.png" 
                alt="Lavanda" 
                className="w-8 h-8 object-contain"
              />
              <motion.div
                className="absolute inset-0 bg-purple-400 rounded-full blur-md -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-semibold text-lg text-[#1a1a1a] hidden sm:block" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Lavanda Dreams
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + index * 0.1,
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1]
                }}
                onClick={link.onClick}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  link.active 
                    ? 'text-[#9370DB]' 
                    : 'text-[#1a1a1a]/80 hover:text-[#1a1a1a]'
                }`}
              >
                {(hoveredLink === link.id || link.active) && (
                  <motion.div
                    layoutId="navBubble"
                    className={`absolute inset-0 rounded-full ${
                      link.active ? 'bg-[#9370DB]/20' : 'bg-[#D8BFD8]/50'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <link.icon className={`w-4 h-4 ${link.active ? 'text-[#9370DB]' : ''}`} />
                  <span className="hidden sm:inline">{link.label}</span>
                </span>
              </motion.button>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onNewPost}
              className="bg-gradient-to-r from-[#9370DB] to-[#7B68EE] hover:from-[#7B68EE] hover:to-[#9370DB] text-white rounded-full px-4 py-2 shadow-lavender transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Novo Post</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
