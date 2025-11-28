import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedLogoProps {
  size?: number;
}

const AnimatedLogo = ({ size = 60 }: AnimatedLogoProps) => {
  // Generate random sparkle positions around the logo
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
    delay: i * 0.2,
  }));

  // Flying angels orbiting the logo
  const angels = [
    { id: 1, duration: 4, reverse: false },
    { id: 2, duration: 5, reverse: true },
    { id: 3, duration: 6, reverse: false },
  ];

  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ width: size + 40, height: size + 40 }}
    >
      {/* Glow effect behind logo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sparkle particles */}
      {sparkles.map((sparkle) => {
        const radius = size / 2 + 20;
        const x = Math.cos((sparkle.angle * Math.PI) / 180) * radius;
        const y = Math.sin((sparkle.angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [x, x * 1.2, x],
              y: [y, y * 1.2, y],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          </motion.div>
        );
      })}

      {/* Flying angels */}
      {angels.map((angel) => (
        <motion.div
          key={angel.id}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            rotate: angel.reverse ? -360 : 360,
          }}
          transition={{
            duration: angel.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            style={{
              x: size / 2 + 15,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles 
              className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
              size={16} 
              fill="currentColor"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Logo in center */}
      <motion.img
        src="/FUN_Profile.jpg"
        alt="FUN Profile"
        className="relative rounded-full object-cover shadow-[0_0_20px_rgba(250,204,21,0.4)] ring-2 ring-yellow-400/50"
        style={{ width: size, height: size }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(250,204,21,0.4)",
            "0 0 30px rgba(250,204,21,0.6)",
            "0 0 20px rgba(250,204,21,0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedLogo;
