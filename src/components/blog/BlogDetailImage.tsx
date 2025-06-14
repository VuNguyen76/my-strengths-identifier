
interface BlogDetailImageProps {
  imageUrl: string | null;
  title: string;
}

const BlogDetailImage = ({ imageUrl, title }: BlogDetailImageProps) => {
  if (!imageUrl) return null;

  return (
    <div className="mb-8">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
      />
    </div>
  );
};

export default BlogDetailImage;
