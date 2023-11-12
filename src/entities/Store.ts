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
  getTodoListAll(): Todo[];
  getTodoItem(id: string): Todo | undefined;
  getActiveTodoList(): Todo[];
  getCompletedTodoList(): Todo[];
  setTodoList(todoList: Todo[]): void;
}
