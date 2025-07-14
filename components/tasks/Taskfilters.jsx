import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";

const categories = ["All", "DSA", "UI/UX", "Reading", "Coding", "Learning", "Project", "Other"];
const statuses = ["All", "todo", "in_progress", "done"];
const priorities = ["All", "low", "medium", "high"];

export default function TaskFilters({ 
  filters, 
  onFilterChange, 
  taskCounts,
  searchTerm,
  onSearchChange 
}) {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ category: "All", status: "All", priority: "All" });
    onSearchChange("");
  };

  const hasActiveFilters = filters.category !== "All" || 
                          filters.status !== "All" || 
                          filters.priority !== "All" || 
                          searchTerm;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="font-medium text-slate-900">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === "All" ? "All" : status.replace('_', ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority}>
                {priority === "All" ? "All" : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Count Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-slate-50">
          Total: {taskCounts.total}
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          To Do: {taskCounts.todo}
        </Badge>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          In Progress: {taskCounts.in_progress}
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Done: {taskCounts.done}
        </Badge>
      </div>
    </div>
  );
}