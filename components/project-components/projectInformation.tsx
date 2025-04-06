import { format } from "date-fns";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  TDIFFICULTYLEVEL,
  TPROJECT,
  TPROJECTSTATUS,
  TUPDATE_PROJECT,
} from "@/types/project";
import { Progress } from "../ui/progress";
import { CalendarIcon, CheckCircle, Edit, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { updateProjectBySlug } from "@/lib/api/projects";
import { toast } from "sonner";

// Get difficulty badge color
const getDifficultyColor = (level: TDIFFICULTYLEVEL) => {
  switch (level) {
    case "EASY":
      return "bg-green-500";
    case "MEDIUM":
      return "bg-yellow-500";
    case "HARD":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Get status badge color
const getStatusColor = (status: TPROJECTSTATUS) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "CANCELLED":
      return "bg-red-500";
    case "ONGOING":
      return "bg-blue-500";
    case "COMPLETED":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

interface ProjectInformationProps {
  project: TPROJECT | null;
  slug: string;
}

export default function ProjectInformation({
  project,
  slug,
}: ProjectInformationProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Form schema for project update
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters" }),
    detail: z
      .string()
      .min(20, { message: "Detail must be at least 20 characters" }),
    projectType: z.enum(["INHOUSE", "OUTSOURCE"]),
    niche: z.string().min(2, { message: "Niche is required" }),
    bounty: z.coerce
      .number()
      .positive({ message: "Bounty must be a positive number" }),
    deadline: z.string(),
    projectStatus: z.enum(["PENDING", "CANCELLED", "ONGOING", "COMPLETED"]),
    progressPercentage: z.coerce.number().min(0).max(100),
    isDeadlineNeedToBeExtend: z.boolean(),
    difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  });

  // Initialize form with project data
  const form = useForm<TUPDATE_PROJECT>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title,
      detail: project?.detail,
      projectType: project?.projectType,
      niche: project?.niche,
      bounty: project?.bounty,
      deadline: project?.deadline,
      projectStatus: project?.projectStatus,
      progressPercentage: project?.progressPercentage,
      isDeadlineNeedToBeExtend: project?.isDeadlineNeedToBeExtend,
      difficultyLevel: project?.difficultyLevel,
    },
  });
  // Handle form submission
  const onSubmit = async (data: TUPDATE_PROJECT) => {
    try {
      const response = await updateProjectBySlug(slug, data);
      if (response.status === 200) {
        toast.success("Successfully Updated the details");
        setIsEditing(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>View and manage project details</CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niche</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bounty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bounty ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date ? date.toISOString() : "")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INHOUSE">In-house</SelectItem>
                            <SelectItem value="OUTSOURCE">Outsource</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="progressPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDeadlineNeedToBeExtend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Extend Deadline</FormLabel>
                          <FormDescription>
                            Check if the deadline needs to be extended
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Details</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Title
                  </h3>
                  <p className="text-lg font-medium">{project?.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Niche
                  </h3>
                  <p className="text-lg font-medium">{project?.niche}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Bounty
                  </h3>
                  <p className="text-lg font-medium">
                    ${project?.bounty.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Deadline
                  </h3>
                  <p className="text-lg font-medium flex items-center">
                    {project?.deadline
                      ? format(new Date(project.deadline), "PPP")
                      : "No deadline"}
                    {project?.isDeadlineNeedToBeExtend && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-yellow-100 text-yellow-800"
                      >
                        Extension Needed
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Project Type
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {project?.projectType === "INHOUSE"
                      ? "In-house"
                      : "Outsource"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Difficulty Level
                  </h3>
                  <Badge
                    className={`mt-1 ${
                      project?.difficultyLevel
                        ? getDifficultyColor(project.difficultyLevel)
                        : "bg-gray-500"
                    }`}
                  >
                    {project?.difficultyLevel}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    className={`mt-1 ${
                      project?.projectStatus
                        ? getStatusColor(project.projectStatus)
                        : "bg-gray-500"
                    }`}
                  >
                    {project?.projectStatus}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Progress
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress
                      value={project?.progressPercentage}
                      className="h-2"
                    />
                    <span className="text-sm font-medium">
                      {project?.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Project Details
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {project?.detail}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Selected Freelancers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project?.selectedFreelancers?.length ? (
                    project.selectedFreelancers.map((freelancer: any) => (
                      <Badge
                        key={freelancer.uid}
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {freelancer.fullName}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No freelancers selected yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
