import React, { useState, useEffect } from "react";
import { Community } from "@/entities/Community";
import { CommunityMember } from "@/entities/CommunityMember";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Key, 
  Mail,
  Globe,
  Trophy,
  Target,
  Lock,
  CheckCircle,
  ArrowRight,
  Search,
  Building
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

const communityTypes = [
  { value: "university", label: "University", icon: "🎓" },
  { value: "school", label: "School", icon: "🏫" },
  { value: "company", label: "Company", icon: "🏢" },
  { value: "club", label: "Club", icon: "🤝" },
  { value: "bootcamp", label: "Bootcamp", icon: "💻" },
  { value: "other", label: "Other", icon: "🌟" }
];

export default function Communities() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinMethod, setJoinMethod] = useState('invite');
  const [inviteCode, setInviteCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState('personal');
  
  // Community creation form
  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    inviteCode: '',
    joinPassword: '',
    emailDomain: '',
    type: 'club'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('skillport_user');
    const userMode = localStorage.getItem('skillport_mode') || 'personal';
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setMode(userMode);
      loadCommunities();
      loadJoinedCommunities(JSON.parse(storedUser).id);
    }
  }, []);

  const loadCommunities = async () => {
    try {
      const fetchedCommunities = await Community.list("-created_date");
      setCommunities(fetchedCommunities);
    } catch (error) {
      console.error("Error loading communities:", error);
    }
  };

  const loadJoinedCommunities = async (userId) => {
    try {
      const memberships = await CommunityMember.filter({ userId }, "-joinDate");
      const communityIds = memberships.map(m => m.communityId);
      const joinedComms = communities.filter(c => communityIds.includes(c.id));
      setJoinedCommunities(joinedComms);
    } catch (error) {
      console.error("Error loading joined communities:", error);
    }
  };

  const handleJoinCommunity = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to join a community');
      return;
    }

    try {
      if (joinMethod === 'invite') {
        if (!inviteCode || !joinPassword) {
          alert('Please provide both invite code and password.');
          return;
        }
        
        // Find community by invite code
        const community = communities.find(c => 
          c.inviteCode.toLowerCase() === inviteCode.toLowerCase() && 
          c.joinPassword === joinPassword
        );
        
        if (!community) {
          alert('Invalid invite code or password.');
          return;
        }

        // Check if already a member
        const existingMembership = await CommunityMember.filter({
          communityId: community.id,
          userId: currentUser.id
        });

        if (existingMembership.length > 0) {
          alert('You are already a member of this community.');
          return;
        }

        // Create membership
        await CommunityMember.create({
          communityId: community.id,
          userId: currentUser.id,
          userName: currentUser.full_name,
          userEmail: currentUser.email,
          joinDate: new Date().toISOString().split('T')[0]
        });

        // Update community member count
        await Community.update(community.id, {
          memberCount: (community.memberCount || 0) + 1
        });

        localStorage.setItem('skillport_joined_community', 'true');
        alert(`Successfully joined ${community.name}!`);
        setJoinModalOpen(false);
        loadJoinedCommunities(currentUser.id);
        
      } else if (joinMethod === 'email') {
        if (!email) {
          alert('Please enter your institutional email.');
          return;
        }
        
        // Check if email domain matches any community
        const matchingCommunity = communities.find(c => 
          c.emailDomain && email.endsWith(c.emailDomain.substring(1))
        );
        
        if (!matchingCommunity) {
          alert('Your email domain is not associated with any available community.');
          return;
        }

        // Check if already a member
        const existingMembership = await CommunityMember.filter({
          communityId: matchingCommunity.id,
          userId: currentUser.id
        });

        if (existingMembership.length > 0) {
          alert('You are already a member of this community.');
          return;
        }

        // Create membership
        await CommunityMember.create({
          communityId: matchingCommunity.id,
          userId: currentUser.id,
          userName: currentUser.full_name,
          userEmail: currentUser.email,
          joinDate: new Date().toISOString().split('T')[0]
        });

        // Update community member count
        await Community.update(matchingCommunity.id, {
          memberCount: (matchingCommunity.memberCount || 0) + 1
        });

        localStorage.setItem('skillport_joined_community', 'true');
        alert(`Successfully joined ${matchingCommunity.name} using your institutional email!`);
        setJoinModalOpen(false);
        loadJoinedCommunities(currentUser.id);
      }
    } catch (error) {
      console.error("Error joining community:", error);
      alert('Error joining community. Please try again.');
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to create a community');
      return;
    }
    
    if (!communityForm.name || !communityForm.inviteCode || !communityForm.joinPassword) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Check if invite code already exists
      const existingCommunity = communities.find(c => 
        c.inviteCode.toLowerCase() === communityForm.inviteCode.toLowerCase()
      );

      if (existingCommunity) {
        alert('This invite code is already taken. Please choose another one.');
        return;
      }

      const newCommunity = {
        ...communityForm,
        adminId: currentUser.id,
        adminName: currentUser.full_name,
        memberCount: 1,
        contestCount: 0,
        isActive: true,
        settings: {
          allowPublicJoin: false,
          requireApproval: false,
          maxMembers: 1000
        }
      };

      const createdCommunity = await Community.create(newCommunity);

      // Add creator as admin member
      await CommunityMember.create({
        communityId: createdCommunity.id,
        userId: currentUser.id,
        userName: currentUser.full_name,
        userEmail: currentUser.email,
        role: 'admin',
        joinDate: new Date().toISOString().split('T')[0]
      });

      alert(`Community "${communityForm.name}" created successfully!\nInvite Code: ${communityForm.inviteCode}\nPassword: ${communityForm.joinPassword}`);
      setCreateModalOpen(false);
      setCommunityForm({
        name: '',
        description: '',
        inviteCode: '',
        joinPassword: '',
        emailDomain: '',
        type: 'club'
      });
      loadCommunities();
      loadJoinedCommunities(currentUser.id);
    } catch (error) {
      console.error("Error creating community:", error);
      alert('Error creating community. Please try again.');
    }
  };

  const getCommunityTypeIcon = (type) => {
    const typeObj = communityTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : "🌟";
  };

  const getCommunityTypeColor = (type) => {
    const colors = {
      university: "from-blue-500 to-indigo-500",
      school: "from-green-500 to-emerald-500",
      company: "from-purple-500 to-pink-500",
      club: "from-orange-500 to-red-500",
      bootcamp: "from-cyan-500 to-blue-500",
      other: "from-slate-500 to-gray-500"
    };
    return colors[type] || colors.other;
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {mode === 'personal' ? 'Communities' : 'Community Management'}
              </h1>
              <p className="text-lg text-slate-600">
                {mode === 'personal'
                  ? "Join communities to access exclusive contests and challenges."
                  : "Create and manage communities for your institution."
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              {mode === 'personal' && (
                <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Join Community
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Join a Community</DialogTitle>
                    </DialogHeader>
                    
                    <Tabs value={joinMethod} onValueChange={setJoinMethod} className="w-full mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="invite" className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Invite Code
                        </TabsTrigger>
                        <TabsTrigger value="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Domain
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="invite" className="space-y-4 mt-6">
                        <form onSubmit={handleJoinCommunity}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="inviteCode">Invite Code</Label>
                              <Input
                                id="inviteCode"
                                placeholder="e.g., TECHUNIV24"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="joinPassword">Community Password</Label>
                              <Input
                                id="joinPassword"
                                type="password"
                                placeholder="Enter the community password"
                                value={joinPassword}
                                onChange={(e) => setJoinPassword(e.target.value)}
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <Button type="button" variant="outline" onClick={() => setJoinModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                Join Community
                              </Button>
                            </div>
                          </div>
                        </form>
                      </TabsContent>

                      <TabsContent value="email" className="space-y-4 mt-6">
                        <form onSubmit={handleJoinCommunity}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Institutional Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your.email@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <p className="text-xs text-slate-500">
                                Use your institutional email to join automatically
                              </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <Button type="button" variant="outline" onClick={() => setJoinModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                Verify & Join
                              </Button>
                            </div>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}

              {mode === 'community' && (
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Community
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Community</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateCommunity} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Community Name *</Label>
                          <Input
                            id="name"
                            value={communityForm.name}
                            onChange={(e) => setCommunityForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Tech University CS"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Select value={communityForm.type} onValueChange={(value) => setCommunityForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {communityTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.icon} {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={communityForm.description}
                          onChange={(e) => setCommunityForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your community..."
                          className="h-20 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inviteCode">Invite Code *</Label>
                          <Input
                            id="inviteCode"
                            value={communityForm.inviteCode}
                            onChange={(e) => setCommunityForm(prev => ({ ...prev, inviteCode: e.target.value }))}
                            placeholder="TECHUNIV24"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joinPassword">Join Password *</Label>
                          <Input
                            id="joinPassword"
                            type="password"
                            value={communityForm.joinPassword}
                            onChange={(e) => setCommunityForm(prev => ({ ...prev, joinPassword: e.target.value }))}
                            placeholder="Secure password"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailDomain">Email Domain (Optional)</Label>
                        <Input
                          id="emailDomain"
                          value={communityForm.emailDomain}
                          onChange={(e) => setCommunityForm(prev => ({ ...prev, emailDomain: e.target.value }))}
                          placeholder="@university.edu"
                        />
                        <p className="text-xs text-slate-500">
                          Allow automatic joining for users with this email domain
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
                          Create Community
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Joined Communities Section (Personal Mode Only) */}
        {mode === 'personal' && joinedCommunities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCommunities.map(community => (
                <Card key={community.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCommunityTypeColor(community.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-2xl`}>
                        {getCommunityTypeIcon(community.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          {community.name}
                        </CardTitle>
                        <p className="text-sm text-slate-500">{community.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Members:</span>
                        <span className="font-medium text-blue-600">{community.memberCount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Contests:</span>
                        <span className="font-medium text-amber-600">{community.contestCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={createPageUrl("CommunityTasks")} className="flex-1">
                        <Button variant="outline" className="w-full text-xs">
                          View Tasks
                        </Button>
                      </Link>
                      <Link to={createPageUrl("Leaderboard")} className="flex-1">
                        <Button variant="outline" className="w-full text-xs">
                          Leaderboard
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Communities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {mode === 'personal' ? 'Available Communities' : 'All Communities'}
          </h2>
          
          {filteredCommunities.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No communities found</h3>
              <p className="text-slate-600 mb-6">
                {mode === 'community' 
                  ? "Create your first community to get started"
                  : "No communities match your search"
                }
              </p>
              {mode === 'community' && (
                <Button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Community
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getCommunityTypeColor(community.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-2xl`}>
                            {getCommunityTypeIcon(community.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                              {community.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs mb-2">
                              {communityTypes.find(t => t.value === community.type)?.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {community.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4" />
                          {community.memberCount || 0} members
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Target className="w-4 h-4" />
                          {community.contestCount || 0} contests
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Globe className="w-4 h-4" />
                          Admin: {community.adminName}
                        </div>
                        {community.emailDomain && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            Domain: {community.emailDomain}
                          </div>
                        )}
                      </div>

                      {mode === 'personal' && (
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          onClick={() => setJoinModalOpen(true)}
                        >
                          Request to Join
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}

                      {mode === 'community' && currentUser?.id === community.adminId && (
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Manage
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}