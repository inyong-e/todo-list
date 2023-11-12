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

    this.renderRepository.addFilterButtonAllEvent(
      this.ShowTodoListAll.bind(this),
    );

    this.renderRepository.addFilterButtonActiveEvent(
      this.ShowTodoListActive.bind(this),
    );

    this.renderRepository.addFilterButtonCompletedEvent(
      this.ShowTodoListCompleted.bind(this),
    );
  }

  ClearCompletedTodoItem() {
    this.storeRepository.getCompletedTodoList().forEach((todo) => {
      this.storeRepository.removeTodoItem(todo.id);
      this.renderRepository.removeTodoItem(todo.id);
    });

    this.RenderCompleteTodoCount();
    this.renderRepository.updateTodoCountText();
  }

  ShowTodoListAll() {
    this.renderRepository.clearAllTodoList();

    this.RenderCompletedTodoList();
    this.RenderActiveTodoList();

    this.renderRepository.updateTodoCountText();
    this.renderRepository.activeInputBox();

    this.renderRepository.fillFilterButtonAll();
    this.renderRepository.clearFilterButtonActive();
    this.renderRepository.clearFilterButtonCompleted();
  }

  ShowTodoListActive() {
    this.renderRepository.clearAllTodoList();
    this.RenderActiveTodoList();

    this.renderRepository.activeInputBox();
    this.renderRepository.activeInputBox();

    this.renderRepository.clearFilterButtonAll();
    this.renderRepository.fillFilterButtonActive();
    this.renderRepository.clearFilterButtonCompleted();
  }

  ShowTodoListCompleted() {
    this.renderRepository.clearAllTodoList();
    this.RenderCompletedTodoList();

    this.renderRepository.updateTodoCountText();
    this.renderRepository.preventInputBox();

    this.renderRepository.clearFilterButtonAll();
    this.renderRepository.clearFilterButtonActive();
    this.renderRepository.fillFilterButtonCompleted();
  }

  ToggleTodoItem(todoId: string) {
    const todo = this.storeRepository.getTodoItem(todoId);
    if (!todo) return;

    const updatedTodo = { ...todo, complete: !todo.complete };

    this.storeRepository.updateTodoItem(updatedTodo);

    this.ShowTodoListAll();

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

  RenderActiveTodoList() {
    this.storeRepository.getActiveTodoList().forEach((todo) => {
      this.RenderCreateTodo(todo);
    });
  }

  RenderCompletedTodoList() {
    this.storeRepository.getCompletedTodoList().forEach((todo) => {
      this.RenderCreateTodo(todo);
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
}

export default TodoListService;
