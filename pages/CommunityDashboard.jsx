import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Trophy, 
  ShieldCheck, 
  ArrowRight, 
  Target,
  Code,
  Coffee,
  FolderOpen,
  Plus,
  TrendingUp,
  Activity,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

const contestTypes = [
  { name: 'DSA Contest', icon: Target, color: 'from-blue-500 to-cyan-500', participants: 45, active: true },
  { name: 'Java Contest', icon: Coffee, color: 'from-orange-500 to-red-500', participants: 32, active: true },
  { name: 'C Contest', icon: Code, color: 'from-purple-500 to-pink-500', participants: 28, active: false },
  { name: 'Project Submissions', icon: FolderOpen, color: 'from-green-500 to-emerald-500', participants: 19, active: true },
];

const communityStats = [
  { label: 'Total Members', value: '156', icon: Users, color: 'text-blue-600' },
  { label: 'Active Contests', value: '3', icon: Trophy, color: 'text-amber-600' },
  { label: 'Tasks Completed', value: '1,247', icon: Target, color: 'text-green-600' },
  { label: 'Average Score', value: '847', icon: TrendingUp, color: 'text-purple-600' },
];

export default function CommunityDashboard() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [communityName, setCommunityName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [joinPassword, setJoinPassword] = useState('');

    const handleCreateCommunity = (e) => {
        e.preventDefault();
        // In a real app, this would call an API
        alert(`Community "${communityName}" created! \nInvite Code: ${inviteCode}\nPassword: ${joinPassword}`);
        setIsCreateModalOpen(false);
        setCommunityName('');
        setInviteCode('');
        setJoinPassword('');
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Dashboard</h1>
                    <p className="text-lg text-slate-600">Manage your community's contests, members, and progress.</p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Community
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Community</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateCommunity} className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="community-name">Community Name</Label>
                                <Input id="community-name" value={communityName} onChange={e => setCommunityName(e.target.value)} placeholder="e.g., Tech University" required />
                            </div>
                            <div>
                                <Label htmlFor="invite-code">Invite Code</Label>
                                <Input id="invite-code" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="e.g., TECHUNIV24" required />
                            </div>
                            <div>
                                <Label htmlFor="join-password">Join Password</Label>
                                <Input id="join-password" type="password" value={joinPassword} onChange={e => setJoinPassword(e.target.value)} placeholder="A secure password for members" required />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {communityStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Active Contests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Active Contests</h2>
            <Link to={createPageUrl("Contests")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Manage Contests
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contestTypes.map((contest, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${contest.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <contest.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{contest.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={contest.active ? "default" : "secondary"}>
                      {contest.active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-slate-600">{contest.participants} participants</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 bg-gradient-to-r ${contest.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to={createPageUrl("Admin")}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-slate-900 mb-2">Admin Panel</h3>
                  <p className="text-sm text-slate-600">Create and manage community tasks</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Leaderboard")}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-slate-900 mb-2">Leaderboard</h3>
                  <p className="text-sm text-slate-600">View member rankings and scores</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Members")}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-slate-900 mb-2">Manage Members</h3>
                  <p className="text-sm text-slate-600">View and manage community members</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}