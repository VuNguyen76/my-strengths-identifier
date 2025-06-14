
interface BlogDetailImageProps {
  imageUrl: string | null;
  title: string;
}

const BlogDetailImage = ({ imageUrl, title }: BlogDetailImageProps) => {
  if (!imageUrl) return null;

  return (
    <div className="px-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default BlogDetailImage;
