import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Star, Zap, Heart, Crown, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const celebrationMessages = [
  {
    title: "🎉 Amazing Work!",
    message: "You just crushed that goal! Keep the momentum going!",
    icon: Trophy,
    colors: ["#22c55e", "#16a34a", "#15803d"],
  },
  {
    title: "⭐ Superstar!",
    message: "Another goal completed! You're absolutely unstoppable!",
    icon: Star,
    colors: ["#10b981", "#059669", "#047857"],
  },
  {
    title: "🔥 On Fire!",
    message: "You're building incredible momentum! Nothing can stop you now!",
    icon: Zap,
    colors: ["#14b8a6", "#0d9488", "#0f766e"],
  },
  {
    title: "💎 Diamond Level!",
    message: "Excellence achieved! You're shining brighter than ever!",
    icon: Crown,
    colors: ["#22c55e", "#16a34a", "#15803d"],
  },
  {
    title: "💪 Goal Crusher!",
    message: "Another one bites the dust! Your determination is inspiring!",
    icon: Heart,
    colors: ["#10b981", "#059669", "#047857"],
  },
  {
    title: "🚀 Rocket Mode!",
    message: "You're soaring to new heights! Keep reaching for the stars!",
    icon: Sparkles,
    colors: ["#14b8a6", "#0d9488", "#0f766e"],
  },
];

const streakMessages = [
  "🔥 You're on fire! Keep that streak alive!",
  "⚡ Electric performance! Your consistency is amazing!",
  "🌟 Stellar streak! You're a shining example of dedication!",
  "💎 Diamond streak! Your commitment is precious!",
  "🚀 Rocket streak! You're launching towards greatness!",
  "👑 Royal streak! You're ruling your goals like a champion!",
];

interface MotivationalCelebrationProps {
  goalTitle: string;
  streak?: number;
  isFirstGoal?: boolean;
  category?: string;
}

