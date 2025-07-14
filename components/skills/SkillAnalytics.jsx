import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target,
  Award,
  AlertCircle,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

export default function SkillAnalytics({ skills }) {
  // Calculate analytics data
  const categoryDistribution = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  const proficiencyDistribution = skills.reduce((acc, skill) => {
    const level = skill.proficiency <= 40 ? 'Beginner' : 
                  skill.proficiency <= 70 ? 'Intermediate' : 'Expert';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const averageProficiency = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length)
    : 0;

  const topSkills = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 5);

  const skillsNeedingAttention = skills.filter(skill => 
    skill.proficiency < 50 || (!skill.certificateUrl && !skill.projectLink)
  );

  const skillsWithCertificates = skills.filter(skill => skill.certificateUrl);
  const skillsWithProjects = skills.filter(skill => skill.projectLink);

  const getCategoryColor = (category) => {
    const colors = {
      Technical: "bg-blue-500",
      "Soft Skill": "bg-green-500",
      Language: "bg-purple-500",
      Creative: "bg-pink-500",
      Business: "bg-amber-500",
      Other: "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getProficiencyColor = (level) => {
    const colors = {
      Beginner: "bg-orange-500",
      Intermediate: "bg-blue-500",
      Expert: "bg-green-500"
    };
    return colors[level] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
              <div className="text-sm text-slate-600">Total Skills</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{averageProficiency}%</div>
              <div className="text-sm text-slate-600">Avg. Proficiency</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{skillsWithCertificates.length}</div>
              <div className="text-sm text-slate-600">Certified</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <ExternalLink className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">{skillsWithProjects.length}</div>
              <div className="text-sm text-slate-600">With Projects</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Skills by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categoryDistribution).map(([category, count]) => {
                const percentage = Math.round((count / skills.length) * 100);
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                      <span className="text-sm text-slate-600">{count} skills ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(category)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Proficiency Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Proficiency Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(proficiencyDistribution).map(([level, count]) => {
                const percentage = Math.round((count / skills.length) * 100);
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{level}</span>
                      <span className="text-sm text-slate-600">{count} skills ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProficiencyColor(level)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Skills by Proficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSkills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <div className="text-lg">{skill.badgeIcon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-900">{skill.skillName}</span>
                      <span className="text-sm font-bold text-slate-900">{skill.proficiency}%</span>
                    </div>
                    <Progress value={skill.proficiency} className="h-2" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Needing Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Skills Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skillsNeedingAttention.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All skills are well-documented!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {skillsNeedingAttention.slice(0, 5).map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <div className="text-lg">{skill.badgeIcon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{skill.skillName}</div>
                        <div className="text-xs text-slate-600">
                          {skill.proficiency < 50 && "Low proficiency • "}
                          {!skill.certificateUrl && "No certificate • "}
                          {!skill.projectLink && "No project link"}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {skill.proficiency}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}