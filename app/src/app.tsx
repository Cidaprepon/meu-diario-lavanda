import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FallingPetals } from '@/components/lavender/FallingPetals';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { EntryEditor } from '@/components/EntryEditor';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { Footer } from '@/components/Footer';
import { AboutModal } from '@/components/AboutModal';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ImageIcon, ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'gallery'>('home');
  const timelineRef = useRef<HTMLDivElement>(null);
  const { entries, addEntry, deleteEntry, getStats } = useDiaryEntries();

  const handleSaveEntry = (entryData: Parameters<typeof addEntry>[0]) => {
    addEntry(entryData);
    toast.success('Entrada salva com sucesso! 💜', {
      description: 'Sua memória foi guardada no diário.',
      duration: 3000,
    });
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    toast.success('Entrada excluída', {
      description: 'A memória foi removida do diário.',
      duration: 3000,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setCurrentView('home');
    scrollToTop();
  };

  const handleGallery = () => {
    setCurrentView('gallery');
    setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const stats = getStats();

  // Filter entries for gallery view (only entries with images)
  const galleryEntries = entries.filter(entry => entry.image);

  return (
    <div className="min-h-screen relative">
      {/* Falling Petals Background */}
      <FallingPetals />

      {/* Header */}
      <Header 
        onNewPost={() => setIsEditorOpen(true)} 
        onHome={handleHome}
        onGallery={handleGallery}
        onAbout={() => setIsAboutOpen(true)}
        currentView={currentView}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Only show on home view */}
        {currentView === 'home' && (
          <Hero onStartWriting={() => setIsEditorOpen(true)} stats={stats} />
        )}

        {/* Gallery Header - Only show on gallery view */}
        {currentView === 'gallery' && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-28 pb-8 px-4"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#E6E6FA] to-[#D8BFD8] rounded-2xl flex items-center justify-center mx-auto shadow-lavender">
                  <ImageIcon className="w-8 h-8 text-[#9370DB]" />
                </div>
              </motion.div>
              <h1 
                className="text-3xl sm:text-4xl font-bold text-gradient-lavender mb-2"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Galeria de Fotos
              </h1>
              <p className="text-[#1a1a1a]/60 mb-4">
                {galleryEntries.length} {galleryEntries.length === 1 ? 'foto' : 'fotos'} no seu diário
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6E6FA] hover:bg-[#D8BFD8] rounded-full text-sm text-[#9370DB] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Diário
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* Stats Banner - Only show on home view */}
        {currentView === 'home' && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8 px-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-glass rounded-3xl shadow-lavender border border-white/50 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4"
                  >
                    <div className="text-3xl font-bold text-gradient-lavender">{stats.totalEntries}</div>
                    <div className="text-sm text-[#1a1a1a]/60">Memórias</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 border-x border-[#D8BFD8]/50"
                  >
                    <div className="text-3xl font-bold text-gradient-lavender">{stats.totalImages}</div>
                    <div className="text-sm text-[#1a1a1a]/60">Fotos</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4"
                  >
                    <div className="text-3xl font-bold text-gradient-lavender">{stats.totalAudios}</div>
                    <div className="text-sm text-[#1a1a1a]/60">Áudios</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Timeline Section */}
        <div ref={timelineRef}>
          <MemoryTimeline 
            entries={currentView === 'gallery' ? galleryEntries : entries} 
            onDelete={handleDeleteEntry}
            isGallery={currentView === 'gallery'}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Entry Editor Modal */}
      <EntryEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEntry}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D8BFD8',
            borderRadius: '16px',
          },
        }}
      />
    </div>
  );
}

export default App;
