import { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import { CreateJobForm } from "@/components/CreateJobForm";
import { JobFilters } from "@/components/JobFilters";
import { JobsTable } from "@/components/JobsTable";
import { DashboardStats } from "@/components/DashboardStats";
import { Sparkles, Zap } from "lucide-react";

const Index = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const { data: jobs = [], isLoading } = useJobs({
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
  });

  return (
    <div className="min-h-screen bg-background pattern-mandala">
      {/* Header */}
      <header className="gradient-saffron text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                Job Scheduler
                <Sparkles className="h-5 w-5" />
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                Automation Dashboard by Dotix Technologies
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Overview
          </h2>
          <DashboardStats jobs={jobs} />
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Job Form */}
          <aside className="lg:col-span-1">
            <CreateJobForm />
          </aside>

          {/* Jobs List */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Job Queue
            </h2>

            <JobFilters
              status={statusFilter}
              priority={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />

            <JobsTable jobs={jobs} isLoading={isLoading} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ for{" "}
            <span className="font-semibold text-primary">Dotix Technologies</span>
          </p>
          <p className="mt-1">Full Stack Developer Skill Test</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
