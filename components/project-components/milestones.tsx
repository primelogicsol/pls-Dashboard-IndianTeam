"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserDetails } from "@/lib/api/storage";
import { Milestone } from "@/types/project";
import {
  completeMilestone,
  createAMilestone,
  deleteAMilestone,
  updateAMilestone,
  updateProgressOfAMilestone,
} from "@/lib/api/milestones";
import { toast } from "sonner";
import UpdateMilestoneModal from "@/components/project-components/UpdateMilestoneModal";

// ✅ Define Zod Schema for form validation
const milestoneSchema = z.object({
  mileStoneName: z
    .string()
    .min(3, "Milestone Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  deadline: z.string().nonempty("Deadline is required"),
  progress: z.number().min(0).max(100, "Progress must be between 0-100"),
  totalProgressPoints: z
    .number()
    .min(1, "Total Progress Points must be at least 1"),
  projectId: z.number().int(),
  priorityRank: z.number().int(),
});

interface MilestonesTimelineProps {
  milestones: Milestone[];
  slug: string;
  projectId?: number;
  onMilestoneChange: () => void;
}

export default function MilestonesTimeline({
  milestones,
  slug,
  projectId,
  onMilestoneChange,
}: MilestonesTimelineProps) {
  const milestonesArray = Array.isArray(milestones) ? milestones : [];
  const [userRole, setUserRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userDetails = getUserDetails();
    const role = userDetails?.role || "";
    setUserRole(role);
  }, []);

  // ✅ Initialize React Hook Form with Zod
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      mileStoneName: "",
      description: "",
      deadline: "",
      progress: 0,
      totalProgressPoints: 10,
      projectId: projectId ?? 0,
      priorityRank: 1,
    },
  });

  // ✅ Set the projectId dynamically
  useEffect(() => {
    if (projectId) {
      setValue("projectId", projectId);
    }
  }, [projectId, setValue]);

  const onSubmit = async (data: any) => {
    console.log("Collected Milestone Data:", data);
    try {
      const response = await createAMilestone(data, projectId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Milestone created successfully");
        onMilestoneChange();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setOpenDialog(false);
    reset();
  };

  const handleMilestoneDelete = async (milestoneId: number) => {
    try {
      const response = await deleteAMilestone(milestoneId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Milestone delted successfully");
        onMilestoneChange();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  // Open the modal with selected milestone data
  const handleUpdateClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setUpdateModalOpen(true);
  };

  const handleMarkAsComplete = async (milestoneId: number) => {
    try {
      const response = await completeMilestone(milestoneId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Successfully completed a milestone");
        onMilestoneChange();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleProgressUpdate = async (milestoneId: number) => {
    console.log(milestoneId, progress);
    try {
      const response = await updateProgressOfAMilestone(milestoneId, progress);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Successfully Updated a milestone");
        onMilestoneChange();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ✅ Sort milestones by priorityRank
  const sortedMilestones = [...milestonesArray].sort(
    (a, b) => a.priorityRank - b.priorityRank
  );

  return (
    <div className="mt-4 mb-4">
      <section>
        <Card>
          <CardHeader>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold mb-4">Project Milestones</h3>
              {(userRole === "ADMIN" || userRole === "MODERATOR") && (
                <Button variant="default" onClick={() => setOpenDialog(true)}>
                  Create Milestone
                </Button>
              )}
            </div>
          </CardHeader>

          {sortedMilestones.length === 0 ? (
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No milestones found for this project.
              </p>
            </CardContent>
          ) : (
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-muted-foreground/20 z-0" />
                <div className="space-y-16">
                  {sortedMilestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-10">
                      <div className="absolute left-0 top-8">
                        {milestone.isMilestoneCompleted ? (
                          <CheckCircle2Icon className="h-7 w-7 text-primary bg-green-500 rounded-full" />
                        ) : (
                          <CircleIcon className="h-7 w-7 bg-red-500 rounded-full" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-base">
                            {milestone.mileStoneName}
                          </h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            {format(
                              new Date(milestone.deadline),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                        <div className="flex justify-start">
                          
                          <Badge
                            className={`${
                              milestone.isMilestoneCompleted
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {milestone.isMilestoneCompleted
                              ? "Completed"
                              : "Not Completed"}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                          {/* Left Section - Progress Bar (Takes Half of the Row) */}
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{milestone.progress}%</span>
                            </div>
                            <Progress
                              value={milestone.progress}
                              className="h-2"
                            />
                          </div>

                          {/* Right Section - Update & Delete Buttons (Takes Other Half) */}
                          {userRole === "ADMIN" ? (
                            <div className="flex flex-1 justify-end space-x-2">
                              <Button
                                variant="ghost"
                                onClick={() => handleUpdateClick(milestone)}
                              >
                                Update
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  handleMilestoneDelete(milestone.id)
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          ) : userRole === "FREELANCER" ? (
                            <div className="flex flex-1 justify-end space-x-2">
                              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="secondary">
                                    Update Progress
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Progress</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      type="number"
                                      placeholder="Enter progress..."
                                      value={progress}
                                      onChange={(e) =>
                                        setProgress(Number(e.target.value))
                                      }
                                    />
                                    <Button
                                      onClick={() =>
                                        handleProgressUpdate(milestone?.id)
                                      }
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              {!milestone.isMilestoneCompleted && (
                                <Button
                                  variant="default"
                                  onClick={() =>
                                    handleMarkAsComplete(milestone.id)
                                  }
                                >
                                  Mark as Complete
                                </Button>
                              )}
                            </div>
                          ) : (
                            "No data"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* ✅ Render the update milestone modal */}
                {selectedMilestone && (
                  <UpdateMilestoneModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    milestone={{
                      ...selectedMilestone,
                      description: selectedMilestone?.description || "",
                      deadline: new Date(
                        selectedMilestone?.deadline
                      ).toISOString(),
                    }}
                    milestoneId={selectedMilestone.id}
                    onMilestoneUpdated={onMilestoneChange}
                  />
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </section>

      {/* Create Milestone Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Milestone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="mileStoneName">Milestone Name</Label>
              <Input {...register("mileStoneName")} />
              {errors.mileStoneName && (
                <p className="text-red-500 text-sm">
                  {errors.mileStoneName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input type="datetime-local" {...register("deadline")} />
              {errors.deadline && (
                <p className="text-red-500 text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                type="number"
                {...register("projectId", { valueAsNumber: true })}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="totalProgressPoints">Total Progress Points</Label>
              <Input
                type="number"
                {...register("totalProgressPoints", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="priorityRank">Priority Rank</Label>
              <Input
                type="number"
                {...register("priorityRank", { valueAsNumber: true })}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
