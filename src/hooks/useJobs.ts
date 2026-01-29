import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, getJob, createJob, runJob, CreateJobInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useJobs(filters?: { status?: string; priority?: string }) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Job Created",
        description: "Your job has been added to the queue.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRunJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => runJob(id),
    onMutate: () => {
      toast({
        title: "Job Started",
        description: "Processing... This will take a few seconds.",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Job Completed!",
        description: `${data.job.task_name} finished successfully.`,
      });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Job Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
