"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Lock, Edit } from "lucide-react";
import { getASingleBlog } from "@/lib/api/blogs";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/hooks/useAuth";

export interface Blog {
  blogId: number;
  blogTitle: string;
  blogSlug: string;
  blogThumbnail: string;
  blogOverview: string;
  blogBody?: string;
  isPublished: boolean;
  isPublic: boolean;
  createdAt: string;
}

export default function BlogPreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [mdxContent, setMdxContent] = useState<any>(null);

  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);
    

  const { slug } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        if (typeof slug === "string") {
          const blogData = await getASingleBlog(slug);
          setBlog(blogData.data);

          // Compile MDX content
          if (blogData.data.blogBody) {
            const mdxSource = await serialize(blogData.data.blogBody);
            setMdxContent(mdxSource);
          }
        } else {
          throw new Error("Invalid slug");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast({
          title: "Error",
          description: "Failed to load blog. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, toast]);

  if (!isAuthorized) return null; // Prevent rendering if unauthorized

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    if (blog) {
      router.push(`/blog/edit/${blog.blogId}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {!loading && blog && (
          <div className="flex items-center gap-4">
            <Badge
              variant={blog.isPublic ? "default" : "secondary"}
              className="flex gap-1 items-center"
            >
              {blog.isPublic ? (
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
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : blog ? (
        <div>
          {!blog.isPublic && (
            <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
              <AlertDescription>
                This blog is currently set to private. Only you can see it. Make
                it public to share with others.
              </AlertDescription>
            </Alert>
          )}

          <h1 className="text-4xl font-bold mb-4">{blog.blogTitle}</h1>
          <p className="text-muted-foreground mb-6">
            Published on {formatDate(blog.createdAt)}
          </p>

          <div className="relative w-full h-64 mb-8">
            <Image
              src={blog.blogThumbnail || "/placeholder.svg"}
              alt={blog.blogTitle}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p>{blog.blogOverview}</p>
          </div>

          {/* {mdxContent && (
            <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
              <MDXRemote {...mdxContent} />
            </div>
          )} */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.blogBody}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Blog not found.</p>
        </div>
      )}
    </div>
  );
}
