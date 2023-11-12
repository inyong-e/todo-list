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
    this.renderRepository.addAllClearCompletedButtonEvent(
      this.ClearCompletedTodoItem.bind(this),
    );
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
      this.RenderCreateTodo(todo);
    });
    completedTodoList.forEach((todo) => {
      this.storeRepository.updateTodoItem(todo);
    });

    activeTodoList.forEach((todo) => {
      this.RenderCreateTodo(todo);
    });

    this.RenderCompleteTodoCount();
  }

  RenderCompleteTodoCount() {
    const completedTodoList = this.storeRepository.getCompletedTodoList();
    this.renderRepository.updateAllClearButton(completedTodoList.length);
  }

  RenderCreateTodo(todo: Todo) {
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

    this.RenderCreateTodo(todo);

    this.storeRepository.createTodoItem(todo);
    this.renderRepository.clearInputBox();
    this.renderRepository.updateTodoCountText();
  }

  RemoveTodoItem(todoId: string) {
    this.storeRepository.removeTodoItem(todoId);
    this.renderRepository.removeTodoItem(todoId);
    this.renderRepository.updateTodoCountText();

    this.RenderCompleteTodoCount();
  }

  ClearCompletedTodoItem() {
    this.storeRepository.getCompletedTodoList().forEach((todo) => {
      this.storeRepository.removeTodoItem(todo.id);
      this.renderRepository.removeTodoItem(todo.id);
    });

    this.RenderCompleteTodoCount();
    this.renderRepository.updateTodoCountText();
  }
}

export default TodoListService;
