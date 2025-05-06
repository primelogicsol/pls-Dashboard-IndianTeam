# Prime Logic Dashboard - Blog Management

## Overview

The blog management system allows administrators to create, edit, publish, and manage blog content on the platform. It includes interfaces for blog creation, editing, and viewing, as well as trash management for deleted blogs.

## Blog Data Structure

\`\`\`typescript
interface Blog {
  blogId: number
  blogTitle: string
  blogSlug: string
  blogThumbnail: string
  blogOverview: string
  blogBody?: string
  isPublished: boolean
  createdAt: string
}
\`\`\`

## Blog Management Interfaces

### Administrator Interfaces

- Blog List: `app/dashboard/Administrator/blogs/page.tsx`
- Create Blog: `app/dashboard/Administrator/blogs/create/page.tsx`
- Edit Blog: `app/dashboard/Administrator/blogs/[slug]/edit/page.tsx`
- View Blog: `app/dashboard/Administrator/blogs/[slug]/page.tsx`

## Blog Components

- `components/blogs/blogCard.tsx`: Displays blog information in a card format

## Blog CRUD Operations

### Create Blog

Administrators can create new blogs with:
- Title
- Content (rich text)
- Author information
- Featured image

### Read Blog

- View all blogs: `app/dashboard/Administrator/blogs/page.tsx`
- View single blog: `app/dashboard/Administrator/blogs/[slug]/page.tsx`

### Update Blog

- Edit blog content: `app/dashboard/Administrator/blogs/[slug]/edit/page.tsx`

### Delete Blog

- Soft delete (move to trash)
- Restore from trash
- Permanent deletion



## Blog API Services

The API services for blog management are defined in `lib/api/blogs.ts` and include:

- `getAllPublicBlogs(params)`: Retrieves all blogs with optional filtering
- `getASingleBlog(blogSlug)`: Retrieves a specific blog
- `createABlog(blogData)`: Creates a new blog
- `updateABlog(blogSlug, blogData)`: Updates blog information
- `deleteABlog(id)`: deletes a blog
- `updateBlogVisibility(blogSlug, isPublic)`: Toggles blog visibility to public or private.
