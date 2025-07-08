export interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  availability?: {
    [day: string]: Array<{
      start: string;
      end: string;
    }>;
  };
  subjects?: Array<{
    id: number;
    name?: string;
  }>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}