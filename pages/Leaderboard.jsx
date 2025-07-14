import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";

const mockUsers = [
  {"id": 1, "full_name": "Elena Rodriguez", "email": "elena.r@example.com", "credibility_score": 980, "badge": "Gold", "avatar_url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop&crop=face"},
  {"id": 2, "full_name": "Ben Carter", "email": "ben.c@example.com", "credibility_score": 955, "badge": "Gold", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"},
  {"id": 3, "full_name": "Aisha Khan", "email": "aisha.k@example.com", "credibility_score": 920, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"},
  {"id": 4, "full_name": "Marcus Chen", "email": "marcus.c@example.com", "credibility_score": 890, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&crop=face"},
  {"id": 5, "full_name": "Sophia Loren", "email": "sophia.l@example.com", "credibility_score": 850, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face"},
  {"id": 6, "full_name": "David Kim", "email": "david.k@example.com", "credibility_score": 780, "badge": "Bronze", "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=40&h=40&fit=crop&crop=face"},
  {"id": 7, "full_name": "Olivia Martinez", "email": "olivia.m@example.com", "credibility_score": 720, "badge": "Bronze", "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face"}
];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // In a real app:
    // const fetchedUsers = await User.list("-credibility_score");
    // setUsers(fetchedUsers);
    setUsers(mockUsers.sort((a, b) => b.credibility_score - a.credibility_score));
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-700";
    return "text-slate-500";
  };
  
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Gold": return "bg-yellow-100 text-yellow-800";
      case "Silver": return "bg-slate-100 text-slate-800";
      case "Bronze": return "bg-amber-100 text-amber-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-slate-600">See who is at the top of their game.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Badge</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="text-center">
                        <span className={`text-lg font-bold ${getRankColor(index + 1)}`}>
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || `https://avatar.vercel.sh/${user.email}.png`}
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{user.full_name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(user.badge)}`}>
                          <Award className="w-3 h-3" />
                          {user.badge}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-600 text-lg">
                        {user.credibility_score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}