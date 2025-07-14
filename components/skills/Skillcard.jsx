import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  FileText,
  Star,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const categoryColors = {
  Technical: "bg-blue-100 text-blue-800 border-blue-200",
  "Soft Skill": "bg-green-100 text-green-800 border-green-200",
  Language: "bg-purple-100 text-purple-800 border-purple-200",
  Creative: "bg-pink-100 text-pink-800 border-pink-200",
  Business: "bg-amber-100 text-amber-800 border-amber-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200"
};

const getProficiencyLevel = (proficiency) => {
  if (proficiency <= 40) return { label: "Beginner", color: "text-orange-600" };
  if (proficiency <= 70) return { label: "Intermediate", color: "text-blue-600" };
  return { label: "Expert", color: "text-green-600" };
};

const getProficiencyColor = (proficiency) => {
  if (proficiency <= 40) return "bg-orange-500";
  if (proficiency <= 70) return "bg-blue-500";
  return "bg-green-500";
};

export default function SkillCard({ skill, onEdit, onDelete }) {
  const proficiencyLevel = getProficiencyLevel(skill.proficiency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="group"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{skill.badgeIcon}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                  {skill.skillName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={categoryColors[skill.category]}>
                    {skill.category}
                  </Badge>
                  <span className={`text-sm font-medium ${proficiencyLevel.color}`}>
                    {proficiencyLevel.label}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(skill)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => onDelete(skill.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Proficiency</span>
              <span className="text-sm font-bold text-slate-900">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProficiencyColor(skill.proficiency)}`}
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {skill.description && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {skill.description}
            </p>
          )}

          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {skill.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{skill.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Links and Certificate */}
          <div className="flex items-center gap-2">
            {skill.projectLink && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                asChild
              >
                <a href={skill.projectLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Project
                </a>
              </Button>
            )}
            {skill.certificateUrl && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                asChild
              >
                <a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-3 h-3 mr-1" />
                  Certificate
                </a>
              </Button>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Calendar className="w-3 h-3" />
            <span>
              Updated {formatDistanceToNow(new Date(skill.updated_date), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}