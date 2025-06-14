
import { useState } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogSearchAndFilters from "@/components/blog/BlogSearchAndFilters";
import BlogGrid from "@/components/blog/BlogGrid";
import EmptyBlogState from "@/components/blog/EmptyBlogState";
import BlogLoadingState from "@/components/blog/BlogLoadingState";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: blogs = [], isLoading: blogsLoading } = useBlogs({
    searchTerm,
    categoryId: activeCategory,
  });

  if (blogsLoading) {
    return <BlogLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogHeader />

      <BlogSearchAndFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {blogs.length > 0 ? (
        <BlogGrid blogs={blogs} />
      ) : (
        <EmptyBlogState />
      )}
    </div>
  );
};

export default Blog;
