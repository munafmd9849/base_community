import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Target, 
  BarChart3, 
  User, 
  Sparkles,
  CheckCircle,
  TrendingUp,
  Globe,
  Users,
  ShieldCheck,
  Trophy,
  Code
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "Personal Task Tracking",
    description: "Kanban-style task management with To-Do, In Progress, and Done columns for organized learning.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BarChart3,
    title: "Coding Stats Integration",
    description: "Real-time stats from LeetCode, GitHub, GFG, and Codeforces with credibility scoring.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Trophy,
    title: "Community Contests",
    description: "Join communities and participate in DSA, Java, Projects, and other coding contests.",
    color: "from-amber-500 to-orange-500"
  }
];

const stats = [
  { label: "Active Users", value: "2,500+", icon: Users },
  { label: "Communities", value: "150+", icon: Globe },
  { label: "Contests Completed", value: "5,000+", icon: Trophy }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                SkillPort
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Login")}>
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to={createPageUrl("Login")}>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 mb-6">
                <Sparkles className="w-4 h-4" />
                Track. Compete. Grow.
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Your Complete
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Skill Platform
                </span>
              </h1>
              
              <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
                Track personal progress, join communities, participate in contests, and showcase your coding journey.
                Built for learners and institutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to={createPageUrl("Login")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to excel
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools for personal growth and community management in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to level up your skills?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and institutions already using SkillPort to track progress and achieve their goals.
            </p>
            <Link to={createPageUrl("Login")}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
                Your complete platform for skill tracking, community engagement, and professional growth.
                Built by developers, for developers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">Personal Dashboard</a>
                <a href="#" className="block hover:text-white transition-colors">Community Management</a>
                <a href="#" className="block hover:text-white transition-colors">Contest Platform</a>
                <a href="#" className="block hover:text-white transition-colors">Public Profiles</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2024 SkillPort. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}