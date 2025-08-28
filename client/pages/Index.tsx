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
      title: "Daily Goal Tracking",
      description:
        "Set and track your daily goals with precision. Mark completions and watch your consistency grow.",
      color: "from-green-500 to-green-600",
      motivational: "Every day counts!",
    },
    {
      icon: Calendar,
      title: "Calendar View & Streaks",
      description:
        "Visualize your progress with our intuitive calendar interface. Build powerful streaks and never break the chain.",
      color: "from-emerald-500 to-emerald-600",
      motivational: "Build unstoppable streaks!",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Get detailed insights into your daily habits, completion rates, and performance trends over time.",
      color: "from-teal-500 to-teal-600",
      motivational: "Data-driven progress!",
    },
    {
      icon: CheckCircle2,
      title: "Daily Check-ins",
      description:
        "Simple daily check-ins to mark your goals complete. Build the habit of consistent daily action.",
      color: "from-green-500 to-emerald-500",
      motivational: "Consistency is key!",
    },
    {
      icon: Flame,
      title: "Streak Tracking",
      description:
        "Watch your streak counters climb as you maintain daily consistency. Never lose momentum again.",
      color: "from-emerald-500 to-teal-500",
      motivational: "Keep the fire burning!",
    },
    {
      icon: Trophy,
      title: "Achievement Milestones",
      description:
        "Celebrate streak milestones and goal achievements. Unlock badges for daily consistency.",
      color: "from-teal-500 to-green-500",
      motivational: "Earn your victories!",
    },
  ];

  const stats = [
    {
      value: "📅",
      label: "Daily Tracking",
      icon: Calendar,
      description: "Track goals every single day",
    },
    {
      value: "🔥",
      label: "Streak Building",
      icon: Flame,
      description: "Build unstoppable daily habits",
    },
    {
      value: "📊",
      label: "Progress Analytics",
      icon: BarChart3,
      description: "Analyze your daily performance",
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
          className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
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
          className="absolute top-40 right-32 w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
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
          className="absolute bottom-32 left-40 w-6 h-6 bg-gradient-to-r from-teal-400 to-green-400 rounded-full"
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
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl"
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
              className="space-y-8"
            >
              {/* App Name */}
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
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent bg-300% animate-gradient">
                    TrackRise
                  </span>
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                  A smarter way to track your day-to-day growth.
                </h2>
              </motion.div>

              {/* What the app does */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  Set daily goals • Track your progress with beautiful calendars
                  • Build unstoppable streaks • Get insights that drive
                  continuous improvement
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 text-base text-green-600 dark:text-green-400 font-medium"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Daily tracking made simple and powerful</span>
                  <Target className="w-5 h-5" />
                </motion.div>
              </motion.div>
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
            Smart Tools for Daily Growth
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Intelligent features designed to help you track, measure, and
            accelerate your day-to-day growth.
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
              Join the Growth Movement
            </h2>
            <p className="text-lg opacity-90">
              Thousands are already tracking their day-to-day growth. Start
              yours today!
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
              Start Your Growth Journey
            </motion.h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Experience a smarter way to track your day-to-day growth. Start
              building the habits that matter most.
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
