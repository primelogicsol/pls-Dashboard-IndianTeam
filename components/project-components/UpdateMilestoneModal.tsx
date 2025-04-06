"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateAMilestone } from "@/lib/api/milestones";
import { toast } from "sonner";
import { useState } from "react";

const milestoneSchema = z.object({
  mileStoneName: z.string().min(3, "Milestone name must be at least 3 characters"),
  progress: z.number().min(0).max(100, "Progress must be between 0 and 100"),
  deadline: z.string().min(1, "Deadline is required"),
  priorityRank: z.number().min(1, "Priority rank must be at least 1"),
  description : z.string().min(10, "Milestone description must be at least 10 characters")
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

interface UpdateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneFormData;
  milestoneId: number;
  onMilestoneUpdated: () => void; // Callback to refresh milestones in parent
}

export default function UpdateMilestoneModal({
  isOpen,
  onClose,
  milestone,
  milestoneId,
  onMilestoneUpdated,
}: UpdateMilestoneModalProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: milestone,
  });

  // Handle form submission
  const onSubmit = async (data: MilestoneFormData) => {
    setLoading(true);
    try {
      const response = await updateAMilestone(data, milestoneId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Milestone updated successfully");
        onMilestoneUpdated(); // Refresh milestone list
        onClose(); // Close modal
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Milestone</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Milestone Name</label>
            <Input {...register("mileStoneName")} placeholder="Enter milestone name" />
            {errors.mileStoneName && <p className="text-red-500 text-sm">{errors.mileStoneName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Milestone Description</label>
            <Input type="text" {...register("description")} placeholder="Enter milestone description" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Deadline</label>
            <Input type="datetime-local" {...register("deadline")} />
            {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Priority Rank</label>
            <Input type="number" {...register("priorityRank", { valueAsNumber: true })} placeholder="Priority" />
            {errors.priorityRank && <p className="text-red-500 text-sm">{errors.priorityRank.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Milestone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
