"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Eye, Globe, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Types based on the API response
export interface Blog {
  blogId: number
  blogTitle: string
  blogSlug: string
  blogThumbnail: string
  blogOverview: string
  blogBody?: string
  isPublished: boolean
  createdAt: string
}

interface BlogCardProps {
  blog: Blog
  onDelete: (blogId: number, blogSlug: string) => Promise<void>
  onToggleVisibility: (blog: Blog) => Promise<void>
}

export function BlogCard({ blog, onDelete, onToggleVisibility }: BlogCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false)

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle edit blog
  const handleEdit = () => {
    router.push(`/dashboard/Administrator/blogs/${blog.blogSlug}/edit`)
  }

  // Handle view blog
  const handleView = () => {
    console.log(blog.blogSlug)
    router.push(`/dashboard/Administrator/blogs/${blog.blogSlug}`)
  }

  // Handle visibility toggle
  const handleVisibilityToggle = async () => {
    setIsUpdatingVisibility(true)
    try {
      await onToggleVisibility(blog)
      setShowVisibilityDialog(false)
    } catch (error) {
      console.error("Error updating visibility:", error)
    } finally {
      setIsUpdatingVisibility(false)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 sm:h-48 w-full">
        <Image src={blog.blogThumbnail || "/placeholder.svg"} alt={blog.blogTitle} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={blog.isPublished ? "default" : "secondary"} className="flex gap-1 items-center">
            {blog.isPublished ? (
              <>
                <Globe className="h-3 w-3" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                <span>Private</span>
              </>
            )}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-lg line-clamp-2">{blog.blogTitle}</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-2">{formatDate(blog.createdAt)}</p>
        <p className="text-sm line-clamp-3">{blog.blogOverview}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
          <Button
            className="text-sm cursor-pointer w-full sm:w-auto"
            variant="default"
            onClick={() => setShowVisibilityDialog(true)}
            disabled={isUpdatingVisibility}
          >
            {blog.isPublished ? "Change to Private" : "Change to Public"}
          </Button>

          <Dialog open={showVisibilityDialog} onOpenChange={setShowVisibilityDialog}>
            <DialogTrigger asChild>
              <Switch id={`visibility-${blog.blogId}`} checked={blog.isPublished} disabled={isUpdatingVisibility} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Blog Visibility</DialogTitle>
                <DialogDescription>
                  {blog.isPublished
                    ? "Making this blog private will hide it from public view. Only you will be able to see it."
                    : "Making this blog public will allow anyone to view it. Are you sure you want to proceed?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowVisibilityDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleVisibilityToggle} disabled={isUpdatingVisibility}>
                  {isUpdatingVisibility ? "Updating..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2 w-full justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this blog? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <DialogTrigger asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={() => onDelete(blog.blogId, blog.blogSlug)}>
                  Yes, Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}
