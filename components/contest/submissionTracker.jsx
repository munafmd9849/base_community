import React, { useState } from "react";
import { Submission } from "@/entities/Submission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Code,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const verdicts = ["AC", "WA", "TLE", "RE", "CE", "PE", "OLE"];
const languages = ["C++", "Python", "Java", "JavaScript", "C", "Go", "Rust", "Other"];

export default function SubmissionTracker({ submissions, members, classes, onRefresh, filters, onFiltersChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [viewingCode, setViewingCode] = useState(null);
  
  const [formData, setFormData] = useState({
    classId: "",
    memberId: "",
    memberUsername: "",
    problemName: "",
    problemLink: "",
    verdict: "AC",
    language: "C++",
    codeSubmitted: "",
    submissionTime: "",
    attempts: 1,
    timeTaken: 0,
    score: 0,
    platform: "LeetCode"
  });

  const resetForm = () => {
    setFormData({
      classId: "",
      memberId: "",
      memberUsername: "",
      problemName: "",
      problemLink: "",
      verdict: "AC",
      language: "C++",
      codeSubmitted: "",
      submissionTime: new Date().toISOString().slice(0, 16),
      attempts: 1,
      timeTaken: 0,
      score: 0,
      platform: "LeetCode"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find member username if memberId is provided
      if (formData.memberId && !formData.memberUsername) {
        const member = members.find(m => m.id === formData.memberId);
        formData.memberUsername = member?.username || "";
      }

      if (editingSubmission) {
        await Submission.update(editingSubmission.id, formData);
      } else {
        await Submission.create(formData);
      }
      setIsModalOpen(false);
      setEditingSubmission(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
    setFormData({ ...submission });
    setIsModalOpen(true);
  };

  const handleDelete = async (submissionId) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await Submission.delete(submissionId);
        onRefresh();
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };

  const viewCode = (submission) => {
    setViewingCode(submission);
    setIsCodeModalOpen(true);
  };

  const getVerdictIcon = (verdict) => {
    const icons = {
      AC: <CheckCircle className="w-4 h-4 text-green-500" />,
      WA: <XCircle className="w-4 h-4 text-red-500" />,
      TLE: <Clock className="w-4 h-4 text-orange-500" />,
      RE: <AlertCircle className="w-4 h-4 text-red-500" />,
      CE: <Code className="w-4 h-4 text-yellow-500" />,
      PE: <AlertCircle className="w-4 h-4 text-blue-500" />,
      OLE: <AlertCircle className="w-4 h-4 text-purple-500" />
    };
    return icons[verdict] || <Code className="w-4 h-4 text-gray-500" />;
  };

  const getVerdictColor = (verdict) => {
    const colors = {
      AC: "bg-green-100 text-green-800",
      WA: "bg-red-100 text-red-800",
      TLE: "bg-orange-100 text-orange-800",
      RE: "bg-red-100 text-red-800",
      CE: "bg-yellow-100 text-yellow-800",
      PE: "bg-blue-100 text-blue-800",
      OLE: "bg-purple-100 text-purple-800"
    };
    return colors[verdict] || "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      LeetCode: "🟠",
      GFG: "🟢",
      Codeforces: "🔵",
      HackerRank: "🟩",
      Other: "📝"
    };
    return icons[platform] || "📝";
  };

  const filteredSubmissions = submissions.filter(submission => {
    const searchMatch = !filters.search || 
      submission.problemName.toLowerCase().includes(filters.search.toLowerCase()) ||
      submission.memberUsername.toLowerCase().includes(filters.search.toLowerCase());
    
    const memberMatch = filters.member === "all" || submission.memberId === filters.member;
    const platformMatch = filters.platform === "all" || submission.platform === filters.platform;
    
    return searchMatch && memberMatch && platformMatch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search problems, members..."
                value={filters.search}
                onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
                className="pl-9"
              />
            </div>
            <Select value={filters.member} onValueChange={(value) => onFiltersChange({...filters, member: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.platform} onValueChange={(value) => onFiltersChange({...filters, platform: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="LeetCode">LeetCode</SelectItem>
                <SelectItem value="GFG">GeeksforGeeks</SelectItem>
                <SelectItem value="Codeforces">Codeforces</SelectItem>
                <SelectItem value="HackerRank">HackerRank</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Submission
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingSubmission ? 'Edit Submission' : 'Add New Submission'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="classId">Class *</Label>
                      <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(cls => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.className}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Member *</Label>
                      <Select value={formData.memberId} onValueChange={(value) => {
                        const member = members.find(m => m.id === value);
                        setFormData({...formData, memberId: value, memberUsername: member?.username || ""});
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map(member => (
                            <SelectItem key={member.id} value={member.id}>{member.name} (@{member.username})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="problemName">Problem Name *</Label>
                      <Input
                        id="problemName"
                        value={formData.problemName}
                        onChange={(e) => setFormData({...formData, problemName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problemLink">Problem Link</Label>
                      <Input
                        id="problemLink"
                        value={formData.problemLink}
                        onChange={(e) => setFormData({...formData, problemLink: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="verdict">Verdict *</Label>
                      <Select value={formData.verdict} onValueChange={(value) => setFormData({...formData, verdict: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {verdicts.map(verdict => (
                            <SelectItem key={verdict} value={verdict}>{verdict}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LeetCode">LeetCode</SelectItem>
                          <SelectItem value="GFG">GeeksforGeeks</SelectItem>
                          <SelectItem value="Codeforces">Codeforces</SelectItem>
                          <SelectItem value="HackerRank">HackerRank</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="submissionTime">Submission Time *</Label>
                      <Input
                        id="submissionTime"
                        type="datetime-local"
                        value={formData.submissionTime}
                        onChange={(e) => setFormData({...formData, submissionTime: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attempts">Attempts</Label>
                      <Input
                        id="attempts"
                        type="number"
                        min="1"
                        value={formData.attempts}
                        onChange={(e) => setFormData({...formData, attempts: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        value={formData.score}
                        onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeSubmitted">Code Submitted</Label>
                    <Textarea
                      id="codeSubmitted"
                      value={formData.codeSubmitted}
                      onChange={(e) => setFormData({...formData, codeSubmitted: e.target.value})}
                      placeholder="Paste your code here..."
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSubmission ? 'Update Submission' : 'Add Submission'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Code className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions found</h3>
              <p className="text-slate-600 mb-4">Add your first submission to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const member = members.find(m => m.id === submission.memberId);
                    return (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {member && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.profileImage} alt={member.name} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div className="font-medium text-sm">{member?.name || submission.memberUsername}</div>
                              <div className="text-xs text-slate-500">@{submission.memberUsername}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{getPlatformIcon(submission.platform)}</span>
                              <span className="font-medium">{submission.problemName}</span>
                            </div>
                            {submission.problemLink && (
                              <a 
                                href={submission.problemLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Problem
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getVerdictColor(submission.verdict)}>
                            <div className="flex items-center gap-1">
                              {getVerdictIcon(submission.verdict)}
                              {submission.verdict}
                            </div>
                          </Badge>
                          {submission.attempts > 1 && (
                            <div className="text-xs text-slate-500 mt-1">
                              Attempt #{submission.attempts}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {submission.language}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(submission.submissionTime), 'MMM d, HH:mm')}
                          </div>
                          {submission.score > 0 && (
                            <div className="text-xs text-green-600">
                              +{submission.score} pts
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {submission.codeSubmitted && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => viewCode(submission)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(submission)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(submission.id)}
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

      {/* Code View Modal */}
      <Dialog open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Code Submission - {viewingCode?.problemName}
            </DialogTitle>
          </DialogHeader>
          {viewingCode && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <Badge className={getVerdictColor(viewingCode.verdict)}>
                  {viewingCode.verdict}
                </Badge>
                <span>{viewingCode.language}</span>
                <span>{format(new Date(viewingCode.submissionTime), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  <code>{viewingCode.codeSubmitted}</code>
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}