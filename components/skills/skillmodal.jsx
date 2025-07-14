import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { UploadFile } from "@/integrations/Core";

const categories = ["Technical", "Soft Skill", "Language", "Creative", "Business", "Other"];
const commonIcons = ["🏆", "⚡", "🎯", "💻", "🎨", "💡", "🚀", "⭐", "🔥", "💎", "🌟", "🎭"];

export default function SkillModal({ isOpen, onClose, skill, onSave }) {
  const [formData, setFormData] = useState({
    skillName: "",
    category: "Technical",
    proficiency: 50,
    tags: [],
    badgeIcon: "🏆",
    projectLink: "",
    certificateUrl: "",
    description: "",
    isPublic: true
  });
  
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        skillName: skill.skillName || "",
        category: skill.category || "Technical",
        proficiency: skill.proficiency || 50,
        tags: skill.tags || [],
        badgeIcon: skill.badgeIcon || "🏆",
        projectLink: skill.projectLink || "",
        certificateUrl: skill.certificateUrl || "",
        description: skill.description || "",
        isPublic: skill.isPublic !== undefined ? skill.isPublic : true
      });
    } else {
      setFormData({
        skillName: "",
        category: "Technical",
        proficiency: 50,
        tags: [],
        badgeIcon: "🏆",
        projectLink: "",
        certificateUrl: "",
        description: "",
        isPublic: true
      });
    }
  }, [skill, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData(prev => ({ ...prev, certificateUrl: result.file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.skillName.trim()) {
      onSave(formData);
    }
  };

  const getProficiencyLabel = (value) => {
    if (value <= 40) return "Beginner";
    if (value <= 70) return "Intermediate";
    return "Expert";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name *</Label>
              <Input
                id="skillName"
                value={formData.skillName}
                onChange={(e) => handleInputChange('skillName', e.target.value)}
                placeholder="e.g., React, Python, Leadership"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your experience and expertise with this skill..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <Label>Proficiency Level: {formData.proficiency}% - {getProficiencyLabel(formData.proficiency)}</Label>
            <div className="px-2">
              <Slider
                value={[formData.proficiency]}
                onValueChange={(value) => handleInputChange('proficiency', value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Badge Icon</Label>
            <div className="flex flex-wrap gap-2">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('badgeIcon', icon)}
                  className={`text-2xl p-2 rounded-lg border transition-all ${
                    formData.badgeIcon === icon 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <Input
              value={formData.badgeIcon}
              onChange={(e) => handleInputChange('badgeIcon', e.target.value)}
              placeholder="Or enter custom emoji/icon"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectLink">Project Link</Label>
              <Input
                id="projectLink"
                value={formData.projectLink}
                onChange={(e) => handleInputChange('projectLink', e.target.value)}
                placeholder="GitHub, Portfolio, etc."
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate">Certificate</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.certificateUrl}
                  onChange={(e) => handleInputChange('certificateUrl', e.target.value)}
                  placeholder="Certificate URL"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('certificate-upload').click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
            />
            <Label htmlFor="isPublic">Show on public profile</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isUploading}
            >
              {skill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}