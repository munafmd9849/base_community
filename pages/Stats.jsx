import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Code, 
  Github, 
  Trophy, 
  Zap,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

import StatCard from "../components/stats/StatCard";

const platforms = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    icon: Code,
    color: 'from-orange-500 to-yellow-500',
    stats: [
      { label: 'Problems Solved', value: '247' },
      { label: 'Contest Rating', value: '1,456' },
      { label: 'Global Rank', value: '12,847' },
      { label: 'Acceptance Rate', value: '67%' }
    ],
    lastSync: '2 hours ago'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'from-gray-700 to-gray-900',
    stats: [
      { label: 'Contributions', value: '1,234' },
      { label: 'Repositories', value: '42' },
      { label: 'Followers', value: '156' },
      { label: 'Stars Received', value: '89' }
    ],
    lastSync: '1 hour ago'
  },
  {
    id: 'gfg',
    name: 'GeeksforGeeks',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Problems Solved', value: '189' },
      { label: 'Monthly Score', value: '2,847' },
      { label: 'Streak', value: '23 days' },
      { label: 'Rank', value: '4,521' }
    ],
    lastSync: '3 hours ago'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    icon: Trophy,
    color: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Problems Solved', value: '134' },
      { label: 'Badges Earned', value: '12' },
      { label: 'Certificates', value: '5' },
      { label: 'Rank', value: '2,156' }
    ],
    lastSync: '5 hours ago'
  }
];

const mockChartData = [
  { name: 'Jan', value: 23 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 67 },
  { name: 'Apr', value: 43 },
  { name: 'May', value: 89 },
  { name: 'Jun', value: 92 },
];

export default function Stats() {
  const [loadingStates, setLoadingStates] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  const handleSync = async (platformId) => {
    setLoadingStates(prev => ({ ...prev, [platformId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [platformId]: false }));
    }, 2000);
  };

  const syncAll = async () => {
    const newLoadingStates = {};
    platforms.forEach(platform => {
      newLoadingStates[platform.id] = true;
    });
    setLoadingStates(newLoadingStates);

    setTimeout(() => {
      setLoadingStates({});
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Coding Stats Dashboard</h1>
                <p className="text-slate-600">Track your progress across all platforms</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">87</div>
                <div className="text-sm text-slate-600">Credibility Score</div>
              </div>
              <Button
                onClick={syncAll}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                disabled={Object.values(loadingStates).some(Boolean)}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${Object.values(loadingStates).some(Boolean) ? 'animate-spin' : ''}`} />
                Sync All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-lg p-1 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Platforms
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Total Problems</h3>
                      <p className="text-2xl font-bold text-blue-600">570</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+23 this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Active Streak</h3>
                      <p className="text-2xl font-bold text-green-600">23 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Personal best!</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Achievements</h3>
                      <p className="text-2xl font-bold text-purple-600">47</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+3 this month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard
                    platform={platform.name}
                    icon={platform.icon}
                    stats={platform.stats}
                    isLoading={loadingStates[platform.id]}
                    onSync={() => handleSync(platform.id)}
                    color={platform.color}
                    lastSync={platform.lastSync}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard
                    platform={platform.name}
                    icon={platform.icon}
                    stats={platform.stats}
                    isLoading={loadingStates[platform.id]}
                    onSync={() => handleSync(platform.id)}
                    color={platform.color}
                    lastSync={platform.lastSync}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-slate-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p>Detailed analytics and insights will be available in the next update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}