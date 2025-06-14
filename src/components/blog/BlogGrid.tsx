
import BlogCard from "./BlogCard";
import { Blog } from "@/hooks/useBlogs";

interface BlogGridProps {
  blogs: Blog[];
}

const BlogGrid = ({ blogs }: BlogGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;
