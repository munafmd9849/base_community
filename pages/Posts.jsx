import React, { useState, useEffect } from "react";
import { Post } from "@/entities/Post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PenTool, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const postTypes = ["update", "achievement", "learning", "reflection"];

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    type: "update"
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const fetchedPosts = await Post.list("-created_date");
    setPosts(fetchedPosts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPost) {
      await Post.update(editingPost.id, formData);
    } else {
      await Post.create(formData);
    }
    setIsModalOpen(false);
    setEditingPost(null);
    resetForm();
    loadPosts();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      type: post.type
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (postId) => {
    await Post.delete(postId);
    loadPosts();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: [],
      type: "update"
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "achievement": return "bg-green-100 text-green-800 border-green-200";
      case "learning": return "bg-blue-100 text-blue-800 border-blue-200";
      case "reflection": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
                <p className="text-slate-600">Share your progress and reflections</p>
              </div>
            </div>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm();
                    setEditingPost(null);
                  }}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="What's your update?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Share your thoughts, achievements, or learnings..."
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Post Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {postTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
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
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      {editingPost ? 'Update Post' : 'Publish Post'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-600 mb-6">
                  Start sharing your learning journey with your first post
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getTypeColor(post.type)}>
                              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
                            </div>
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {post.title}
                          </CardTitle>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {post.content}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
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