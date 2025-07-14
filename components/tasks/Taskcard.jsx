import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Clock,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200"
};

const statusColors = {
  todo: "bg-slate-100 text-slate-800 border-slate-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-green-100 text-green-800 border-green-200"
};

const categoryColors = {
  DSA: "bg-purple-100 text-purple-800 border-purple-200",
  "UI/UX": "bg-pink-100 text-pink-800 border-pink-200",
  Reading: "bg-amber-100 text-amber-800 border-amber-200",
  Coding: "bg-blue-100 text-blue-800 border-blue-200",
  Learning: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Project: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const handleStatusToggle = (checked) => {
    const newStatus = checked ? 'done' : 'todo';
    onStatusChange(task.id, newStatus);
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="group"
    >
      <Card className={`transition-all duration-200 hover:shadow-md ${
        task.status === 'done' ? 'opacity-75' : ''
      } ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.status === 'done'}
              onCheckedChange={handleStatusToggle}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`font-medium text-sm ${
                  task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-900'
                }`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => onEdit(task)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-500 hover:text-red-700"
                    onClick={() => onDelete(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className={categoryColors[task.category]}>
                  {task.category}
                </Badge>
                
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                
                <Badge variant="outline" className={statusColors[task.status]}>
                  {task.status === 'in_progress' ? (
                    <Clock className="w-3 h-3 mr-1" />
                  ) : task.status === 'done' ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : null}
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {task.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {isOverdue ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <Calendar className="w-3 h-3" />
                  )}
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                  {isOverdue && <span className="font-medium">Overdue</span>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}