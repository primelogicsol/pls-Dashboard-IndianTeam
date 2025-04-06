"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createABlog } from "@/lib/api/blogs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Dynamically import the MDX editor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const BlogForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    blogTitle: "",
    blogThumbnail: "",
    blogOverview: "",
    blogBody: "",
  });
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);
  if (!isAuthorized) return null; // Prevent rendering if unauthorized

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMDXChange = (value?: string) => {
    setFormData({ ...formData, blogBody: value || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await createABlog(formData);
      if (response.status === 200) {
        toast.success("Blog created Successfully");
        setFormData({ blogTitle: "", blogThumbnail: "", blogOverview: "", blogBody: "" });
        router.push("/dashboard/Administrator/blogs");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Blog Title</label>
          <Input
            type="text"
            name="blogTitle"
            placeholder="Enter your blog title"
            value={formData.blogTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Thumbnail URL</label>
          <Input
            type="text"
            name="blogThumbnail"
            placeholder="Enter thumbnail URL"
            value={formData.blogThumbnail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Blog Overview</label>
          <Textarea
            name="blogOverview"
            placeholder="Write a short overview of your blog"
            value={formData.blogOverview}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Blog Content (Markdown Supported)</label>
          <div className="border p-3 rounded bg-gray-100">
            <MDEditor value={formData.blogBody} onChange={handleMDXChange} height={300} />
          </div>
        </div>
        <div className="text-center">
          <Button type="submit" className="px-6 py-3 text-lg">Submit Blog</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
