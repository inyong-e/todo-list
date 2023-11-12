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
    this.renderRepository.addInputBoxEvent(this.inputBoxKeyEvent.bind(this));
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

    if (todo) {
      this.storeRepository.updateTodoItem({
        ...todo,
        complete: !todo.complete,
      });

      this.renderRepository.updateTodoItem({
        ...todo,
        complete: !todo.complete,
      });
    }

    this.renderRepository.clearAllTodoList();

    const completedTodoList = this.storeRepository.getCompletedTodoList();
    const activeTodoList = this.storeRepository.getActiveTodoList();

    completedTodoList.forEach((todo) => {
      this.createTodoRender(todo);
    });
    completedTodoList.forEach((todo) => {
      this.storeRepository.updateTodoItem(todo);
    });

    activeTodoList.forEach((todo) => {
      this.createTodoRender(todo);
    });
  }

  createTodoItem(todo: Todo) {
    this.storeRepository.createTodoItem(todo);
    this.createTodoRender(todo);
  }

  createTodoRender(todo: Todo) {
    this.renderRepository.createTodoItem({
      todo,
      onClickTodoItem: () => {
        this.ToggleTodoItem(todo.id);
      },
      onClickRemoveButton: () => {
        this.RemoveTodoItem(todo.id);
      },
    });
  }

  inputBoxKeyEvent(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const id = generateUniqueId();

      const todo = {
        id,
        content: input.value,
        complete: false,
      };

      this.createTodoItem(todo);
      this.renderRepository.clearInputBox();
    }
  }

  RemoveTodoItem(todoId: string) {
    this.storeRepository.removeTodoItem(todoId);
    this.renderRepository.removeTodoItem(todoId);
  }

  ClearTodoItemAll() {}
}

export default TodoListService;
