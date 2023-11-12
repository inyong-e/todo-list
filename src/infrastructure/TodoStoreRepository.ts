import { Todo, TodoStoreRepository } from "@/entities/Store";

export default class todoStoreRepository implements TodoStoreRepository {
  todoList: Todo[];

  constructor() {
    this.todoList = [];
  }

  createTodoItem(todo: Todo): void {
    this.todoList.push(todo);
  }

  removeTodoItem(id: string): void {
    this.todoList = this.todoList.filter((item) => item.id !== id);
  }

  removeTodoItemAll(): void {
    this.todoList = [];
  }

  updateTodoItem(todo: Todo): void {
    this.todoList = this.todoList.map((item) =>
      item.id === todo.id ? todo : item,
    );
  }

  getTodoListAll(): Todo[] {
    return this.todoList;
  }

  getTodoItem(id: string): Todo | undefined {
    return this.todoList.find((item) => item.id === id);
  }

  getActiveTodoList(): Todo[] {
    return this.todoList.filter((item) => !item.complete);
  }

  getCompletedTodoList(): Todo[] {
    return this.todoList.filter((item) => item.complete);
  }
}
