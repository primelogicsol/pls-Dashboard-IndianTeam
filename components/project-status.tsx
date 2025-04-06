import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { TPROJECT, TPROJECTSTATUS, TDIFFICULTYLEVEL } from "@/types/project"

const statusColors: Record<TPROJECTSTATUS, string> = {
  PENDING: "bg-yellow-200 text-yellow-800",
  CANCELLED: "bg-red-200 text-red-800",
  ONGOING: "bg-blue-200 text-blue-800",
  COMPLETED: "bg-green-200 text-green-800",
}

const difficultyColors: Record<TDIFFICULTYLEVEL, string> = {
  EASY: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-800",
}

export function ProjectStatus({ project }: { project: TPROJECT }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className={statusColors[project.projectStatus]}>
          {project.projectStatus}
        </Badge>
        <Badge variant="outline" className={difficultyColors[project.difficultyLevel]}>
          {project.difficultyLevel}
        </Badge>
      </div>
      <Progress value={project.progressPercentage} className="w-full" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress: {project.progressPercentage}%</span>
        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Type: {project.projectType}</span>
        <span>Bounty: ${project.bounty}</span>
      </div>
      <div className="text-sm">
        <span>Niche: {project.niche}</span>
      </div>
      {project.isDeadlineNeedToBeExtend && <Badge variant="destructive">Deadline Extension Needed</Badge>}
    </div>
  )
}

