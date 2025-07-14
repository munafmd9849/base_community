import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({ 
  platform, 
  icon: Icon, 
  stats, 
  isLoading, 
  onSync, 
  color,
  lastSync 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {platform}
                </CardTitle>
                {lastSync && (
                  <p className="text-xs text-slate-500">
                    Updated {lastSync}
                  </p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSync}
              disabled={isLoading}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${color.replace('from-', 'from-').replace('to-', 'to-')} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Progress indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">This Month</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">+12%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                    style={{ width: '68%' }}
                  />
                </div>
              </div>

              {/* Achievements */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-slate-600">Recent Achievement</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Streak: 7 days
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}