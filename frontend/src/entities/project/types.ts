export type Project = {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
};

export type CreateProjectInput = {
  title: string;
  description?: string;
};
