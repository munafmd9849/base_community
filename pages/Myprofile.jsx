import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User as UserIcon,
  MapPin,
  Calendar,
  Github,
  ExternalLink,
  Trophy,
  Code,
  Star,
  GitBranch,
  Award,
  TrendingUp,
  PlusCircle,
  Key
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";

const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Full-stack developer passionate about building scalable solutions. Currently learning advanced algorithms and system design.",
  location: "San Francisco, CA",
  joinDate: "2023-01-15",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  github: "alexjohnson",
  username: "alexjohnson", 
  credibilityScore: 87,
  badge: "Gold"
};

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution built with React and Node.js",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    stars: 24,
    forks: 8,
    url: "https://github.com/alexjohnson/ecommerce-platform"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management with real-time updates",
    tags: ["Vue.js", "Firebase", "Tailwind"],
    stars: 15,
    forks: 4,
    url: "https://github.com/alexjohnson/task-manager"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Beautiful weather dashboard with location-based forecasts",
    tags: ["React", "OpenWeather API", "Chart.js"],
    stars: 31,
    forks: 12,
    url: "https://github.com/alexjohnson/weather-dashboard"
  }
];

const mockPosts = [
  {
    id: 1,
    title: "Completed 50 LeetCode Problems!",
    content: "Just hit a major milestone - solved my 50th LeetCode problem. The dynamic programming problems are getting easier to recognize now.",
    tags: ["achievement", "leetcode", "algorithms"],
    date: "2024-01-15",
    type: "achievement"
  },
  {
    id: 2,
    title: "Learning System Design",
    content: "Started diving deep into system design concepts. Currently reading 'Designing Data-Intensive Applications' - highly recommend!",
    tags: ["learning", "system-design", "books"],
    date: "2024-01-10",
    type: "learning"
  },
  {
    id: 3,
    title: "Shipped New Feature",
    content: "Successfully deployed the new user authentication system. Used JWT tokens with refresh token rotation for better security.",
    tags: ["project", "authentication", "security"],
    date: "2024-01-05",
    type: "update"
  }
];

const contributionData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  count: Math.floor(Math.random() * 5)
}));

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("stats");
  const [inviteCode, setInviteCode] = useState('');
  const [mode, setMode] = useState('personal');
  const [joinedCommunity, setJoinedCommunity] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('skillport_joined_community') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const storedMode = localStorage.getItem('skillport_mode') || 'personal';
    setMode(storedMode);
  }, []);

  const handleJoinCommunity = () => {
    if (inviteCode) {
      setJoinedCommunity(true);
      localStorage.setItem('skillport_joined_community', 'true');
      alert('Successfully joined the community! Community features are now unlocked.');
      window.location.reload();
    } else {
      alert('Please enter an invite code.');
    }
  };

  const handleViewPublicProfile = () => {
    window.open(createPageUrl(`profile?username=${mockUser.username}`), '_blank');
  };

  const getContributionColor = (count) => {
    if (count === 0) return "bg-slate-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-300";
    if (count === 3) return "bg-green-400";
    return "bg-green-500";
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Gold": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-500";
      case "Bronze": return "bg-gradient-to-r from-amber-600 to-amber-800";
      default: return "bg-gradient-to-r from-slate-400 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{mockUser.name}</h1>
                <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getBadgeColor(mockUser.badge)}`}>
                  <Award className="w-3 h-3 inline mr-1" />
                  {mockUser.badge}
                </div>
              </div>

              <p className="text-slate-600 mb-3">{mockUser.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mockUser.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(mockUser.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  @{mockUser.github}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{mockUser.credibilityScore}</div>
                <div className="text-sm text-slate-600">Credibility Score</div>
              </div>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{ width: `${mockUser.credibilityScore}%` }}
                />
              </div>
              <Button
                onClick={handleViewPublicProfile}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Public Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-lg p-1 mb-6">
            <TabsTrigger value="stats" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Stats & Activity
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4 text-center">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">570</div>
                  <div className="text-sm text-slate-600">Problems Solved</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4 text-center">
                  <GitBranch className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                  <div className="text-sm text-slate-600">Contributions</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-sm text-slate-600">Achievements</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-600">23</div>
                  <div className="text-sm text-slate-600">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Contribution Graph */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Contribution Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-53 gap-1">
                    {contributionData.slice(0, 371).map((day, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}`}
                        title={`${day.count} contributions on ${day.date.toDateString()}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Less</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {project.stars}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          {project.forks}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <div className="space-y-4">
              {mockPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                        <span className="text-sm text-slate-500">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Join Community Section - Renders only in Personal mode and if not already joined */}
        {mode === 'personal' && !joinedCommunity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  Join a Community
                </CardTitle>
                <CardDescription>
                  Enter an invite code to join a community and access exclusive tasks and leaderboards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-grow">
                     <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <Input
                        placeholder="Enter invite code..."
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="pl-9"
                      />
                  </div>
                  <Button onClick={handleJoinCommunity} className="bg-blue-600 hover:bg-blue-700">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}