import React, { useState, useEffect } from "react";
import { Skill } from "@/entities/Skill";
import { Badge as BadgeEntity } from "@/entities/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Target, 
  TrendingUp, 
  Download,
  Share2,
  Star,
  Trophy,
  Book,
  ExternalLink,
  FileText,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SkillCard from "../components/skills/SkillCard";
import SkillModal from "../components/skills/SkillModal";
import SkillFilters from "../components/skills/SkillFilters";
import SkillAnalytics from "../components/skills/SkillAnalytics";

export default function SkillTracker() {
  const [skills, setSkills] = useState([]);
  const [badges, setBadges] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    proficiency: "all",
    sortBy: "updated"
  });

  useEffect(() => {
    loadSkills();
    loadBadges();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, filters]);

  const loadSkills = async () => {
    try {
      const fetchedSkills = await Skill.list("-updated_date");
      setSkills(fetchedSkills);
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBadges = async () => {
    try {
      const fetchedBadges = await BadgeEntity.list("-dateAwarded");
      setBadges(fetchedBadges);
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  };

  const filterSkills = () => {
    let filtered = [...skills];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.skillName.toLowerCase().includes(searchTerm) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        skill.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(skill => skill.category === filters.category);
    }

    // Proficiency filter
    if (filters.proficiency !== "all") {
      const proficiencyRanges = {
        beginner: [0, 40],
        intermediate: [41, 70],
        expert: [71, 100]
      };
      const [min, max] = proficiencyRanges[filters.proficiency];
      filtered = filtered.filter(skill => skill.proficiency >= min && skill.proficiency <= max);
    }

    // Sorting
    switch (filters.sortBy) {
      case "proficiency":
        filtered.sort((a, b) => b.proficiency - a.proficiency);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.skillName.localeCompare(b.skillName));
        break;
      case "updated":
      default:
        filtered.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
        break;
    }

    setFilteredSkills(filtered);
  };

  const handleCreateSkill = async (skillData) => {
    try {
      await Skill.create(skillData);
      loadSkills();
      checkForNewBadges();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };

  const handleEditSkill = async (skillData) => {
    try {
      await Skill.update(editingSkill.id, skillData);
      loadSkills();
      checkForNewBadges();
      setEditingSkill(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await Skill.delete(skillId);
      loadSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const checkForNewBadges = async () => {
    const currentSkills = await Skill.list();
    const earnedBadges = [];

    // Check for skill count badges
    if (currentSkills.length >= 5 && !badges.some(b => b.badgeType === "skill_count" && b.criteria.includes("5"))) {
      earnedBadges.push({
        badgeName: "Bronze Collector",
        badgeIcon: "🥉",
        criteria: "Earned 5+ skills",
        badgeType: "skill_count",
        dateAwarded: new Date().toISOString().split('T')[0],
        userId: "current_user"
      });
    }

    if (currentSkills.length >= 10 && !badges.some(b => b.badgeType === "skill_count" && b.criteria.includes("10"))) {
      earnedBadges.push({
        badgeName: "Silver Collector",
        badgeIcon: "🥈",
        criteria: "Earned 10+ skills",
        badgeType: "skill_count",
        dateAwarded: new Date().toISOString().split('T')[0],
        userId: "current_user"
      });
    }

    // Check for proficiency badges
    const expertSkills = currentSkills.filter(s => s.proficiency >= 90);
    if (expertSkills.length >= 3 && !badges.some(b => b.badgeType === "proficiency" && b.criteria.includes("Expert"))) {
      earnedBadges.push({
        badgeName: "Expert Master",
        badgeIcon: "🎯",
        criteria: "Expert level in 3+ skills",
        badgeType: "proficiency",
        dateAwarded: new Date().toISOString().split('T')[0],
        userId: "current_user"
      });
    }

    // Check for certificate badges
    const certifiedSkills = currentSkills.filter(s => s.certificateUrl);
    if (certifiedSkills.length >= 3 && !badges.some(b => b.badgeType === "certificate")) {
      earnedBadges.push({
        badgeName: "Certified Professional",
        badgeIcon: "📜",
        criteria: "Uploaded 3+ certificates",
        badgeType: "certificate",
        dateAwarded: new Date().toISOString().split('T')[0],
        userId: "current_user"
      });
    }

    // Award new badges
    for (const badge of earnedBadges) {
      await BadgeEntity.create(badge);
    }

    if (earnedBadges.length > 0) {
      loadBadges();
      // Show notification
      alert(`🎉 New badge${earnedBadges.length > 1 ? 's' : ''} earned: ${earnedBadges.map(b => b.badgeName).join(', ')}`);
    }
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const exportToPDF = () => {
    // Implementation would use html2pdf or similar
    alert("PDF export feature - would generate a portfolio PDF with all skills, badges, and certificates");
  };

  const copyPublicLink = () => {
    const publicLink = `${window.location.origin}/portfolio/alexjohnson`;
    navigator.clipboard.writeText(publicLink);
    alert("Public portfolio link copied to clipboard!");
  };

  const getSkillStats = () => {
    return {
      total: skills.length,
      expert: skills.filter(s => s.proficiency >= 80).length,
      certified: skills.filter(s => s.certificateUrl).length,
      avgProficiency: skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length) : 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-lg"></div>
            <div className="h-24 bg-white rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getSkillStats();

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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Skill Tracker</h1>
                <p className="text-slate-600">Track, verify, and showcase your skills</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-slate-600">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.expert}</div>
                  <div className="text-slate-600">Expert</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{badges.length}</div>
                  <div className="text-slate-600">Badges</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportToPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={copyPublicLink}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-lg p-1 mb-6">
            <TabsTrigger value="skills" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Target className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Trophy className="w-4 h-4 mr-2" />
              Badges ({badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SkillFilters
                filters={filters}
                onFilterChange={setFilters}
                skillCounts={{
                  total: skills.length,
                  technical: skills.filter(s => s.category === 'Technical').length,
                  softSkill: skills.filter(s => s.category === 'Soft Skill').length,
                  beginner: skills.filter(s => s.proficiency <= 40).length,
                  intermediate: skills.filter(s => s.proficiency > 40 && s.proficiency <= 70).length,
                  expert: skills.filter(s => s.proficiency > 70).length
                }}
              />
            </motion.div>

            {/* Skills Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredSkills.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {skills.length === 0 ? "No skills yet" : "No skills match your filters"}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {skills.length === 0 
                      ? "Start building your skill portfolio by adding your first skill"
                      : "Try adjusting your filters or search term"
                    }
                  </p>
                  {skills.length === 0 && (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredSkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onEdit={openEditModal}
                        onDelete={handleDeleteSkill}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SkillAnalytics skills={skills} />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No badges earned yet</h3>
                  <p className="text-slate-600">
                    Keep adding skills and improving your proficiency to earn badges!
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

        {/* Skill Modal */}
        <SkillModal
          isOpen={isModalOpen}
          onClose={closeModal}
          skill={editingSkill}
          onSave={editingSkill ? handleEditSkill : handleCreateSkill}
        />
      </div>
    </div>
  );
}