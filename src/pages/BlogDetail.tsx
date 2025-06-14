
import { useParams } from "react-router-dom";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { useBlogs } from "@/hooks/useBlogs";
import { useEffect } from "react";
import BlogDetailHeader from "@/components/blog/BlogDetailHeader";
import BlogDetailImage from "@/components/blog/BlogDetailImage";
import BlogDetailActions from "@/components/blog/BlogDetailActions";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import BlogDetailRelated from "@/components/blog/BlogDetailRelated";
import BlogDetailError from "@/components/blog/BlogDetailError";
import BlogLoadingState from "@/components/blog/BlogLoadingState";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogDetail(id || "");
  
  const { data: relatedPosts = [] } = useBlogs({
    categoryId: post?.category_id || undefined,
    limit: 3,
  });

  const filteredRelatedPosts = relatedPosts.filter(p => p.id !== id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <BlogLoadingState />;
  }

  if (error || !post) {
    return <BlogDetailError />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <BlogDetailHeader post={post} />
        <BlogDetailImage imageUrl={post.image_url} title={post.title} />
        <BlogDetailActions />
        <BlogDetailContent content={post.content} />
        <BlogDetailRelated relatedPosts={filteredRelatedPosts} />
      </div>
    </div>
  );
};

export default BlogDetail;
