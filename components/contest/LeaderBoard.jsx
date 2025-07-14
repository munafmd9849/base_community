import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy,
  Medal,
  Award,
  Target,
  BarChart3,
  Clock,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard({ members, submissions, classes, filters, onFiltersChange }) {
  const [sortBy, setSortBy] = useState("score");
  const [timeFilter, setTimeFilter] = useState("all");

  const calculateMemberStats = (memberId) => {
    let memberSubmissions = submissions.filter(sub => sub.memberId === memberId);
    
    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      memberSubmissions = memberSubmissions.filter(sub => 
        new Date(sub.submissionTime) >= filterDate
      );
    }

    const acceptedSubmissions = memberSubmissions.filter(sub => sub.verdict === "AC");
    const uniqueProblems = new Set(acceptedSubmissions.map(sub => sub.problemName));
    const totalScore = memberSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    const accuracy = memberSubmissions.length > 0 
      ? Math.round((acceptedSubmissions.length / memberSubmissions.length) * 100) 
      : 0;

    // Calculate average time taken (for AC submissions with time data)
    const acWithTime = acceptedSubmissions.filter(sub => sub.timeTaken > 0);
    const avgTime = acWithTime.length > 0 
      ? Math.round(acWithTime.reduce((sum, sub) => sum + sub.timeTaken, 0) / acWithTime.length)
      : 0;

    return {
      problemsSolved: uniqueProblems.size,
      totalSubmissions: memberSubmissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      totalScore,
      accuracy,
      avgTime
    };
  };

  const rankedMembers = members.map(member => ({
    ...member,
    stats: calculateMemberStats(member.id)
  })).sort((a, b) => {
    switch (sortBy) {
      case "problems":
        return b.stats.problemsSolved - a.stats.problemsSolved;
      case "accuracy":
        return b.stats.accuracy - a.stats.accuracy;
      case "time":
        return a.stats.avgTime - b.stats.avgTime;
      case "score":
      default:
        return b.stats.totalScore - a.stats.totalScore;
    }
  });

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-slate-500 font-bold">{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-amber-50 border-amber-200";
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Contest Leaderboard</h2>
              <p className="text-sm text-slate-600">Rankings based on performance and scores</p>
            </div>
            <div className="flex gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Total Score</SelectItem>
                  <SelectItem value="problems">Problems Solved</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="time">Average Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {rankedMembers.slice(0, 3).map((member, index) => {
          const rank = index + 1;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${getRankColor(rank)} ${rank === 1 ? 'md:order-2 transform md:scale-105' : rank === 2 ? 'md:order-1' : 'md:order-3'}`}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {getRankIcon(rank)}
                  </div>
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={member.profileImage} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">@{member.username}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-lg text-blue-600">{member.stats.totalScore}</div>
                      <div className="text-slate-600">Score</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-green-600">{member.stats.problemsSolved}</div>
                      <div className="text-slate-600">Solved</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-purple-600">{member.stats.accuracy}%</div>
                      <div className="text-slate-600">Accuracy</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-600">{member.stats.acceptedSubmissions}</div>
                      <div className="text-slate-600">AC</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {rankedMembers.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No data available</h3>
              <p className="text-slate-600">Add members and submissions to see rankings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead className="text-center">Problems Solved</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Accuracy</TableHead>
                    <TableHead className="text-center">AC/Total</TableHead>
                    {sortBy === "time" && <TableHead className="text-center">Avg Time</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedMembers.map((member, index) => {
                    const rank = index + 1;
                    return (
                      <TableRow key={member.id} className={rank <= 3 ? getRankColor(rank) : ""}>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.profileImage} alt={member.name} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-slate-500">@{member.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-lg">{member.stats.problemsSolved}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-100 text-blue-800 font-semibold">
                            {member.stats.totalScore}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BarChart3 className="w-4 h-4 text-green-500" />
                            <span className={`font-semibold ${member.stats.accuracy >= 80 ? 'text-green-600' : member.stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {member.stats.accuracy}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm">
                            <span className="text-green-600 font-medium">{member.stats.acceptedSubmissions}</span>
                            <span className="text-slate-400"> / </span>
                            <span className="text-slate-600">{member.stats.totalSubmissions}</span>
                          </span>
                        </TableCell>
                        {sortBy === "time" && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <span className="text-sm">
                                {member.stats.avgTime > 0 ? `${member.stats.avgTime}m` : "—"}
                              </span>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}