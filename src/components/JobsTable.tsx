import { useState } from "react";
import { Job } from "@/lib/api";
import { useRunJob } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { JobDetailDialog } from "./JobDetailDialog";
import { Play, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface JobsTableProps {
  jobs: Job[];
  isLoading: boolean;
}

export function JobsTable({ jobs, isLoading }: JobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const runJob = useRunJob();

  const handleRunJob = async (job: Job) => {
    if (job.status !== "pending") return;
    setRunningJobId(job.id);
    await runJob.mutateAsync(job.id);
    setRunningJobId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-foreground">No Jobs Found</h3>
        <p className="text-muted-foreground mt-1">
          Create your first job to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Task Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{job.task_name}</TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={job.priority} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(job.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedJob(job)}
                      className="text-accent hover:text-accent hover:bg-accent/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRunJob(job)}
                      disabled={job.status !== "pending" || runningJobId === job.id}
                      className={`${
                        job.status === "pending"
                          ? "gradient-saffron text-primary-foreground"
                          : ""
                      }`}
                    >
                      {runningJobId === job.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">Run</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <JobDetailDialog
        job={selectedJob}
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      />
    </>
  );
}
