
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  updated_at: string;
  category: string;
  readTime?: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}
