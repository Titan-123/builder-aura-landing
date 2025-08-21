import { Link } from 'react-router-dom';
import { Target, CheckCircle2, Calendar, BarChart3, ArrowRight, Users, Zap, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Index() {
  const features = [
    {
      icon: Target,
      title: 'Smart Goal Setting',
      description: 'Set daily, weekly, and monthly goals with detailed tracking and deadlines.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'Visualize your progress with an intuitive calendar showing completed goals and streaks.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track completion rates, streaks, and category breakdowns with beautiful charts.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CheckCircle2,
      title: 'Progress Tracking',
      description: 'Mark goals as complete and build momentum with streak tracking.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Motivating UI',
      description: 'Stay motivated with a beautiful, modern interface designed for success.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Users,
      title: 'Personal Dashboard',
      description: 'Your personalized space to manage all your goals in one place.',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const stats = [
    { value: '100%', label: 'Free to use', icon: Star },
    { value: '∞', label: 'Unlimited goals', icon: Target },
    { value: '📊', label: 'Detailed analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-6 h-6 bg-primary/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-8 h-8 bg-accent/20 rounded-full"
          animate={{
            y: [0, 20, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-32 left-40 w-4 h-4 bg-success/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.9, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="w-10 h-10" />
              </motion.div>
            </motion.div>
            
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Track Your Goals,
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                  Achieve Your Dreams
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Stay organized and motivated with our powerful goal tracking app. 
                Set daily, weekly, and monthly goals, visualize your progress, and build lasting habits.
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl">
                  <Link to="/register" className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2 hover:bg-accent/10">
                  <Link to="/login">
                    Sign In
                  </Link>
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you stay focused, motivated, and on track to achieve your goals.
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
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center space-y-4">
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mx-auto shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-20 relative overflow-hidden"
      >
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="space-y-3"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                    className="text-5xl lg:text-6xl font-bold"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-lg lg:text-xl opacity-90 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Ready to start achieving your goals?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people who are already using GoalTracker to build better habits and achieve their dreams.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl">
              <Link to="/register" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Sparkles className="w-4 h-4" />
            No credit card required • Start tracking goals instantly
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
