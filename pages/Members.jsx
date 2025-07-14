import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MoreVertical, Trash2, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockMembers = [
  {"id": 1, "full_name": "Elena Rodriguez", "email": "elena.r@example.com", "credibility_score": 980, "badge": "Gold", "avatar_url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop&crop=face", "role": "Member"},
  {"id": 2, "full_name": "Ben Carter", "email": "ben.c@example.com", "credibility_score": 955, "badge": "Gold", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", "role": "Member"},
  {"id": 3, "full_name": "Aisha Khan", "email": "aisha.k@example.com", "credibility_score": 920, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", "role": "Admin"},
  {"id": 4, "full_name": "Marcus Chen", "email": "marcus.c@example.com", "credibility_score": 890, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&crop=face", "role": "Member"},
  {"id": 5, "full_name": "Sophia Loren", "email": "sophia.l@example.com", "credibility_score": 850, "badge": "Silver", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face", "role": "Member"},
  {"id": 6, "full_name": "David Kim", "email": "david.k@example.com", "credibility_score": 780, "badge": "Bronze", "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=40&h=40&fit=crop&crop=face", "role": "Member"},
];

export default function Members() {
  const getRoleColor = (role) => {
    return role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Members</h1>
          <p className="text-lg text-slate-600">View and manage the members of your community.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{member.full_name}</p>
                            <p className="text-sm text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{member.credibility_score}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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