import React, { useState, useEffect } from "react". ;
import { CommunityTask } from "@/entities/CommunityTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Plus, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

const platforms = ["LeetCode", "GitHub", "GFG", "HackerRank", "Project", "Other"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function AdminPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "LeetCode",
    link: "",
    deadline: "",
    difficulty: "Medium",
    points: 10
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const fetchedTasks = await CommunityTask.list("-created_date");
    setTasks(fetchedTasks);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      platform: "LeetCode",
      link: "",
      deadline: "",
      difficulty: "Medium",
      points: 10
    });
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      await CommunityTask.update(editingTask.id, formData);
    } else {
      await CommunityTask.create(formData);
    }
    resetForm();
    loadTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      platform: task.platform,
      link: task.link || "",
      deadline: task.deadline ? task.deadline.split('T')[0] : "",
      difficulty: task.difficulty,
      points: task.points
    });
  };

  const handleDelete = async (taskId) => {
    await CommunityTask.delete(taskId);
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-600">Manage community tasks</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>{editingTask ? 'Edit Task' : 'Create Community Task'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={value => handleInputChange('platform', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="link">Link</Label>
                    <Input id="link" value={formData.link} onChange={e => handleInputChange('link', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" value={formData.deadline} onChange={e => handleInputChange('deadline', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={value => handleInputChange('difficulty', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Points *</Label>
                      <Input id="points" type="number" value={formData.points} onChange={e => handleInputChange('points', parseInt(e.target.value, 10))} required />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                    {editingTask && <Button type="button" variant="ghost" onClick={resetForm}>Cancel Edit</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Existing Tasks</CardTitle>
                <CardDescription>A list of all created community tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-slate-500">{task.platform} - {task.points} pts</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
