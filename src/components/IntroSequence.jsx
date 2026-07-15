import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export function IntroSequence({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => setStage(1), 800));
    timers.push(setTimeout(() => setStage(2), 2200));
    timers.push(setTimeout(() => setStage(3), 3600));
    timers.push(setTimeout(() => onComplete(), 5200));

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient light glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.15), transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />

      {/* Steam particles */}
      {stage >= 1 &&
        [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-amber-200/40 blur-sm"
            style={{ left: `${45 + i * 1.5}%`, bottom: "40%" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [-20, -120] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Center content */}
      <div className="relative z-10 text-center">
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-700/40 bg-amber-950/30 backdrop-blur-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <UtensilsCrossed className="h-8 w-8 text-amber-400" />
        </motion.div>

        <motion.p
          className="font-serif text-sm uppercase tracking-[0.5em] text-amber-600/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to
        </motion.p>

        <motion.h1
          className="mt-4 font-serif text-5xl font-bold text-amber-100 md:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: stage >= 1 ? 1 : 0,
            y: stage >= 1 ? 0 : 30,
          }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            textShadow: "0 0 40px rgba(251,191,36,0.4)",
          }}
        >
          Quick Bite
        </motion.h1>

        <motion.p
          className="mt-4 font-serif text-lg italic text-stone-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          A premium dining experience awaits...
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mx-auto mt-8 h-px w-48 overflow-hidden bg-stone-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 ? 1 : 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Doors opening effect */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-stone-950 to-stone-900"
        initial={{ x: 0 }}
        animate={{ x: stage >= 3 ? "-100%" : 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-stone-950 to-stone-900"
        initial={{ x: 0 }}
        animate={{ x: stage >= 3 ? "100%" : 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.div>
  );
}