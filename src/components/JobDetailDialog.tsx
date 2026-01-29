import { Job } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, Webhook, FileJson } from "lucide-react";

interface JobDetailDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailDialog({ job, open, onOpenChange }: JobDetailDialogProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-primary">
            {job.task_name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-3">
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {format(new Date(job.created_at), "MMM d, yyyy HH:mm:ss")}
              </span>
            </div>
            {job.completed_at && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-status-completed" />
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium">
                  {format(new Date(job.completed_at), "MMM d, yyyy HH:mm:ss")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Payload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileJson className="h-4 w-4 text-primary" />
                Payload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Webhook Response */}
          {job.webhook_response && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-accent" />
                  Webhook Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {JSON.stringify(job.webhook_response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Job ID */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            Job ID: <code className="bg-muted px-2 py-1 rounded">{job.id}</code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
