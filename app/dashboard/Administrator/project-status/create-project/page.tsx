"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAProject } from "@/lib/api/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  detail: z.string().min(10, "Detail must be at least 10 characters long"),
  niche: z.string().min(3, "Niche must be at least 3 characters long"),
  bounty: z.coerce.number().min(1, "Bounty must be a positive number"),
  deadline: z.string().nonempty("Deadline is required"),
  difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  clientWhoPostedThisProjectForeignId: z.string().nonempty("Client UID is required"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function Page() {

  const router = useRouter();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit =async (data: ProjectFormValues) => {
    try{
      const response = await createAProject(data);
      if(response.status === 200) {
        toast.success("Project has been created successfully");
        router.push("/dashboard/Administrator/project-status")
      } 
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} className="w-full" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="detail">Detail</Label>
          <Textarea id="detail" {...register("detail")} className="w-full" />
          {errors.detail && <p className="text-red-500 text-sm">{errors.detail.message}</p>}
        </div>

        <div>
          <Label htmlFor="niche">Niche</Label>
          <Input id="niche" {...register("niche")} className="w-full" />
          {errors.niche && <p className="text-red-500 text-sm">{errors.niche.message}</p>}
        </div>

        <div>
          <Label htmlFor="bounty">Bounty</Label>
          <Input id="bounty" type="number" {...register("bounty", { valueAsNumber: true })} className="w-full" />
          {errors.bounty && <p className="text-red-500 text-sm">{errors.bounty.message}</p>}
        </div>

        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="datetime-local" {...register("deadline")} className="w-full" />
          {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
        </div>

        <div>
          <Label htmlFor="difficultyLevel">Difficulty Level</Label>
          <Select onValueChange={(value) => setValue("difficultyLevel", value as "EASY" | "MEDIUM" | "HARD") }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          {errors.difficultyLevel && <p className="text-red-500 text-sm">{errors.difficultyLevel.message}</p>}
        </div>

        <div>
          <Label htmlFor="clientWhoPostedThisProjectForeignId">Client UID</Label>
          <Input id="clientWhoPostedThisProjectForeignId" placeholder="Enter the UID of the client" {...register("clientWhoPostedThisProjectForeignId")} className="w-full" />
          {errors.clientWhoPostedThisProjectForeignId && <p className="text-red-500 text-sm">{errors.clientWhoPostedThisProjectForeignId.message}</p>}
        </div>

        <Button type="submit" className="flex justify-start">Create Project</Button>
      </form>
    </div>
  );
}
