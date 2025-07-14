import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Coffee, 
  Code, 
  FolderOpen, 
  Plus, 
  Calendar,
  Users,
  Trophy,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { motion } from 'framer-motion';

const contestTypes = [
  { id: 'dsa', name: 'DSA Contest', icon: Target, color: 'from-blue-500 to-cyan-500' },
  { id: 'java', name: 'Java Contest', icon: Coffee, color: 'from-orange-500 to-red-500' },
  { id: 'c', name: 'C Contest', icon: Code, color: 'from-purple-500 to-pink-500' },
  { id: 'projects', name: 'Project Submissions', icon: FolderOpen, color: 'from-green-500 to-emerald-500' },
];

const mockContests = {
  dsa: [
    { id: 1, title: 'Two Sum Problem', platform: 'LeetCode', deadline: '2024-02-15', participants: 45, status: 'active' },
    { id: 2, title: 'Binary Tree Traversal', platform: 'GFG', deadline: '2024-02-20', participants: 38, status: 'active' },
  ],
  java: [
    { id: 3, title: 'OOP Concepts Challenge', platform: 'HackerRank', deadline: '2024-02-18', participants: 32, status: 'active' },
  ],
  c: [
    { id: 4, title: 'Pointer Mastery', platform: 'HackerRank', deadline: '2024-02-25', participants: 28, status: 'draft' },
  ],
  projects: [
    { id: 5, title: 'Web App Project', platform: 'GitHub', deadline: '2024-03-01', participants: 19, status: 'active' },
  ],
};

export default function Contests() {
  const [activeTab, setActiveTab] = useState('dsa');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contests, setContests] = useState(mockContests);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'LeetCode',
    deadline: '',
    contestType: 'dsa',
    link: ''
  });

  const handleCreateContest = (e) => {
    e.preventDefault();
    const newContest = {
      id: Date.now(),
      ...formData,
      participants: 0,
      status: 'draft'
    };
    
    setContests(prev => ({
      ...prev,
      [formData.contestType]: [...(prev[formData.contestType] || []), newContest]
    }));
    
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      description: '',
      platform: 'LeetCode',
      deadline: '',
      contestType: 'dsa',
      link: ''
    });
  };

  const toggleContestStatus = (contestType, contestId) => {
    setContests(prev => ({
      ...prev,
      [contestType]: prev[contestType].map(contest =>
        contest.id === contestId
          ? { ...contest, status: contest.status === 'active' ? 'paused' : 'active' }
          : contest
      )
    }));
  };

  const deleteContest = (contestType, contestId) => {
    setContests(prev => ({
      ...prev,
      [contestType]: prev[contestType].filter(contest => contest.id !== contestId)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentContestType = contestTypes.find(type => type.id === activeTab);

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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Contest Management</h1>
              <p className="text-lg text-slate-600">Create and manage contests for your community.</p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contest
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Contest</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCreateContest} className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Contest Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Two Sum Problem"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contestType">Contest Type</Label>
                      <Select value={formData.contestType} onValueChange={(value) => setFormData(prev => ({ ...prev, contestType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contestTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the contest objectives and requirements..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LeetCode">LeetCode</SelectItem>
                          <SelectItem value="GFG">GeeksforGeeks</SelectItem>
                          <SelectItem value="HackerRank">HackerRank</SelectItem>
                          <SelectItem value="GitHub">GitHub</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Contest Link (Optional)</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://leetcode.com/problems/two-sum/"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Create Contest
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Contest Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 rounded-lg p-1 mb-6">
              {contestTypes.map(type => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <type.icon className="w-4 h-4" />
                  {type.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {contestTypes.map(type => (
              <TabsContent key={type.id} value={type.id} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{type.name}</h2>
                    <p className="text-slate-600">{contests[type.id]?.length || 0} contests</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contests[type.id]?.map((contest, index) => (
                    <motion.div
                      key={contest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-slate-900 mb-2">
                                {contest.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(contest.status)}>
                                  {contest.status}
                                </Badge>
                                <Badge variant="outline">{contest.platform}</Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => toggleContestStatus(type.id, contest.id)}
                              >
                                {contest.status === 'active' ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => deleteContest(type.id, contest.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              Deadline: {new Date(contest.deadline).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="w-4 h-4" />
                              {contest.participants} participants
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )) || (
                    <div className="col-span-full text-center py-12">
                      <type.icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No {type.name.toLowerCase()} yet</h3>
                      <p className="text-slate-600 mb-4">Create your first contest to get started.</p>
                      <Button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, contestType: type.id }));
                          setIsCreateModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Contest
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}