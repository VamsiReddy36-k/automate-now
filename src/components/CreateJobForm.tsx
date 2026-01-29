import { useState } from "react";
import { useCreateJob } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Sparkles } from "lucide-react";

export function CreateJobForm() {
  const [taskName, setTaskName] = useState("");
  const [payload, setPayload] = useState("{}");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [payloadError, setPayloadError] = useState("");

  const createJob = useCreateJob();

  const validatePayload = (value: string) => {
    try {
      JSON.parse(value);
      setPayloadError("");
      return true;
    } catch {
      setPayloadError("Invalid JSON format");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) return;
    if (!validatePayload(payload)) return;

    createJob.mutate(
      {
        taskName: taskName.trim(),
        payload: JSON.parse(payload),
        priority,
      },
      {
        onSuccess: () => {
          setTaskName("");
          setPayload("{}");
          setPriority("medium");
        },
      }
    );
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="gradient-saffron text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Create New Job
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Add a new task to the automation queue
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="taskName" className="text-foreground font-medium">
              Task Name *
            </Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Send Welcome Email"
              required
              className="border-2 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payload" className="text-foreground font-medium">
              Payload (JSON)
            </Label>
            <Textarea
              id="payload"
              value={payload}
              onChange={(e) => {
                setPayload(e.target.value);
                validatePayload(e.target.value);
              }}
              placeholder='{"key": "value"}'
              rows={4}
              className={`font-mono text-sm border-2 ${
                payloadError ? "border-destructive" : "focus:border-primary"
              }`}
            />
            {payloadError && (
              <p className="text-sm text-destructive">{payloadError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-foreground font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
              <SelectTrigger className="border-2 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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

          <Button
            type="submit"
            disabled={createJob.isPending || !taskName.trim()}
            className="w-full gradient-saffron text-primary-foreground font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createJob.isPending ? "Creating..." : "Create Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
