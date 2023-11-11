import { Todo, TodoStoreRepository } from "@/entities/Store";

export default class todoStoreRepository implements TodoStoreRepository {
  todoList: Todo[];

  constructor() {
    this.TodoList = [];
  }

  get TodoList(): Todo[] {
    return this.TodoList;
  }

  set TodoList(todoList: Todo[]) {
    this.todoList = todoList;
  }
}
