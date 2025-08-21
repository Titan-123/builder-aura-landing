import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, BarChart3, Calendar, Home, LogOut, User, Sparkles, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DarkModeToggle from '@/components/DarkModeToggle';
import MotivationalBackground from '@/components/MotivationalBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-slate-900 dark:to-emerald-950 relative">
      {/* Motivational Background */}
      <MotivationalBackground variant="gradient" intensity="low" />
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg"
                  whileHover={{ rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target className="w-5 h-5" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  GoalTracker
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - User menu and dark mode */}
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-green-500/20 transition-all">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white font-semibold">
                          {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link
                            to={item.href}
                            className={`flex items-center gap-2 ${
                              isActive(item.href) ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950' : ''
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
