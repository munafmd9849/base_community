import React, { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  Plus, 
  Github, 
  ExternalLink, 
  Star,
  GitBranch,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  planning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  deployed: "bg-purple-100 text-purple-800 border-purple-200"
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_url: "",
    live_url: "",
    tags: [],
    status: "planning",
    featured: false
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const fetchedProjects = await Project.list("-created_date");
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await Project.update(editingProject.id, formData);
      } else {
        await Project.create(formData);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      tags: project.tags || [],
      status: project.status || "planning",
      featured: project.featured || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    try {
      await Project.delete(projectId);
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      github_url: "",
      live_url: "",
      tags: [],
      status: "planning",
      featured: false
    });
    setNewTag("");
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    if (filter === "featured") return project.featured;
    return project.status === filter;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-lg"></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Project Showcase</h1>
                <p className="text-slate-600">Build, deploy, and showcase your projects</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm();
                      setEditingProject(null);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="My Awesome Project"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your project..."
                        className="min-h-[100px] resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          value={formData.github_url}
                          onChange={(e) => handleInputChange('github_url', e.target.value)}
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="live_url">Live Demo URL</Label>
                        <Input
                          id="live_url"
                          value={formData.live_url}
                          onChange={(e) => handleInputChange('live_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="deployed">Deployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Technologies/Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag} size="icon" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="featured">Featured Project</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {editingProject ? 'Update Project' : 'Add Project'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
                <p className="text-slate-600 mb-6">
                  {projects.length === 0 
                    ? "Start building your portfolio by adding your first project"
                    : "No projects match your current filter"
                  }
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                    {project.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                            {project.title}
                          </CardTitle>
                          <Badge variant="outline" className={statusColors[project.status]}>
                            {project.status.replace('_', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-auto">
                        {project.github_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="flex-1"
                          >
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="flex-1"
                          >
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}