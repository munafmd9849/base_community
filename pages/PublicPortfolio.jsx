import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skill } from "@/entities/Skill";
import { Badge as BadgeEntity } from "@/entities/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Copy,
  CheckCircle,
  ExternalLink,
  FileText,
  Trophy,
  Target,
  User,
  Calendar,
  Mail,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

// Mock user data - in real app, this would be fetched based on username
const mockUser = {
  username: "alexjohnson",
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Full-stack developer passionate about building scalable solutions and learning new technologies. I love solving complex problems and sharing knowledge with the community.",
  location: "San Francisco, CA",
  joinDate: "2023-01-15",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  website: "https://alexjohnson.dev",
  credibilityScore: 847,
  isPublic: true
};

export default function PublicPortfolio() {
  const { username } = useParams();
  const [skills, setSkills] = useState([]);
  const [badges, setBadges] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadPortfolioData();
  }, [username]);

  const loadPortfolioData = async () => {
    try {
      // In real app, filter by user and public skills only
      const fetchedSkills = await Skill.list("-updated_date");
      const publicSkills = fetchedSkills.filter(skill => skill.isPublic !== false);
      setSkills(publicSkills);

      const fetchedBadges = await BadgeEntity.list("-dateAwarded");
      setBadges(fetchedBadges);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSkillStats = () => {
    const expertSkills = skills.filter(s => s.proficiency >= 80);
    const certifiedSkills = skills.filter(s => s.certificateUrl);
    const avgProficiency = skills.length > 0 
      ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
      : 0;

    return {
      total: skills.length,
      expert: expertSkills.length,
      certified: certifiedSkills.length,
      avgProficiency
    };
  };

  const getCategoryDistribution = () => {
    return skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});
  };

  const topSkills = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 6);

  const stats = getSkillStats();
  const categoryDistribution = getCategoryDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">SkillPort</span>
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
                  Share Portfolio
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
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
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Trophy className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
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
                  <Mail className="w-4 h-4" />
                  {mockUser.email}
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
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Skills</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.expert}</div>
              <div className="text-sm text-slate-600">Expert Level</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.certified}</div>
              <div className="text-sm text-slate-600">Certified</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">{badges.length}</div>
              <div className="text-sm text-slate-600">Badges Earned</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-lg p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Skills ({skills.length})
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Badges ({badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Top Skills */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-2xl">{skill.badgeIcon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{skill.skillName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Proficiency</span>
                            <span className="text-sm font-bold text-slate-900">{skill.proficiency}%</span>
                          </div>
                          <Progress value={skill.proficiency} className="h-2" />
                        </div>
                        {(skill.projectLink || skill.certificateUrl) && (
                          <div className="flex gap-2 mt-4">
                            {skill.projectLink && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={skill.projectLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Project
                                </a>
                              </Button>
                            )}
                            {skill.certificateUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Cert
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills by Category</h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Object.entries(categoryDistribution).map(([category, count]) => {
                      const percentage = Math.round((count / skills.length) * 100);
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{category}</span>
                            <span className="text-slate-600">{count} skills ({percentage}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl">{skill.badgeIcon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{skill.skillName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {skill.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {skill.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Proficiency</span>
                          <span className="text-sm font-bold text-slate-900">{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2" />
                      </div>

                      {skill.tags && skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {skill.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {skill.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{skill.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {(skill.projectLink || skill.certificateUrl) && (
                        <div className="flex gap-2">
                          {skill.projectLink && (
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <a href={skill.projectLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Project
                              </a>
                            </Button>
                          )}
                          {skill.certificateUrl && (
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-3 h-3 mr-1" />
                                Certificate
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No badges earned yet</h3>
                  <p className="text-slate-600">
                    This user is working on earning their first badges!
                  </p>
                </div>
              ) : (
                badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{badge.badgeIcon}</div>
                        <h3 className="font-semibold text-slate-900 mb-2">{badge.badgeName}</h3>
                        <p className="text-sm text-slate-600 mb-3">{badge.criteria}</p>
                        <Badge variant="outline" className="text-xs">
                          {new Date(badge.dateAwarded).toLocaleDateString()}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}