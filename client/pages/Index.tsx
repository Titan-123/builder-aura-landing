import { Link } from "react-router-dom";
import {
  Target,
  CheckCircle2,
  Calendar,
  BarChart3,
  ArrowRight,
  Users,
  Zap,
  Star,
  Sparkles,
  Heart,
  Trophy,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DarkModeToggle from "@/components/DarkModeToggle";
import MotivationalBackground from "@/components/MotivationalBackground";

export default function Index() {
  const features = [
    {
      icon: Target,
      title: "Smart Goal Setting",
      description:
        "Transform your dreams into achievable milestones with our intelligent goal tracking system.",
      color: "from-amber-500 to-amber-600",
      motivational: "Turn dreams into reality!",
    },
    {
      icon: Calendar,
      title: "Visual Progress",
      description:
        "Watch your success unfold day by day with beautiful calendar views and streak tracking.",
      color: "from-orange-500 to-orange-600",
      motivational: "See your growth!",
    },
    {
      icon: BarChart3,
      title: "Powerful Analytics",
      description:
        "Discover insights that fuel your motivation and guide your journey to greatness.",
      color: "from-yellow-500 to-yellow-600",
      motivational: "Data-driven success!",
    },
    {
      icon: CheckCircle2,
      title: "Achievement Tracking",
      description:
        "Celebrate every victory and build unstoppable momentum with our completion system.",
      color: "from-amber-500 to-orange-500",
      motivational: "Celebrate every win!",
    },
    {
      icon: Zap,
      title: "Motivational Engine",
      description:
        "Stay inspired with dynamic quotes, celebrations, and motivational feedback.",
      color: "from-orange-500 to-yellow-500",
      motivational: "Stay inspired daily!",
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description:
        "Unlock badges and rewards as you conquer your goals and reach new heights.",
      color: "from-yellow-500 to-amber-500",
      motivational: "Become a champion!",
    },
  ];

  const stats = [
    {
      value: "💪",
      label: "Unlimited Potential",
      icon: Star,
      description: "No limits on your dreams",
    },
    {
      value: "🎯",
      label: "Goal Mastery",
      icon: Target,
      description: "Track everything that matters",
    },
    {
      value: "🚀",
      label: "Success Analytics",
      icon: BarChart3,
      description: "Insights that inspire growth",
    },
  ];

  const motivationalMessages = [
    "Your journey to greatness starts here!",
    "Every expert was once a beginner!",
    "Progress, not perfection!",
    "Your only limit is you!",
    "Dream big, achieve bigger!",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-slate-900 dark:to-yellow-950 relative overflow-hidden">
      {/* Enhanced Motivational Background */}
      <MotivationalBackground variant="floating" intensity="medium" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-40 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.9, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white shadow-2xl"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Target className="w-12 h-12" />
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent bg-300% animate-gradient">
                    Transform Your Dreams
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Into Reality
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              >
                Unleash your potential with our revolutionary goal tracking
                system.
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {
                    motivationalMessages[
                      Math.floor(Math.random() * motivationalMessages.length)
                    ]
                  }
                </span>
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transform transition-all"
                >
                  <Link to="/register" className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto border-2 border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950"
                >
                  <Link to="/login">Continue Journey</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Your Success Toolkit
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to conquer your goals and unlock your true
            potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader className="text-center space-y-4">
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mx-auto shadow-lg group-hover:shadow-xl`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold">
                      {feature.title}
                    </CardTitle>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-semibold text-green-600 dark:text-green-400"
                    >
                      {feature.motivational}
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <MotivationalBackground variant="success" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join the Success Revolution
            </h2>
            <p className="text-lg opacity-90">
              Thousands are already transforming their lives. Your turn!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="space-y-4"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                    className="text-6xl"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xl font-bold">{stat.label}</div>
                  <div className="text-sm opacity-90">{stat.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Final Motivational CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Your Dreams Are Waiting
            </motion.h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Every champion started with a single step. Make today the day you
              begin your extraordinary journey.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              className="text-xl px-12 py-6 h-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform transition-all"
            >
              <Link to="/register" className="gap-3">
                <Flame className="w-6 h-6" />
                Ignite Your Success
                <Sparkles className="w-6 h-6" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
          >
            <Heart className="w-4 h-4 text-green-500" />
            Start your journey today • Join thousands of achievers
            <Heart className="w-4 h-4 text-green-500" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
