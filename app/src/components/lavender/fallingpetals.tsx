import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Generate random petals only on client side
    const generatedPetals = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 10,
      size: 10 + Math.random() * 14,
      rotation: Math.random() * 360,
    }));
    setPetals(generatedPetals);
  }, []);

  // Don't render anything during SSR
  if (!isClient || petals.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          initial={{ 
            y: '-10vh', 
            x: `${petal.x}vw`,
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            y: '110vh',
            x: [
              `${petal.x}vw`,
              `${petal.x + Math.sin(petal.id) * 8}vw`,
              `${petal.x - Math.sin(petal.id) * 8}vw`,
              `${petal.x}vw`
            ],
            rotate: [0, petal.rotation, petal.rotation * 1.5, petal.rotation * 2],
            opacity: [0, 0.5, 0.5, 0]
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
            }
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="none"
            className="opacity-60"
          >
            <path
              d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z"
              fill="#D8BFD8"
            />
            <path
              d="M12 2C12 2 16 6 16 12C16 16 14 20 12 22"
              stroke="#9370DB"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
