"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/blogs/blogCard";
import {
  getAllPublicBlogs,
  deleteABlog,
  updateBlogVisibility,
} from "@/lib/api/blogs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
export interface Blog {
  blogId: number;
  blogTitle: string;
  blogSlug: string;
  blogThumbnail: string;
  blogOverview: string;
  blogBody?: string;
  isPublished: boolean;
  isPublic: boolean; // Added for public/private visibility
  createdAt: string;
}

export interface BlogsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    blogs: Blog[];
    pagination: PaginationInfo;
  };
  requestInfo: {
    url: string;
    ip: string;
    method: string;
  };
}
export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalBlogs: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for blogs data
  const [blogsData, setBlogsData] = useState<BlogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  // Get current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch blogs data
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // In a real application, this would call the actual API
        // For now, we'll simulate the API response with the provided data
        const response = await getAllPublicBlogs(currentPage, limit);
        setBlogsData(response);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, limit, debouncedSearchQuery]);

   // Conditional rendering happens after all hooks have been called
   if (loading) return <p>Loading...</p>;
   if (!isAuthorized) return null; // Prevent rendering if unauthorized

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogSlug: string, blogId: number) => {
    try {
      const response = await deleteABlog(blogSlug);
      if (response.status === 200) {
        toast.success("Blog deleted successfully");
      }

      // Update local state after successful deletion
      if (blogsData) {
        const updatedBlogs = blogsData.data.blogs.filter(
          (blog) => blog.blogId !== blogId
        );
        setBlogsData({
          ...blogsData,
          data: {
            ...blogsData.data,
            blogs: updatedBlogs,
            pagination: {
              ...blogsData.data.pagination,
              totalBlogs: blogsData.data.pagination.totalBlogs - 1,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  // Handle visibility toggle
  const handleVisibilityToggle = async (blog: Blog) => {
    try {
      const newVisibility = !blog.isPublic;
      await updateBlogVisibility(blog.blogSlug, newVisibility);

      // Update local state after successful update
      if (blogsData) {
        const updatedBlogs = blogsData.data.blogs.map((b) =>
          b.blogId === blog.blogId ? { ...b, isPublic: newVisibility } : b
        );

        setBlogsData({
          ...blogsData,
          data: {
            ...blogsData.data,
            blogs: updatedBlogs,
          },
        });
      }

      toast.success(`Blog is now ${newVisibility ? "public" : "private"}`);
    } catch (error) {
      console.error("Error updating blog visibility:", error);
      toast.error("Failed to change the status of the blog");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.push(
      `?page=${page}&limit=${limit}${
        debouncedSearchQuery
          ? `&search=${encodeURIComponent(debouncedSearchQuery)}`
          : ""
      }`
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog Management</h1>

      {/* Search and Add New Blog */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => router.push("/dashboard/Administrator/blogs/create")}
        >
          Add New Blog
        </Button>
      </div>

      {/* Blog Count */}
      {!loading && blogsData && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {blogsData.data.blogs.length} of{" "}
            {blogsData.data.pagination.totalBlogs} blogs
          </p>
        </div>
      )}

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : blogsData && blogsData.data.blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsData.data.blogs.map((blog) => (
            <BlogCard
              key={blog.blogId}
              blog={blog}
              onDelete={() => handleDeleteBlog(blog.blogSlug, blog.blogId)}
              onToggleVisibility={handleVisibilityToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blogs found. Try adjusting your search criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && blogsData && blogsData.data.pagination.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {/* {blogsData.data.pagination.hasPreviousPage && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                />
              </PaginationItem>
            )} */}
            {blogsData.data.blogs.map((blog) => (
              <BlogCard
                key={blog.blogId}
                blog={blog}
                onDelete={() => handleDeleteBlog(blog.blogSlug, blog.blogId)}
                onToggleVisibility={handleVisibilityToggle}
              />
            ))}

            {/* First page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis if needed */}
            {currentPage > 3 && (
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">
                  ...
                </span>
              </PaginationItem>
            )}

            {/* Previous page if not first */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Current page */}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                onClick={(e) => e.preventDefault()}
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Next page if not last */}
            {currentPage < blogsData.data.pagination.totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis if needed */}
            {currentPage < blogsData.data.pagination.totalPages - 2 && (
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">
                  ...
                </span>
              </PaginationItem>
            )}

            {/* Last page if not current or next */}
            {currentPage < blogsData.data.pagination.totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(blogsData.data.pagination.totalPages);
                  }}
                >
                  {blogsData.data.pagination.totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {blogsData.data.pagination.hasNextPage && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
