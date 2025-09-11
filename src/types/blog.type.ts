export interface BlogResponseType {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  blogImageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
  categories: {
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
}

export interface CategoryResponseType {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    blogs: number;
  };
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  tags: string[];
  categories: string[];
  blogImageUrl?: string;
  published?: boolean;
  imageFile?: File;
}

export interface UpdateBlogRequest {
  title: string;
  content: string;
  tags: string[];
  categories: string[];
  blogImageUrl?: string;
  published?: boolean;
  imageFile?: File;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
}

export interface UpdateCategoryRequest {
  name: string;
  slug: string;
}

