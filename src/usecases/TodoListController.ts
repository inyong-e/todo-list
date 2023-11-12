import { TodoRenderRepository } from "@/entities/render";
import { Todo, TodoStoreRepository } from "@/entities/Store";
import generateUniqueId from "@/utils";

class TodoListService {
  storeRepository: TodoStoreRepository;
  renderRepository: TodoRenderRepository;

  constructor({
    todoStoreRepository,
    todoRenderRepository,
  }: {
    todoStoreRepository: TodoStoreRepository;
    todoRenderRepository: TodoRenderRepository;
  }) {
    this.storeRepository = todoStoreRepository;
    this.renderRepository = todoRenderRepository;
  }

  InitialRender(rootElement: HTMLElement) {
    this.renderRepository.initialRender(rootElement);
    this.renderRepository.addInputBoxEvent(this.InputBoxKeyEvent.bind(this));
  }

  ShowTodoListAll() {
    // const todoList = this.storeRepository.getTodoList();

    this.renderRepository.clearAllTodoList();

    // todoList.forEach((todo) => {});
  }

  ShowTodoListActive() {}

  ShowTodoListCompleted() {}

  ToggleTodoItem(todoId: string) {
    const todo = this.storeRepository.getTodoItem(todoId);
    if (!todo) return;

    const updatedTodo = { ...todo, complete: !todo.complete };

    this.storeRepository.updateTodoItem(updatedTodo);
    this.renderRepository.updateTodoItem(updatedTodo);

    this.renderRepository.clearAllTodoList();

    const completedTodoList = this.storeRepository.getCompletedTodoList();
    const activeTodoList = this.storeRepository.getActiveTodoList();

    completedTodoList.forEach((todo) => {
      this.CreateTodoRender(todo);
    });
    completedTodoList.forEach((todo) => {
      this.storeRepository.updateTodoItem(todo);
    });

    activeTodoList.forEach((todo) => {
      this.CreateTodoRender(todo);
    });
  }

  CreateTodoRender(todo: Todo) {
    this.renderRepository.createTodoItem({
      todo,
      onClickTodoItem: () => this.ToggleTodoItem(todo.id),
      onClickRemoveButton: () => this.RemoveTodoItem(todo.id),
    });
  }

  InputBoxKeyEvent(e: KeyboardEvent) {
    if (e.key !== "Enter") return;

    const id = generateUniqueId();

    const todo = {
      id,
      content: (e.target as HTMLInputElement).value,
      complete: false,
    };

    this.CreateTodoRender(todo);

    this.storeRepository.createTodoItem(todo);
    this.renderRepository.clearInputBox();
    this.renderRepository.updateTodoCountText();
  }

  RemoveTodoItem(todoId: string) {
    this.storeRepository.removeTodoItem(todoId);
    this.renderRepository.removeTodoItem(todoId);
  }

  ClearTodoItemAll() {}
}

export default TodoListService;
