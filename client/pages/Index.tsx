import { Link } from 'react-router-dom';
import { Target, CheckCircle2, Calendar, BarChart3, ArrowRight, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  const features = [
    {
      icon: Target,
      title: 'Smart Goal Setting',
      description: 'Set daily, weekly, and monthly goals with detailed tracking and deadlines.'
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'Visualize your progress with an intuitive calendar showing completed goals and streaks.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track completion rates, streaks, and category breakdowns with beautiful charts.'
    },
    {
      icon: CheckCircle2,
      title: 'Progress Tracking',
      description: 'Mark goals as complete and build momentum with streak tracking.'
    },
    {
      icon: Zap,
      title: 'Motivating UI',
      description: 'Stay motivated with a beautiful, modern interface designed for success.'
    },
    {
      icon: Users,
      title: 'Personal Dashboard',
      description: 'Your personalized space to manage all your goals in one place.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground">
              <Target className="w-8 h-8" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Track Your Goals,
                <span className="text-primary"> Achieve Your Dreams</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay organized and motivated with our powerful goal tracking app.
                Set daily, weekly, and monthly goals, visualize your progress, and build lasting habits.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/register" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you stay focused, motivated, and on track to achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">100%</div>
              <div className="text-lg opacity-90">Free to use</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">∞</div>
              <div className="text-lg opacity-90">Unlimited goals</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">📊</div>
              <div className="text-lg opacity-90">Detailed analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to start achieving your goals?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of people who are already using GoalTracker to build better habits and achieve their dreams.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/register" className="gap-2">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
