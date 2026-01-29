import { supabase } from "@/integrations/supabase/client";

export interface Job {
  id: string;
  task_name: string;
  payload: Record<string, unknown>;
  priority: "low" | "medium" | "high";
  status: "pending" | "running" | "completed" | "failed";
  webhook_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateJobInput {
  taskName: string;
  payload: Record<string, unknown>;
  priority: "low" | "medium" | "high";
}

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export async function createJob(input: CreateJobInput): Promise<Job> {
  const response = await fetch(`${FUNCTIONS_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create job");
  }

  return response.json();
}

export async function getJobs(filters?: {
  status?: string;
  priority?: string;
}): Promise<Job[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.priority) params.append("priority", filters.priority);

  const response = await fetch(
    `${FUNCTIONS_URL}/jobs${params.toString() ? `?${params}` : ""}`,
    {
      headers: {
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch jobs");
  }

  return response.json();
}

export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${FUNCTIONS_URL}/jobs/${id}`, {
    headers: {
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch job");
  }

  return response.json();
}

export async function runJob(id: string): Promise<{ message: string; job: Job }> {
  const response = await fetch(`${FUNCTIONS_URL}/run-job/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to run job");
  }

  return response.json();
}
