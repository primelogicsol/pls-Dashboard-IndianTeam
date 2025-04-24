"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { CheckCircle2, Star, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { getAllProjectsWithThierClient, giveFeedbackAndRatings } from "@/lib/api/projects"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import type { Project } from "@/interfaces/index"
import { statusConfig } from "@/config/uiConfig"

export default function ClientProjectStatusPage() {
  const { isAuthorized } = useAuth(["CLIENT"]) // Auth check should be the first hook
  const router = useRouter() // useRouter should be near the top

  // State hooks
  const [projects, setProjects] = useState<Project[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [Pageloading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackProject, setFeedbackProject] = useState<Project | null>(null)
  const [rating, setRating] = useState(3)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Effect hooks should come after state hooks
  useEffect(() => {
    fetchAllProjects(currentPage)
  }, [currentPage])

  async function fetchAllProjects(page: number) {
    setLoading(true)
    try {
      const response = await getAllProjectsWithThierClient(page)
      if (!response.success) throw new Error("Failed to fetch projects")

      setProjects(response.data.projects)
      setTotalPages(response.data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching client projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (project: Project) => {
    setFeedbackProject(project)
    setFeedbackDialogOpen(true)
    setRating(3) // Default rating
    setComment("") // Clear comment
  }

  const submitFeedback = async () => {
    if (!feedbackProject) return

    setSubmitting(true)
    try {
      const data = {
        starsByClientAfterProjectCompletion: rating.toString(),
        commentByClientAfterProjectCompletion: comment,
      }

      const response = await giveFeedbackAndRatings(feedbackProject.projectSlug, data)

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        variant: "default",
      })

      setFeedbackDialogOpen(false)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthorized) return null // Prevent rendering if unauthorized

  const getStatusConfig = (status: string) => {
    return statusConfig[status.toUpperCase()] || statusConfig.PENDING
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        {/* <Button onClick={() => router.push("/dashboard/client/projects/create")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          New Project
        </Button> */}
      </div>

      {Pageloading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-xl font-semibold mb-4">You have not been assigned any projects.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const statusConf = getStatusConfig(project.projectStatus)
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className={cn("pb-2", statusConf.bgColor)}>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2 h-[3rem]">{project.title}</CardTitle>
                        <statusConf.icon className={cn("h-5 w-5", statusConf.textColor)} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{project.progressPercentage}%</span>
                        </div>
                        <Progress value={project.progressPercentage} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Status</span>
                          <Badge
                            className={cn("border", statusConf.borderColor, statusConf.textColor, statusConf.bgColor)}
                            variant="outline"
                          >
                            {project.projectStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Deadline</span>
                          <span className="text-sm font-medium">
                            {format(new Date(project.deadline), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                          <Button onClick={() => setSelectedProject(project)} variant="outline">
                            View Details
                          </Button>
                          {/* <Button onClick={() => router.push(`/dashboard/client/projects/${project.projectSlug}`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Manage
                        </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </Suspense>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="mt-4">{selectedProject.detail}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Project Details</h4>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deadline</span>
                        <span className="text-sm font-medium">
                          {format(new Date(selectedProject.deadline), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bounty</span>
                        <span className="text-sm font-medium">${selectedProject.bounty}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Type
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProject.projectType}
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status Information</h4>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge
                          className={cn(
                            "border",
                            getStatusConfig(selectedProject.projectStatus).borderColor,
                            getStatusConfig(selectedProject.projectStatus).textColor,
                            getStatusConfig(selectedProject.projectStatus).bgColor,
                          )}
                          variant="outline"
                        >
                          {selectedProject.projectStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{selectedProject.progressPercentage}%</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Difficulty
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            difficultyColors[selectedProject.difficultyLevel]
                          )}
                        >
                          {selectedProject.difficultyLevel}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Assigned Developers</h4>
                  {selectedProject?.selectedFreelancers && selectedProject.selectedFreelancers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.selectedFreelancers.map((freelancer) => (
                        <Badge key={freelancer.uid} className="flex items-center gap-1.5">
                          <CheckSquare className="h-3.5 w-3.5" />
                          <span>{freelancer.fullName}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Developers assigned yet</p>
                  )}
                </div>
                {selectedProject?.progressPercentage === 100 && (
                  <Button
                    variant="default"
                    className="flex items-center gap-2 text-sm text-green-600"
                    onClick={() => handleSubmitFeedback(selectedProject)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Give Feedback
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Project Feedback</DialogTitle>
            <DialogDescription>Please rate your experience and provide feedback for this project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`h-8 w-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about this project..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitFeedback} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
