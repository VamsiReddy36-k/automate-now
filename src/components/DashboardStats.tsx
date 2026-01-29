import { Job } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, CheckCircle2, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
  jobs: Job[];
}

export function DashboardStats({ jobs }: DashboardStatsProps) {
  const stats = {
    pending: jobs.filter((j) => j.status === "pending").length,
    running: jobs.filter((j) => j.status === "running").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  const statCards = [
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      colorClass: "text-status-pending",
      bgClass: "bg-status-pending/10",
    },
    {
      label: "Running",
      value: stats.running,
      icon: Play,
      colorClass: "text-status-running",
      bgClass: "bg-status-running/10",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      colorClass: "text-status-completed",
      bgClass: "bg-status-completed/10",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      colorClass: "text-status-failed",
      bgClass: "bg-status-failed/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.colorClass}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgClass}`}>
                <stat.icon className={`h-6 w-6 ${stat.colorClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
