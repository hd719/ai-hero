interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

type PostWithoutContent = Omit<Post, "content">;

const API_URL = "http://localhost:4317";

export class CmsClient {
  async createPost(
    data: Pick<Post, "title" | "content">,
  ): Promise<Post> {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create post: ${response.statusText}`,
      );
    }

    return response.json() as any;
  }

  async getAllPosts(): Promise<PostWithoutContent[]> {
    const response = await fetch(`${API_URL}/posts`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts: ${response.statusText}`,
      );
    }

    return response.json() as any;
  }

  async getPost(id: string): Promise<Post> {
    const response = await fetch(
      `${API_URL}/posts/${id}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Post not found: ${id}`);
      }
      throw new Error(
        `Failed to fetch post: ${response.statusText}`,
      );
    }

    return response.json() as any;
  }

  async updatePost(
    id: string,
    data: Partial<Pick<Post, "title" | "content">>,
  ): Promise<Post> {
    const response = await fetch(
      `${API_URL}/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Post not found: ${id}`);
      }
      throw new Error(
        `Failed to update post: ${response.statusText}`,
      );
    }

    return response.json() as any;
  }

  async deletePost(
    id: string,
  ): Promise<{ success: boolean }> {
    const response = await fetch(
      `${API_URL}/posts/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Post not found: ${id}`);
      }
      throw new Error(
        `Failed to delete post: ${response.statusText}`,
      );
    }

    return response.json() as any;
  }
}

export const createCmsClient = () => new CmsClient();
