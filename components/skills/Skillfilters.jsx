import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search, X, SortAsc } from "lucide-react";

const categories = ["all", "Technical", "Soft Skill", "Language", "Creative", "Business", "Other"];
const proficiencyLevels = ["all", "beginner", "intermediate", "expert"];
const sortOptions = [
  { value: "updated", label: "Recently Updated" },
  { value: "proficiency", label: "Proficiency (High to Low)" },
  { value: "alphabetical", label: "Alphabetical" }
];

export default function SkillFilters({ 
  filters, 
  onFilterChange, 
  skillCounts 
}) {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ 
      search: "", 
      category: "all", 
      proficiency: "all", 
      sortBy: "updated" 
    });
  };

  const hasActiveFilters = filters.category !== "all" || 
                          filters.proficiency !== "all" || 
                          filters.search;

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-medium text-slate-900">Filters & Search</span>
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
              placeholder="Search skills, tags, or category..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
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
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.proficiency} onValueChange={(value) => handleFilterChange('proficiency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Proficiency" />
            </SelectTrigger>
            <SelectContent>
              {proficiencyLevels.map(level => (
                <SelectItem key={level} value={level}>
                  {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger>
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-slate-50">
            Total: {skillCounts.total}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Technical: {skillCounts.technical}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Soft Skills: {skillCounts.softSkill}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Beginner: {skillCounts.beginner}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Intermediate: {skillCounts.intermediate}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Expert: {skillCounts.expert}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}