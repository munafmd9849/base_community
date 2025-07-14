import React, { useState, useEffect } from "react";
import { ClassContest } from "@/entities/ClassContest";
import { Member } from "@/entities/Member"; 
import { Submission } from "@/entities/Submission";
import { Certificate } from "@/entities/Certificate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  Trophy,
  Users,
  Code,
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  ExternalLink,
  Target,
  BarChart3,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

import ClassContestTable from "../components/contest/ClassContestTable";
import MemberTable from "../components/contest/MemberTable";
import SubmissionTracker from "../components/contest/SubmissionTracker";
import Leaderboard from "../components/contest/Leaderboard";
import CertificateGenerator from "../components/contest/CertificateGenerator";

export default function ContestTracker() {
  const [activeTab, setActiveTab] = useState("classes");
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: "",
    platform: "all",
    category: "all",
    date: "all",
    member: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classData, memberData, submissionData, certificateData] = await Promise.all([
        ClassContest.list("-date"),
        Member.list("-created_date"),
        Submission.list("-submissionTime"),
        Certificate.list("-completionDate")
      ]);
      
      setClasses(classData);
      setMembers(memberData);
      setSubmissions(submissionData);
      setCertificates(certificateData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const totalProblems = classes.reduce((sum, cls) => sum + (cls.problems?.length || 0), 0);
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(sub => sub.verdict === "AC").length;
    const accuracy = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

    return {
      totalClasses: classes.length,
      totalMembers: members.length,
      totalProblems,
      totalSubmissions,
      accuracy,
      certificatesIssued: certificates.filter(cert => cert.isIssued).length
    };
  };

  const stats = getStats();

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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Contest Tracker</h1>
                <p className="text-slate-600">Manage classes, track submissions, and generate certificates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import LeetCode
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">{stats.totalClasses}</div>
              <div className="text-xs text-slate-600">Classes</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">{stats.totalMembers}</div>
              <div className="text-xs text-slate-600">Members</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-600">{stats.totalProblems}</div>
              <div className="text-xs text-slate-600">Problems</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4 text-center">
              <Code className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-amber-600">{stats.totalSubmissions}</div>
              <div className="text-xs text-slate-600">Submissions</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-teal-600">{stats.accuracy}%</div>
              <div className="text-xs text-slate-600">Accuracy</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-rose-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-rose-600">{stats.certificatesIssued}</div>
              <div className="text-xs text-slate-600">Certificates</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 rounded-lg p-1 mb-6">
            <TabsTrigger value="classes" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="submissions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Code className="w-4 h-4 mr-2" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <ClassContestTable 
              classes={classes} 
              onRefresh={loadData}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <MemberTable 
              members={members} 
              submissions={submissions}
              onRefresh={loadData}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <SubmissionTracker 
              submissions={submissions}
              members={members}
              classes={classes}
              onRefresh={loadData}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard 
              members={members}
              submissions={submissions}
              classes={classes}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <CertificateGenerator 
              certificates={certificates}
              members={members}
              classes={classes}
              onRefresh={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}