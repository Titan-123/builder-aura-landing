import { motion } from 'framer-motion';
import { Star, Sparkles, Heart, Zap, Target, Trophy } from 'lucide-react';

interface MotivationalBackgroundProps {
  variant?: 'floating' | 'gradient' | 'particles' | 'success';
  intensity?: 'low' | 'medium' | 'high';
}

export default function MotivationalBackground({ 
  variant = 'floating', 
  intensity = 'medium' 
}: MotivationalBackgroundProps) {
  
  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 8;
      case 'medium': return 15;
      case 'high': return 25;
      default: return 15;
    }
  };

  const getOpacity = () => {
    switch (intensity) {
      case 'low': return 0.1;
      case 'medium': return 0.15;
      case 'high': return 0.25;
      default: return 0.15;
    }
  };

  if (variant === 'gradient') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))',
              'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1), rgba(34, 197, 94, 0.1))',
              'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  if (variant === 'particles') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: getParticleCount() }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: getOpacity(),
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.5, 1],
              opacity: [getOpacity(), getOpacity() * 2, getOpacity()],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'success') {
    const successIcons = [Star, Trophy, Heart, Sparkles];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const IconComponent = successIcons[Math.floor(Math.random() * successIcons.length)];
          return (
            <motion.div
              key={i}
              className="absolute text-emerald-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${12 + Math.random() * 8}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                y: [0, -50],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 5,
              }}
            >
              <IconComponent />
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default floating variant
  const floatingElements = [
    { icon: Star, color: 'text-emerald-400', size: 'w-4 h-4' },
    { icon: Sparkles, color: 'text-emerald-400', size: 'w-5 h-5' },
    { icon: Heart, color: 'text-teal-400', size: 'w-4 h-4' },
    { icon: Zap, color: 'text-green-400', size: 'w-4 h-4' },
    { icon: Target, color: 'text-green-400', size: 'w-5 h-5' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: getParticleCount() }).map((_, i) => {
        const element = floatingElements[Math.floor(Math.random() * floatingElements.length)];
        const IconComponent = element.icon;
        
        return (
          <motion.div
            key={i}
            className={`absolute ${element.color} ${element.size}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: getOpacity(),
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [getOpacity(), getOpacity() * 2, getOpacity()],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <IconComponent />
          </motion.div>
        );
      })}
    </div>
  );
}

// Enhanced gradient background for special occasions
export const CelebrationBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(20, 184, 166, 0.1) 100%)'
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Animated rays */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-transparent via-emerald-400/30 to-transparent"
        style={{
          height: '200px',
          transformOrigin: 'bottom center',
          transform: `rotate(${i * 45}deg) translateY(-100px)`,
        }}
        animate={{
          opacity: [0, 0.8, 0],
          scaleY: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);
