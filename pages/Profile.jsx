import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Share2,
  Copy,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// Mock user data - in real app, this would be fetched based on username
const mockUser = {
  username: "alexjohnson",
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Full-stack developer passionate about building scalable solutions. Currently learning advanced algorithms and system design. Open to new opportunities in fintech and healthcare technology.",
  location: "San Francisco, CA",
  joinDate: "2023-01-15",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  github: "alexjohnson",
  website: "https://alexjohnson.dev",
  credibilityScore: 847,
  badge: "Expert",
  tier: "Gold"
};

const mockStats = {
  leetcode: { solved: 247, rank: 12847, rating: 1456 },
  github: { commits: 1234, repos: 42, stars: 89 },
  gfg: { solved: 189, score: 2847, streak: 23 },
  hackerrank: { score: 1680, badges: 12, rank: 2156 }
};

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include real-time inventory, payment processing, and admin dashboard.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "Docker"],
    stars: 24,
    forks: 8,
    url: "https://github.com/alexjohnson/ecommerce-platform",
    featured: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management with real-time updates using WebSocket connections and Firebase backend.",
    tags: ["Vue.js", "Firebase", "Tailwind", "WebSocket"],
    stars: 15,
    forks: 4,
    url: "https://github.com/alexjohnson/task-manager"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and data visualization.",
    tags: ["React", "OpenWeather API", "Chart.js", "Mapbox"],
    stars: 31,
    forks: 12,
    url: "https://github.com/alexjohnson/weather-dashboard"
  },
  {
    id: 4,
    title: "Machine Learning Classifier",
    description: "Image classification model using TensorFlow with 94% accuracy on CIFAR-10 dataset.",
    tags: ["Python", "TensorFlow", "OpenCV", "Jupyter"],
    stars: 18,
    forks: 6,
    url: "https://github.com/alexjohnson/ml-classifier"
  }
];

const mockPosts = [
  {
    id: 1,
    title: "Completed 250+ LeetCode Problems!",
    content: "Just hit a major milestone - solved my 250th LeetCode problem. The journey from struggling with easy problems to solving medium/hard consistently has been incredible. Key insight: pattern recognition is everything.",
    tags: ["achievement", "leetcode", "algorithms", "milestone"],
    date: "2024-01-15",
    type: "achievement"
  },
  {
    id: 2,
    title: "Deployed My First Machine Learning Model",
    content: "Successfully deployed an image classification model to production using Docker and AWS. Learned so much about MLOps, model versioning, and monitoring in production environments.",
    tags: ["machine-learning", "deployment", "aws", "docker"],
    date: "2024-01-10",
    type: "achievement"
  },
  {
    id: 3,
    title: "Contributing to Open Source",
    content: "Started contributing to React Native community. Fixed 3 bugs in the core library and added documentation improvements. Amazing how much you learn by reading others' code.",
    tags: ["open-source", "react-native", "community"],
    date: "2024-01-05",
    type: "learning"
  },
  {
    id: 4,
    title: "System Design Deep Dive",
    content: "Spent the weekend designing a distributed chat system. Covered load balancing, database sharding, caching strategies, and real-time messaging. Ready for those system design interviews!",
    tags: ["system-design", "distributed-systems", "learning"],
    date: "2024-01-01",
    type: "learning"
  }
];

const contributionData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  count: Math.floor(Math.random() * 5)
}));

export default function Profile() {
  const [username, setUsername] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUsername(params.get("username"));
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContributionColor = (count) => {
    if (count === 0) return "bg-slate-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-300";
    if (count === 3) return "bg-green-400";
    return "bg-green-500";
  };

  const getBadgeColor = (tier) => {
    switch (tier) {
      case "Gold": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-500";
      case "Bronze": return "bg-gradient-to-r from-amber-600 to-amber-800";
      default: return "bg-gradient-to-r from-slate-400 to-slate-600";
    }
  };
  
  if (!username) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
            <Card className="p-8 text-center">
                <CardHeader>
                    <CardTitle>Profile not found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please provide a username in the URL to view a profile.</p>
                    <p className="text-sm text-slate-500">Example: /profile?username=alexjohnson</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                SkillPort
              </span>
            </div>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-8 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900">{mockUser.name}</h1>
                <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getBadgeColor(mockUser.tier)}`}>
                  <Award className="w-4 h-4 inline mr-1" />
                  {mockUser.badge}
                </div>
              </div>

              <p className="text-lg text-slate-600 mb-4 leading-relaxed">{mockUser.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
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
                  <a href={`https://github.com/${mockUser.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    @{mockUser.github}
                  </a>
                </div>
                {mockUser.website && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    <a href={mockUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{mockUser.credibilityScore}</div>
                <div className="text-sm text-slate-600 mb-2">Credibility Score</div>
              </div>
              <div className="w-24 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(mockUser.credibilityScore / 1000) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">Top 15% globally</div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 rounded-lg p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Posts
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-6 text-center">
                  <Code className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-orange-600 mb-1">{mockStats.leetcode.solved}</div>
                  <div className="text-sm text-slate-600 mb-2">LeetCode Solved</div>
                  <div className="text-xs text-slate-500">Rating: {mockStats.leetcode.rating}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
                <CardContent className="p-6 text-center">
                  <Github className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-slate-700 mb-1">{mockStats.github.commits}</div>
                  <div className="text-sm text-slate-600 mb-2">GitHub Commits</div>
                  <div className="text-xs text-slate-500">{mockStats.github.stars} stars received</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600 mb-1">{mockStats.gfg.solved}</div>
                  <div className="text-sm text-slate-600 mb-2">GFG Problems</div>
                  <div className="text-xs text-slate-500">{mockStats.gfg.streak} day streak</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600 mb-1">{mockStats.hackerrank.score}</div>
                  <div className="text-sm text-slate-600 mb-2">HackerRank Score</div>
                  <div className="text-xs text-slate-500">{mockStats.hackerrank.badges} badges earned</div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProjects.filter(p => p.featured).map((project) => (
                  <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <Button size="sm" variant="ghost" asChild>
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
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: project.id * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <Button size="sm" variant="ghost" asChild>
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
            <div className="space-y-6">
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
                          {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
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

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Contribution Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                  <div className="text-center text-sm text-slate-600">
                    <strong>{contributionData.reduce((sum, day) => sum + day.count, 0)}</strong> contributions in the last year
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}