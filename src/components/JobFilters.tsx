import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface JobFiltersProps {
  status: string;
  priority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function JobFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: JobFiltersProps) {
  const hasFilters = status || priority;

  const clearFilters = () => {
    onStatusChange("");
    onPriorityChange("");
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 text-primary">
        <Filter className="h-4 w-4" />
        <span className="font-semibold">Filters</span>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-pending" />
                Pending
              </span>
            </SelectItem>
            <SelectItem value="running">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-running animate-pulse" />
                Running
              </span>
            </SelectItem>
            <SelectItem value="completed">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-completed" />
                Completed
              </span>
            </SelectItem>
            <SelectItem value="failed">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-failed" />
                Failed
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-priority-low" />
                Low
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-priority-medium" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-priority-high" />
                High
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
