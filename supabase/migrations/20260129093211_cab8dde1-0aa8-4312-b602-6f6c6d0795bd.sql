-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Create enum for job priority
CREATE TYPE public.job_priority AS ENUM ('low', 'medium', 'high');

-- Create jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    priority job_priority NOT NULL DEFAULT 'medium',
    status job_status NOT NULL DEFAULT 'pending',
    webhook_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (no auth required for this demo)
CREATE POLICY "Allow public read access to jobs"
ON public.jobs FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to jobs"
ON public.jobs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update access to jobs"
ON public.jobs FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete access to jobs"
ON public.jobs FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_priority ON public.jobs(priority);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);