export const triggerMotivationalCelebration = ({
  goalTitle,
  streak = 0,
  isFirstGoal = false,
  category,
}: MotivationalCelebrationProps) => {
  // Choose celebration based on context
  let celebration;

  if (isFirstGoal) {
    celebration = {
      title: "🎊 First Goal Complete!",
      message:
        "Welcome to the champions club! This is just the beginning of your amazing journey!",
      icon: Crown,
      colors: ["#22c55e", "#16a34a", "#15803d"],
    };
  } else if (streak >= 7) {
    celebration = {
      title: "🔥 Week Streak Master!",
      message: `${streak} days strong! You're absolutely unstoppable!`,
      icon: Zap,
      colors: ["#10b981", "#059669", "#047857"],
    };
  } else if (streak >= 30) {
    celebration = {
      title: "👑 Month Streak Legend!",
      message: `${streak} days of pure excellence! You're a true champion!`,
      icon: Crown,
      colors: ["#14b8a6", "#0d9488", "#0f766e"],
    };
  } else {
    celebration =
      celebrationMessages[
        Math.floor(Math.random() * celebrationMessages.length)
      ];
  }

  // Trigger confetti with themed colors
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.7 },
    colors: celebration.colors,
    gravity: 0.8,
    drift: 0.1,
    scalar: 1.2,
    shapes: ["star", "circle"],
  });

  // Multiple confetti bursts for extra celebration
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.3, y: 0.8 },
      colors: celebration.colors,
      gravity: 0.9,
      scalar: 0.8,
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.7, y: 0.8 },
      colors: celebration.colors,
      gravity: 0.9,
      scalar: 0.8,
    });
  }, 400);

  // Show motivational toast
  toast.custom(
    (t) => (
      <motion.div
        initial={{
          scale: 0.3,
          opacity: 0,
          y: -100,
          rotateX: -90,
          filter: "blur(10px)",
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
          y: -50,
          filter: "blur(5px)",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.8,
        }}
        className={`
          ${t.visible ? "animate-enter" : "animate-leave"}
          max-w-md w-full relative overflow-hidden
          pointer-events-auto flex text-white
          transform transition-all duration-500
          backdrop-blur-xl rounded-2xl
          shadow-2xl shadow-green-500/25
          border border-white/20
        `}
        style={{
          background: `
            linear-gradient(135deg,
              rgba(34, 197, 94, 0.95) 0%,
              rgba(16, 185, 129, 0.95) 35%,
              rgba(20, 184, 166, 0.95) 100%
            )
          `,
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 25px 50px -12px rgba(34, 197, 94, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.05, 0.2],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-300/30 to-transparent"
          />
        </div>

        <div className="flex-1 w-0 p-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                    "0 0 30px rgba(255, 255, 255, 0.5)",
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: 2,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `
                    linear-gradient(145deg,
                      rgba(255, 255, 255, 0.25),
                      rgba(255, 255, 255, 0.1)
                    )
                  `,
                  boxShadow: `
                    0 8px 32px rgba(255, 255, 255, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <celebration.icon className="w-7 h-7" />
                <motion.div
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-2xl bg-white/30"
                />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base font-bold leading-tight mb-2"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {celebration.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm opacity-95 leading-relaxed mb-3"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                {celebration.message}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 text-xs bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20"
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white/80"
                />
                <span className="font-medium truncate">"{goalTitle}"</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex items-stretch relative z-10">
          <div className="w-px bg-white/20" />
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toast.dismiss(t.id)}
            className="p-3 flex items-center justify-center text-white hover:text-white transition-all duration-200 rounded-r-2xl group bg-white/10 hover:bg-white/20"
            title="Close notification"
            style={{
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Sparkle Effects */}
        <motion.div
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            y: [10, -10, 10],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-2 right-16 w-1 h-1 bg-white rounded-full"
        />
        <motion.div
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, 1.2, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-4 right-6 w-1.5 h-1.5 bg-white/70 rounded-full"
        />
      </motion.div>
    ),
    {
      duration: 3000,
      position: "top-center",
    },
  );

  // Add streak message if applicable
  if (streak > 1) {
    setTimeout(() => {
      const streakMessage =
        streakMessages[Math.floor(Math.random() * streakMessages.length)];
      toast.custom(
        (t) => (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              ${t.visible ? "animate-enter" : "animate-leave"}
              max-w-sm w-full relative overflow-hidden
              pointer-events-auto flex items-center gap-3 p-4
              backdrop-blur-xl rounded-xl text-white
              border border-white/20
            `}
            style={{
              background: `
                linear-gradient(135deg,
                  rgba(251, 146, 60, 0.95) 0%,
                  rgba(234, 88, 12, 0.95) 50%,
                  rgba(194, 65, 12, 0.95) 100%
                )
              `,
              boxShadow: `
                0 20px 40px -12px rgba(251, 146, 60, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-2xl"
            >
              🔥
            </motion.div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
              >
                {streakMessage}
              </p>
              <p className="text-xs opacity-90 mt-1">
                {streak} days strong! 💪
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toast.dismiss(t.id)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        ),
        {
          duration: 2000,
          position: "top-center",
        },
      );
    }, 2500);
  }
};

// Component for displaying motivational progress messages
export const MotivationalProgress = ({
  completionRate,
  totalGoals,
  streak,
}: {
  completionRate: number;
  totalGoals: number;
  streak: number;
}) => {
  let message = "";
  let icon = "";
  let gradient = "";

  if (completionRate === 100 && totalGoals > 0) {
    message = "Perfect score! You're absolutely crushing it! 🎯";
    icon = "����";
    gradient = "from-yellow-400 to-orange-400";
  } else if (completionRate >= 80) {
    message = "Outstanding performance! You're in the excellence zone! ⭐";
    icon = "🌟";
    gradient = "from-green-400 to-blue-400";
  } else if (completionRate >= 60) {
    message = "Great progress! You're building amazing momentum! 🚀";
    icon = "🚀";
    gradient = "from-blue-400 to-purple-400";
  } else if (completionRate >= 40) {
    message = "Keep pushing! Every step forward counts! 💪";
    icon = "💪";
    gradient = "from-purple-400 to-pink-400";
  } else if (totalGoals > 0) {
    message = "You've got this! Every champion started somewhere! 🌱";
    icon = "🌱";
    gradient = "from-pink-400 to-red-400";
  } else {
    message = "Ready to start your journey to greatness? Let's go! ✨";
    icon = "✨";
    gradient = "from-indigo-400 to-purple-400";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg bg-gradient-to-r ${gradient} text-white text-center`}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-2xl mb-2"
      >
        {icon}
      </motion.div>
      <p className="font-semibold">{message}</p>
      {streak > 0 && (
        <p className="text-sm opacity-90 mt-1">
          🔥 {streak} day streak - You're on fire!
        </p>
      )}
    </motion.div>
  );
};

// Default export for the main celebration system
const MotivationalCelebration = {
  triggerMotivationalCelebration,
  MotivationalProgress,
};

export default MotivationalCelebration;
