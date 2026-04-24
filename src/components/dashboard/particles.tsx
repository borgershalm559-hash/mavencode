"use client";

import { motion } from "framer-motion";

const PARTICLES = [
  { id: 0, x: 12, y: 8, size: 1.5, duration: 28, delay: 0 },
  { id: 1, x: 85, y: 22, size: 2, duration: 35, delay: 3 },
  { id: 2, x: 45, y: 65, size: 1.2, duration: 30, delay: 6 },
  { id: 3, x: 72, y: 80, size: 2.5, duration: 40, delay: 2 },
  { id: 4, x: 28, y: 42, size: 1.8, duration: 32, delay: 8 },
  { id: 5, x: 92, y: 55, size: 1.3, duration: 26, delay: 5 },
];

export function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#10B981]/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
