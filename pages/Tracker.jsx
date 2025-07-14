import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import TaskModal from "../components/tasks/TaskModal";
import TaskCard from "../components/tasks/TaskCard";
import TaskFilters from "../components/tasks/TaskFilters";

export default function Tracker() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    priority: "All"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters, searchTerm]);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await Task.list("-created_date");
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category !== "All") {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== "All") {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== "All") {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await Task.create(taskData);
      loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await Task.update(editingTask.id, taskData);
      loadTasks();
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await Task.delete(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await Task.update(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length
    };
  };

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-lg"></div>
            <div className="h-24 bg-white rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-lg"></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Task Tracker</h1>
                <p className="text-slate-600">Organize and track your learning journey</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
                <div className="text-sm text-slate-600">Complete</div>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskFilters
            filters={filters}
            onFilterChange={setFilters}
            taskCounts={getTaskCounts()}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </motion.div>

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
              </h3>
              <p className="text-slate-600 mb-6">
                {tasks.length === 0 
                  ? "Start by creating your first task to track your progress"
                  : "Try adjusting your filters or search term"
                }
              </p>
              {tasks.length === 0 && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={editingTask}
          onSave={editingTask ? handleEditTask : handleCreateTask}
        />
      </div>
    </div>
  );
}