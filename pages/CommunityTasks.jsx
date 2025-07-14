import React, { useState, useEffect } from "react";
import { CommunityTask } from "@/entities/CommunityTask";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function CommunityTasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ completed_tasks: [] }); // Mock user

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedTasks = await CommunityTask.list("-created_date");
    setTasks(fetchedTasks);
    // In a real app, you'd fetch the current user
    // const currentUser = await User.me();
    // setUser(currentUser);
  };

  const handleMarkComplete = (taskId) => {
    // This is a simulation. In a real app, this would be a more complex verification flow.
    if (!user.completed_tasks.includes(taskId)) {
      const updatedCompletedTasks = [...user.completed_tasks, taskId];
      setUser(prev => ({ ...prev, completed_tasks: updatedCompletedTasks }));
      // await User.updateMyUserData({ completed_tasks: updatedCompletedTasks });
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "bg-green-100 text-green-800";
    if (difficulty === "Medium") return "bg-yellow-100 text-yellow-800";
    if (difficulty === "Hard") return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-800";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Community Tasks</h1>
          <p className="text-lg text-slate-600">Complete tasks to earn points and boost your credibility.</p>
        </motion.div>

        <div className="space-y-6">
          {tasks.map((task, index) => {
            const isCompleted = user.completed_tasks.includes(task.id);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 ${isCompleted ? 'bg-green-50' : 'bg-white'}`}>
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty}</Badge>
                        <Badge variant="secondary">{task.platform}</Badge>
                        <Badge variant="outline">{task.points} Points</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{task.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                      {task.deadline &&
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="w-4 h-4 mr-2"/>
                          Deadline: {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                        </div>
                      }
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      {task.link && 
                        <Button variant="outline" asChild>
                          <a href={task.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Task
                          </a>
                        </Button>
                      }
                      <Button onClick={() => handleMarkComplete(task.id)} disabled={isCompleted} className={isCompleted ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isCompleted ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}