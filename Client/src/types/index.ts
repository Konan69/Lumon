export interface Task {
  id: string;
  title: string;
  status: string;
  Category: Category;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  // tasks: Task[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
