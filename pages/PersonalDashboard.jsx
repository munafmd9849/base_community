import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  BarChart3, 
  User, 
  FolderOpen,
  PenTool,
  Users,
  Plus,
  TrendingUp,
  CheckCircle,
  Calendar,
  Trophy,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  {
    title: "Manage Tasks",
    description: "Add and organize your learning tasks",
    icon: Target,
    link: "Tracker",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "View Stats",
    description: "Check your coding platform progress",
    icon: BarChart3,
    link: "Stats", 
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "Manage Projects",
    description: "Showcase your latest work",
    icon: FolderOpen,
    link: "Projects",
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Write Posts",
    description: "Share your learning journey",
    icon: PenTool,
    link: "Posts",
    color: "from-amber-500 to-orange-600"
  }
];

const recentActivity = [
  { type: "task", title: "Completed Binary Search Implementation", time: "2 hours ago", icon: CheckCircle },
  { type: "project", title: "Updated Weather App Repository", time: "1 day ago", icon: FolderOpen },
  { type: "post", title: "Published Learning Reflection", time: "3 days ago", icon: PenTool },
  { type: "stat", title: "Solved 5 LeetCode Problems", time: "1 week ago", icon: TrendingUp }
];

const communityHighlights = [
  {
    name: "Tech University CS",
    contest: "DSA Challenge #3",
    rank: "#23",
    deadline: "2 days left"
  }
];

export default function PersonalDashboard() {
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [credibilityScore, setCredibilityScore] = useState(847);

  useEffect(() => {
    const joined = localStorage.getItem('skillport_joined_community') === 'true';
    setHasJoinedCommunity(joined);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex!</h1>
              <p className="text-lg text-slate-600">Let's continue your learning journey.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{credibilityScore}</div>
              <div className="text-sm text-slate-600">Credibility Score</div>
              <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">Expert</Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-slate-600">Active Tasks</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">147</div>
              <div className="text-sm text-slate-600">Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <FolderOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-slate-600">Projects</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">{hasJoinedCommunity ? "1" : "0"}</div>
              <div className="text-sm text-slate-600">Communities</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={createPageUrl(action.link)}>
                      <Card className="border border-slate-200 hover:shadow-md transition-all duration-300 group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{action.title}</h3>
                              <p className="text-sm text-slate-600">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasJoinedCommunity ? (
                  <div className="space-y-4">
                    {communityHighlights.map((community, index) => (
                      <Card key={index} className="border border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900">{community.name}</h3>
                              <p className="text-sm text-slate-600">{community.contest}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">Rank {community.rank}</Badge>
                                <span className="text-xs text-amber-600">{community.deadline}</span>
                              </div>
                            </div>
                            <Link to={createPageUrl("CommunityTasks")}>
                              <Button size="sm">
                                View Tasks
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Link to={createPageUrl("Communities")}>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Join Another Community
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-medium text-slate-900 mb-2">Join a Community</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Connect with others and participate in community challenges
                    </p>
                    <Link to={createPageUrl("Communities")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Explore Communities
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}