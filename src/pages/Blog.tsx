
import { useState } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <BlogLoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <BlogHeader />

          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <BlogSearchAndFilters
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {blogs.length > 0 ? (
            <BlogGrid blogs={blogs} />
          ) : (
            <div className="flex justify-center">
              <EmptyBlogState />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
