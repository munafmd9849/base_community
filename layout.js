
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Home,
  Target,
  User as UserIconLucide,
  FolderOpen,
  Menu,
  X,
  Sparkles,
  PenTool,
  Users,
  Trophy,
  ShieldCheck,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const personalNavItems = [
  { title: "Dashboard", url: createPageUrl("PersonalDashboard"), icon: Home },
  { title: "Tracker", url: createPageUrl("Tracker"), icon: Target },
  { title: "Stats", url: createPageUrl("Stats"), icon: BarChart3 },
  { title: "Profile", url: createPageUrl("Profile"), icon: UserIconLucide },
  { title: "Projects", url: createPageUrl("Projects"), icon: FolderOpen },
  { title: "Posts", url: createPageUrl("Posts"), icon: PenTool },
  { title: "Communities", url: createPageUrl("Communities"), icon: Users },
];

const communityFeaturesForPersonalUser = [
  { title: "Community Tasks", url: createPageUrl("CommunityTasks"), icon: Target },
  { title: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
];

const adminNavItems = [
  { title: "Dashboard", url: createPageUrl("CommunityDashboard"), icon: LayoutDashboard },
  { title: "Communities", url: createPageUrl("Communities"), icon: Users },
  { title: "Admin Panel", url: createPageUrl("Admin"), icon: ShieldCheck },
  { title: "Contests", url: createPageUrl("Contests"), icon: Trophy },
  { title: "Contest Tracker", url: createPageUrl("ContestTracker"), icon: Trophy },
  { title: "Members", url: createPageUrl("Members"), icon: Users },
  { title: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState('personal');
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, [location.pathname]);

  const checkAuthentication = async () => {
    try {
      // Try to get current user
      const user = await User.me();
      setCurrentUser(user);
      
      // Check for existing mode
      const storedMode = localStorage.getItem('skillport_mode');
      const storedJoined = localStorage.getItem('skillport_joined_community') === 'true';
      
      if (storedMode) {
        setMode(storedMode);
        setHasJoinedCommunity(storedJoined);
      } else {
        // First time user - redirect to mode selection
        if (location.pathname !== createPageUrl("ModeSelection") && 
            location.pathname !== createPageUrl("Home")) {
          navigate(createPageUrl("ModeSelection"));
          return;
        }
      }
    } catch (error) {
      // User not authenticated
      if (location.pathname !== createPageUrl("Home") && 
          location.pathname !== createPageUrl("ModeSelection")) {
        // Redirect to built-in login
        await User.login();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = async (newMode) => {
    try {
      // Just update local storage - don't try to update user role
      localStorage.setItem('skillport_mode', newMode);
      if (newMode === 'personal') {
        localStorage.removeItem('skillport_joined_community');
        setHasJoinedCommunity(false);
      }
      
      const destination = newMode === 'community' ? 'CommunityDashboard' : 'PersonalDashboard';
      navigate(createPageUrl(destination));
      window.location.reload();
    } catch (error) {
      console.error('Error switching mode:', error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('skillport_mode');
      localStorage.removeItem('skillport_joined_community');
      localStorage.removeItem('skillport_user');
      await User.logout();
    } catch (error) {
      console.error('Error logging out:', error);
      window.location.href = createPageUrl('Home');
    }
  };

  const isActive = (url) => location.pathname === url;

  // Show loading or handle special pages
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show navigation for certain pages
  if (location.pathname === createPageUrl("Home") || 
      location.pathname === createPageUrl("ModeSelection")) {
    return children;
  }

  // If user not authenticated and not on allowed pages, show login prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please sign in to access SkillPort.</p>
          <Button onClick={() => User.login()} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  let navigationItems = [];
  if (mode === 'personal') {
    navigationItems = [...personalNavItems];
    if (hasJoinedCommunity) {
      navigationItems.push(...communityFeaturesForPersonalUser);
    }
  } else if (mode === 'community') {
    navigationItems = adminNavItems;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl(mode === 'personal' ? "PersonalDashboard" : "CommunityDashboard")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                SkillPort
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.url)
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={currentUser.avatar_url || `https://avatar.vercel.sh/${currentUser.email}.png`}
                      alt={currentUser.full_name} 
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                    Current Mode: {mode === 'personal' ? 'Personal User' : 'Community Admin'}
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleModeSwitch('personal')}>
                    <UserIconLucide className="mr-2 h-4 w-4" />
                    <span>Switch to Personal Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleModeSwitch('community')}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Switch to Community Admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50"
            >
              <div className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.url)
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SkillPort</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Track your growth, prove your skills, and showcase your journey.
                Built by learners, for learners.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <Link to={createPageUrl("Tracker")} className="block hover:text-white transition-colors">Task Tracker</Link>
                <Link to={createPageUrl("Stats")} className="block hover:text-white transition-colors">Stats Dashboard</Link>
                <Link to={createPageUrl("Projects")} className="block hover:text-white transition-colors">Projects</Link>
                <Link to={createPageUrl("Posts")} className="block hover:text-white transition-colors">Posts</Link>
                <Link to={createPageUrl("Communities")} className="block hover:text-white transition-colors">Communities</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>Built with ❤️ by learners, for learners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
