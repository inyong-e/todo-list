export interface Todo {
  id: string;
  content: string;
  complete: boolean;
}

export interface TodoStoreRepository {
  createTodoItem(todo: Todo): void;
  removeTodoItem(id: string): void;
  removeTodoItemAll(): void;
  updateTodoItem(todo: Todo): void;
  getTodoList(): Todo[];
  getTodoItem(id: string): Todo | undefined;
}
