import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User as UserIcon, 
  Building, 
  Sparkles,
  Target,
  Users,
  Trophy,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function ModeSelection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Check if user already has a mode set
      const existingMode = localStorage.getItem('skillport_mode');
      if (existingMode) {
        // Redirect to appropriate dashboard
        const redirectPage = existingMode === 'community' ? 'CommunityDashboard' : 'PersonalDashboard';
        window.location.href = createPageUrl(redirectPage);
        return;
      }
    } catch (error) {
      // User not authenticated, redirect to login
      await User.login();
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelection = async (mode) => {
    if (!currentUser) return;

    try {
      // Just store mode selection in localStorage - don't try to update user role
      localStorage.setItem('skillport_mode', mode);
      localStorage.setItem('skillport_user', JSON.stringify(currentUser));

      // Redirect to appropriate dashboard
      const redirectPage = mode === 'community' ? 'CommunityDashboard' : 'PersonalDashboard';
      window.location.href = createPageUrl(redirectPage);
      
    } catch (error) {
      console.error('Error setting user mode:', error);
      alert('Error setting up your account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              SkillPort
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to SkillPort!
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Hi {currentUser?.full_name}! Choose how you'd like to use SkillPort:
          </p>
          <p className="text-slate-500">
            You can always switch between modes later from your profile menu.
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Personal Use
                </CardTitle>
                <p className="text-slate-600">
                  Track your individual learning journey and growth
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>Personal task tracker with Kanban boards</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Coding stats from LeetCode, GitHub, GFG</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Join communities and participate in contests</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Trophy className="w-4 h-4 text-blue-600" />
                    <span>Public profile and portfolio showcase</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleModeSelection('personal')}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:scale-105 transition-transform duration-300"
                >
                  Choose Personal Mode
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Community Admin
                </CardTitle>
                <p className="text-slate-600">
                  Manage learners and create contests for your institution
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Building className="w-4 h-4 text-green-600" />
                    <span>Create and manage communities</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span>Design contests and coding challenges</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Track member progress and leaderboards</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span>Analytics and performance insights</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleModeSelection('community')}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 group-hover:scale-105 transition-transform duration-300"
                >
                  Choose Community Admin
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-500">
            Don't worry - you can switch between modes anytime from your profile dropdown menu.
          </p>
        </motion.div>
      </div>
    </div>
  );
}