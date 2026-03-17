import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Mic, FileText, X, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { DiaryEntry, MoodType } from '@/types';

interface EntryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
}

const moods: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Feliz' },
  { type: 'calm', emoji: '😌', label: 'Calmo' },
  { type: 'excited', emoji: '🤩', label: 'Animado' },
  { type: 'grateful', emoji: '🥰', label: 'Grato' },
  { type: 'sad', emoji: '😢', label: 'Triste' },
];

export function EntryEditor({ isOpen, onClose, onSave }: EntryEditorProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  }, [isRecording]);

  const handleSave = useCallback(() => {
    if (!text.trim() && !image && !audio) {
      alert('Adicione algum conteúdo ao seu post!');
      return;
    }

    onSave({
      text,
      image: image || undefined,
      audio: audio || undefined,
      audioDuration: audio ? recordingTime : undefined,
      mood: selectedMood || undefined,
    });

    // Reset form
    setText('');
    setImage(null);
    setAudio(null);
    setSelectedMood(null);
    setRecordingTime(0);
    onClose();
  }, [text, image, audio, recordingTime, selectedMood, onSave, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Editor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lavender-lg border border-[#D8BFD8]/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8BFD8]/30">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lavender-flower.png" 
                    alt="Lavanda" 
                    className="w-6 h-6 object-contain"
                  />
                  <span className="font-semibold text-[#1a1a1a]">Nova Entrada</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E6E6FA] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#1a1a1a]/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Mood Selector */}
                <div className="mb-4">
                  <label className="text-sm text-[#1a1a1a]/60 mb-2 block">Como você está se sentindo?</label>
                  <div className="flex gap-2 flex-wrap">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood.type}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.type === selectedMood ? null : mood.type)}
                        className={`px-3 py-2 rounded-full text-sm flex items-center gap-1 transition-all ${
                          selectedMood === mood.type
                            ? 'bg-[#9370DB] text-white shadow-lavender'
                            : 'bg-[#E6E6FA] text-[#1a1a1a]/70 hover:bg-[#D8BFD8]'
                        }`}
                      >
                        <span>{mood.emoji}</span>
                        <span className="hidden sm:inline">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <motion.div
                  animate={{ height: isExpanded ? 'auto' : 'auto' }}
                  className="mb-4"
                >
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    placeholder="O que você está sentindo hoje?"
                    className="min-h-[120px] resize-none border-[#D8BFD8] focus:border-[#9370DB] focus:ring-[#9370DB]/20 rounded-2xl text-base"
                  />
                </motion.div>

                {/* Image Preview */}
                <AnimatePresence>
                  {image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative mb-4 rounded-2xl overflow-hidden"
                    >
                      <img src={image} alt="Preview" className="w-full max-h-64 object-cover" />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Audio Preview */}
                <AnimatePresence>
                  {audio && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mb-4 p-4 bg-[#E6E6FA] rounded-2xl flex items-center gap-3"
                    >
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-6 bg-[#9370DB] rounded-full animate-wave"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#1a1a1a]/60">Áudio gravado</span>
                      <span className="text-sm text-[#9370DB] font-medium">{formatTime(recordingTime)}</span>
                      <button
                        onClick={() => setAudio(null)}
                        className="ml-auto p-2 hover:bg-[#D8BFD8] rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#1a1a1a]/60" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recording Indicator */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-4 p-4 bg-red-50 rounded-2xl flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-600 font-medium">Gravando...</span>
                      <span className="text-red-500">{formatTime(recordingTime)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* Image Upload */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-[#E6E6FA] hover:bg-[#D8BFD8] rounded-xl transition-colors"
                      title="Adicionar foto"
                    >
                      <ImageIcon className="w-5 h-5 text-[#9370DB]" />
                    </motion.button>

                    {/* Audio Record */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-3 rounded-xl transition-colors ${
                        isRecording
                          ? 'bg-red-100 hover:bg-red-200'
                          : 'bg-[#E6E6FA] hover:bg-[#D8BFD8]'
                      }`}
                      title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
                    >
                      {isRecording ? (
                        <Pause className="w-5 h-5 text-red-500" />
                      ) : (
                        <Mic className="w-5 h-5 text-[#9370DB]" />
                      )}
                    </motion.button>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-[#9370DB] to-[#7B68EE] hover:from-[#7B68EE] hover:to-[#9370DB] text-white rounded-xl px-6 shadow-lavender"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
