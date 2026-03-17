import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Github } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'Github' },
  ];

  return (
    <footer className="relative mt-16">
      {/* Curved Top */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 h-16 bg-white origin-left"
        style={{
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Content */}
      <div className="bg-white pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <img
                src="/lavender-flower.png"
                alt="Lavanda"
                className="w-16 h-16 object-contain"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#1a1a1a]/80 mb-6 flex items-center gap-2"
            >
              Feito com <Heart className="w-5 h-5 text-pink-500 fill-pink-500" /> e muito chá
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mb-8"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-[#E6E6FA] hover:bg-[#D8BFD8] rounded-full flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-[#9370DB]" />
                </motion.a>
              ))}
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D8BFD8] to-transparent mb-6" />

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[#1a1a1a]/50 text-center"
            >
              © {new Date().getFullYear()} Lavanda Dreams. Todos os direitos reservados.
              <br />
              <span className="text-xs">Seu diário pessoal seguro e acolhedor 💜</span>
            </motion.p>
          </div>
        </div>
      </div>

      {/* Decorative Flowers */}
      <div className="absolute bottom-4 left-4 opacity-20">
        <img
          src="/lavender-flower.png"
          alt=""
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute bottom-4 right-4 opacity-20">
        <img
          src="/lavender-flower.png"
          alt=""
          className="w-12 h-12 object-contain transform scale-x-[-1]"
        />
      </div>
    </footer>
  );
}
