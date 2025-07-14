import React, { useState } from "react";
import { ClassContest } from "@/entities/ClassContest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Clock,
  FileText,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const platforms = ["LeetCode", "GFG", "Codeforces", "HackerRank", "Other"];
const categories = ["Easy", "Medium", "Hard", "DP", "Greedy", "Graph", "Array", "String", "Tree", "Other"];

export default function ClassContestTable({ classes, onRefresh, filters, onFiltersChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    className: "",
    contentCovered: "",
    problems: [],
    classNotes: "",
    instructorName: "",
    duration: 60,
    isContest: false,
    contestEndTime: ""
  });

  const [newProblem, setNewProblem] = useState({
    problemName: "",
    problemLink: "",
    platform: "LeetCode",
    category: "Medium",
    tags: []
  });

  const resetForm = () => {
    setFormData({
      date: "",
      className: "",
      contentCovered: "",
      problems: [],
      classNotes: "",
      instructorName: "",
      duration: 60,
      isContest: false,
      contestEndTime: ""
    });
    setNewProblem({
      problemName: "",
      problemLink: "",
      platform: "LeetCode",
      category: "Medium",
      tags: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await ClassContest.update(editingClass.id, formData);
      } else {
        await ClassContest.create(formData);
      }
      setIsModalOpen(false);
      setEditingClass(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({ ...classItem });
    setIsModalOpen(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await ClassContest.delete(classId);
        onRefresh();
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const addProblem = () => {
    if (newProblem.problemName && newProblem.problemLink) {
      setFormData(prev => ({
        ...prev,
        problems: [...prev.problems, { ...newProblem }]
      }));
      setNewProblem({
        problemName: "",
        problemLink: "",
        platform: "LeetCode",
        category: "Medium",
        tags: []
      });
    }
  };

  const removeProblem = (index) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
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

  const getCategoryColor = (category) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800", 
      Hard: "bg-red-100 text-red-800",
      DP: "bg-purple-100 text-purple-800",
      Greedy: "bg-blue-100 text-blue-800",
      Graph: "bg-indigo-100 text-indigo-800",
      Array: "bg-pink-100 text-pink-800",
      String: "bg-cyan-100 text-cyan-800",
      Tree: "bg-emerald-100 text-emerald-800",
      Other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.Other;
  };

  const filteredClasses = classes.filter(cls => {
    const searchMatch = !filters.search || 
      cls.className.toLowerCase().includes(filters.search.toLowerCase()) ||
      cls.contentCovered.toLowerCase().includes(filters.search.toLowerCase()) ||
      cls.problems?.some(p => p.problemName.toLowerCase().includes(filters.search.toLowerCase()));
    
    const platformMatch = filters.platform === "all" || 
      cls.problems?.some(p => p.platform === filters.platform);
    
    const categoryMatch = filters.category === "all" ||
      cls.problems?.some(p => p.category === filters.category);

    return searchMatch && platformMatch && categoryMatch;
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
                placeholder="Search classes, problems..."
                value={filters.search}
                onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
                className="pl-9"
              />
            </div>
            <Select value={filters.platform} onValueChange={(value) => onFiltersChange({...filters, platform: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(value) => onFiltersChange({...filters, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name *</Label>
                      <Input
                        id="className"
                        value={formData.className}
                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                        placeholder="e.g., Class 27 - Greedy & Sorting"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentCovered">Content Covered *</Label>
                    <Textarea
                      id="contentCovered"
                      value={formData.contentCovered}
                      onChange={(e) => setFormData({...formData, contentCovered: e.target.value})}
                      placeholder="Topics taught or discussed in this class"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instructorName">Instructor Name</Label>
                      <Input
                        id="instructorName"
                        value={formData.instructorName}
                        onChange={(e) => setFormData({...formData, instructorName: e.target.value})}
                        placeholder="Name of the instructor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Problems Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Problems</h3>
                    
                    {/* Add New Problem */}
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          placeholder="Problem Name"
                          value={newProblem.problemName}
                          onChange={(e) => setNewProblem({...newProblem, problemName: e.target.value})}
                        />
                        <Input
                          placeholder="Problem Link"
                          value={newProblem.problemLink}
                          onChange={(e) => setNewProblem({...newProblem, problemLink: e.target.value})}
                        />
                        <Select value={newProblem.platform} onValueChange={(value) => setNewProblem({...newProblem, platform: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map(platform => (
                              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={newProblem.category} onValueChange={(value) => setNewProblem({...newProblem, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" onClick={addProblem} size="sm">
                        Add Problem
                      </Button>
                    </div>

                    {/* Problems List */}
                    {formData.problems.length > 0 && (
                      <div className="space-y-2">
                        {formData.problems.map((problem, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            <span className="text-lg">{getPlatformIcon(problem.platform)}</span>
                            <div className="flex-1">
                              <div className="font-medium">{problem.problemName}</div>
                              <div className="text-sm text-slate-600">
                                <Badge className={getCategoryColor(problem.category)}>
                                  {problem.category}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeProblem(index)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classNotes">Class Notes</Label>
                    <Textarea
                      id="classNotes"
                      value={formData.classNotes}
                      onChange={(e) => setFormData({...formData, classNotes: e.target.value})}
                      placeholder="Additional notes or file URLs"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingClass ? 'Update Class' : 'Create Class'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Classes & Contests ({filteredClasses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No classes found</h3>
              <p className="text-slate-600 mb-4">Create your first class to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Content Covered</TableHead>
                    <TableHead>Problems</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {format(new Date(classItem.date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{classItem.className}</div>
                        {classItem.isContest && (
                          <Badge className="bg-orange-100 text-orange-800 mt-1">Contest</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={classItem.contentCovered}>
                          {classItem.contentCovered}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {classItem.problems?.slice(0, 2).map((problem, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span>{getPlatformIcon(problem.platform)}</span>
                              <a 
                                href={problem.problemLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate max-w-[150px]"
                              >
                                {problem.problemName}
                              </a>
                              <Badge className={getCategoryColor(problem.category)} size="sm">
                                {problem.category}
                              </Badge>
                            </div>
                          ))}
                          {classItem.problems?.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{classItem.problems.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{classItem.instructorName || "—"}</div>
                        {classItem.duration && (
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {classItem.duration}m
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(classItem)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(classItem.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}