import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Zap, Heart, Crown, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const celebrationMessages = [
  {
    title: "🎉 Amazing Work!",
    message: "You just crushed that goal! Keep the momentum going!",
    icon: Trophy,
    colors: ['#FFD700', '#FFA500', '#FF6B6B']
  },
  {
    title: "⭐ Superstar!",
    message: "Another goal completed! You're absolutely unstoppable!",
    icon: Star,
    colors: ['#FF6B9D', '#C44569', '#F8B500']
  },
  {
    title: "🔥 On Fire!",
    message: "You're building incredible momentum! Nothing can stop you now!",
    icon: Zap,
    colors: ['#FF9F43', '#FF6B35', '#E55039']
  },
  {
    title: "💎 Diamond Level!",
    message: "Excellence achieved! You're shining brighter than ever!",
    icon: Crown,
    colors: ['#3742FA', '#5352ED', '#A4B0F7']
  },
  {
    title: "💪 Goal Crusher!",
    message: "Another one bites the dust! Your determination is inspiring!",
    icon: Heart,
    colors: ['#2ED573', '#20BF6B', '#0FB9B1']
  },
  {
    title: "🚀 Rocket Mode!",
    message: "You're soaring to new heights! Keep reaching for the stars!",
    icon: Sparkles,
    colors: ['#A29BFE', '#6C5CE7', '#FD79A8']
  }
];

const streakMessages = [
  "🔥 You're on fire! Keep that streak alive!",
  "⚡ Electric performance! Your consistency is amazing!",
  "🌟 Stellar streak! You're a shining example of dedication!",
  "💎 Diamond streak! Your commitment is precious!",
  "🚀 Rocket streak! You're launching towards greatness!",
  "👑 Royal streak! You're ruling your goals like a champion!"
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
  category 
}: MotivationalCelebrationProps) => {
  
  // Choose celebration based on context
  let celebration;
  
  if (isFirstGoal) {
    celebration = {
      title: "🎊 First Goal Complete!",
      message: "Welcome to the champions club! This is just the beginning of your amazing journey!",
      icon: Crown,
      colors: ['#FFD700', '#FFA500', '#FF6B6B']
    };
  } else if (streak >= 7) {
    celebration = {
      title: "🔥 Week Streak Master!",
      message: `${streak} days strong! You're absolutely unstoppable!`,
      icon: Zap,
      colors: ['#FF9F43', '#FF6B35', '#E55039']
    };
  } else if (streak >= 30) {
    celebration = {
      title: "👑 Month Streak Legend!",
      message: `${streak} days of pure excellence! You're a true champion!`,
      icon: Crown,
      colors: ['#3742FA', '#5352ED', '#A4B0F7']
    };
  } else {
    celebration = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
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
    shapes: ['star', 'circle']
  });

  // Multiple confetti bursts for extra celebration
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.3, y: 0.8 },
      colors: celebration.colors,
      gravity: 0.9,
      scalar: 0.8
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.7, y: 0.8 },
      colors: celebration.colors,
      gravity: 0.9,
      scalar: 0.8
    });
  }, 400);

  // Show motivational toast
  toast.custom(
    (t) => (
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: -50 }}
        className={`
          ${t.visible ? 'animate-enter' : 'animate-leave'}
          max-w-md w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
          shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-green-200 dark:ring-green-800 text-white
          transform transition-all duration-500 border border-green-400/30
        `}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30"
              >
                <celebration.icon className="w-6 h-6" />
              </motion.div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold leading-tight">
                {celebration.title}
              </p>
              <p className="mt-1 text-sm opacity-90 leading-relaxed">
                {celebration.message}
              </p>
              <p className="mt-2 text-xs opacity-75 bg-white/10 rounded px-2 py-1 inline-block">
                Goal: "{goalTitle}"
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-white/20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            title="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    ),
    {
      duration: 6000,
      position: 'top-center',
    }
  );

  // Add streak message if applicable
  if (streak > 1) {
    setTimeout(() => {
      const streakMessage = streakMessages[Math.floor(Math.random() * streakMessages.length)];
      toast.success(streakMessage, {
        duration: 4000,
        position: 'top-center',
        icon: '🔥',
        style: {
          background: 'linear-gradient(45deg, #FF6B35, #FF9F43)',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    }, 2000);
  }
};

// Component for displaying motivational progress messages
export const MotivationalProgress = ({ completionRate, totalGoals, streak }: { 
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
  MotivationalProgress
};

export default MotivationalCelebration;
