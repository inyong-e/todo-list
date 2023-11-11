export interface Todo {
  content: string;
  complete: boolean;
}

export interface TodoRepository {
  save(todo: Todo): void;
  findAll(): Todo[];
  findById(id: number): Todo | undefined;
  deleteById(id: number): void;
}
