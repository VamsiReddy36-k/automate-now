import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "running" | "completed" | "failed";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending",
      className: "bg-status-pending/20 text-status-pending border-status-pending/30",
    },
    running: {
      label: "Running",
      className: "bg-status-running/20 text-status-running border-status-running/30",
    },
    completed: {
      label: "Completed",
      className: "bg-status-completed/20 text-status-completed border-status-completed/30",
    },
    failed: {
      label: "Failed",
      className: "bg-status-failed/20 text-status-failed border-status-failed/30",
    },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {status === "running" && (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      )}
      {label}
    </Badge>
  );
}
