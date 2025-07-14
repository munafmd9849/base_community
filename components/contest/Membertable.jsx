import React, { useState } from "react";
import { Member } from "@/entities/Member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Trophy,
  Target,
  BarChart3,
  Search,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

export default function MemberTable({ members, submissions, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    profileImage: "",
    leetcodeUsername: "",
    codeforcesUsername: "",
    gfgUsername: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      profileImage: "",
      leetcodeUsername: "",
      codeforcesUsername: "",
      gfgUsername: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await Member.update(editingMember.id, formData);
      } else {
        await Member.create(formData);
      }
      setIsModalOpen(false);
      setEditingMember(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await Member.delete(memberId);
        onRefresh();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const getMemberStats = (memberId) => {
    const memberSubmissions = submissions.filter(sub => sub.memberId === memberId);
    const acceptedSubmissions = memberSubmissions.filter(sub => sub.verdict === "AC");
    const uniqueProblems = new Set(acceptedSubmissions.map(sub => sub.problemName)).size;
    const accuracy = memberSubmissions.length > 0 
      ? Math.round((acceptedSubmissions.length / memberSubmissions.length) * 100) 
      : 0;

    return {
      totalSubmissions: memberSubmissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      problemsSolved: uniqueProblems,
      accuracy
    };
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportMemberData = () => {
    const csvData = filteredMembers.map(member => {
      const stats = getMemberStats(member.id);
      return {
        Name: member.name,
        Username: member.username,
        Email: member.email,
        'Problems Solved': stats.problemsSolved,
        'Total Submissions': stats.totalSubmissions,
        'Accuracy (%)': stats.accuracy,
        'LeetCode Username': member.leetcodeUsername || '',
        'Codeforces Username': member.codeforcesUsername || '',
        'GFG Username': member.gfgUsername || ''
      };
    });

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportMemberData}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profileImage">Profile Image URL</Label>
                        <Input
                          id="profileImage"
                          value={formData.profileImage}
                          onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Platform Usernames (for auto-import)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="leetcodeUsername">LeetCode</Label>
                          <Input
                            id="leetcodeUsername"
                            value={formData.leetcodeUsername}
                            onChange={(e) => setFormData({...formData, leetcodeUsername: e.target.value})}
                            placeholder="leetcode_username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="codeforcesUsername">Codeforces</Label>
                          <Input
                            id="codeforcesUsername"
                            value={formData.codeforcesUsername}
                            onChange={(e) => setFormData({...formData, codeforcesUsername: e.target.value})}
                            placeholder="cf_username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gfgUsername">GeeksforGeeks</Label>
                          <Input
                            id="gfgUsername"
                            value={formData.gfgUsername}
                            onChange={(e) => setFormData({...formData, gfgUsername: e.target.value})}
                            placeholder="gfg_username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingMember ? 'Update Member' : 'Add Member'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No members found</h3>
              <p className="text-slate-600 mb-4">Add your first member to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Platform Usernames</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const stats = getMemberStats(member.id);
                    return (
                      <TableRow key={member.id}>
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
                        <TableCell>
                          <div className="text-sm">{member.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {member.leetcodeUsername && (
                              <Badge variant="outline" className="text-xs">
                                🟠 {member.leetcodeUsername}
                              </Badge>
                            )}
                            {member.codeforcesUsername && (
                              <Badge variant="outline" className="text-xs">
                                🔵 {member.codeforcesUsername}
                              </Badge>
                            )}
                            {member.gfgUsername && (
                              <Badge variant="outline" className="text-xs">
                                🟢 {member.gfgUsername}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3 text-blue-500" />
                              <span>{stats.problemsSolved} solved</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3 text-green-500" />
                              <span>{stats.accuracy}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-purple-500" />
                              <span>{stats.acceptedSubmissions} AC</span>
                            </div>
                            <div className="text-slate-500">
                              {stats.totalSubmissions} total
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(member.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
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