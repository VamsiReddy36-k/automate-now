import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    low: {
      label: "Low",
      className: "bg-priority-low/20 text-priority-low border-priority-low/30",
    },
    medium: {
      label: "Medium",
      className: "bg-priority-medium/20 text-priority-medium border-priority-medium/30",
    },
    high: {
      label: "High",
      className: "bg-priority-high/20 text-priority-high border-priority-high/30",
    },
  };

  const { label, className } = config[priority];

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
