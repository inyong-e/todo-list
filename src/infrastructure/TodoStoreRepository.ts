class TodoStoreRepository {
  static TodoList: Todo[] = [];


  get TodoList() {
    return TodoStoreRepository.TodoList;
  }

  set TodoList(todoList: Todo[]) {
    TodoStoreRepository.TodoList = todoList;
  }
}