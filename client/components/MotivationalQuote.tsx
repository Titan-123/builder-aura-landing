import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, Heart, Zap, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    theme: "action",
    icon: Zap,
    gradient: "from-orange-400 to-pink-400"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    theme: "perseverance",
    icon: Heart,
    gradient: "from-red-400 to-pink-400"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    theme: "hope",
    icon: Star,
    gradient: "from-yellow-400 to-orange-400"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    theme: "mindset",
    icon: Sparkles,
    gradient: "from-purple-400 to-pink-400"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    theme: "growth",
    icon: Zap,
    gradient: "from-green-400 to-blue-400"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    theme: "dreams",
    icon: Star,
    gradient: "from-indigo-400 to-purple-400"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    theme: "action",
    icon: Zap,
    gradient: "from-cyan-400 to-blue-400"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    theme: "effort",
    icon: Heart,
    gradient: "from-pink-400 to-red-400"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    theme: "persistence",
    icon: Zap,
    gradient: "from-orange-400 to-red-400"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
    theme: "daily",
    icon: Sparkles,
    gradient: "from-violet-400 to-purple-400"
  }
];

interface MotivationalQuoteProps {
  variant?: 'card' | 'banner' | 'compact';
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function MotivationalQuote({ 
  variant = 'card', 
  autoRotate = true, 
  rotateInterval = 10000 
}: MotivationalQuoteProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsVisible(true);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval]);

  const currentQuote = motivationalQuotes[currentQuoteIndex];
  const Icon = currentQuote.icon;

  const nextQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
      setIsVisible(true);
    }, 300);
  };

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentQuote.gradient} p-6 text-white cursor-pointer`}
        onClick={nextQuote}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <div className="flex-1">
                  <blockquote className="text-lg font-medium leading-relaxed mb-2">
                    "{currentQuote.text}"
                  </blockquote>
                  <cite className="text-sm opacity-90">— {currentQuote.author}</cite>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Animated background pattern */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Quote className="w-full h-full" />
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 cursor-pointer"
        onClick={nextQuote}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-5 h-5 text-primary" />
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-sm font-medium text-foreground flex-1"
            >
              "{currentQuote.text}" — {currentQuote.author}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden cursor-pointer group" onClick={nextQuote}>
      <CardContent className="p-0">
        <div className={`relative bg-gradient-to-br ${currentQuote.gradient} p-6 text-white`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  
                  <blockquote className="text-lg font-semibold leading-relaxed">
                    "{currentQuote.text}"
                  </blockquote>
                  
                  <cite className="text-sm opacity-90 block">
                    — {currentQuote.author}
                  </cite>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Click indicator */}
          <motion.div
            className="absolute bottom-2 right-2 text-xs opacity-60 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
          >
            Click for next quote
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to get a random motivational quote
export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  };

  const getQuoteByTheme = (theme: string) => {
    const themeQuotes = motivationalQuotes.filter(q => q.theme === theme);
    if (themeQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * themeQuotes.length);
      setQuote(themeQuotes[randomIndex]);
    } else {
      getRandomQuote();
    }
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return { quote, getRandomQuote, getQuoteByTheme };
};
