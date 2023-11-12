import { TodoRenderRepository } from "@/entities/render";
import { Todo, TodoStoreRepository } from "@/entities/Store";
import generateUniqueId from "@/utils";

class TodoListService {
  dragStatus: boolean = false;
  overTodo: Todo | null = null;
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

    this.renderRepository.fillFilterButtonAll();
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

    this.renderRepository.updateTodoCountText();
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

  ReLocateTodoItem(todo: Todo, overTodo: Todo) {
    const todoList = this.storeRepository.getTodoListAll().slice();

    const findTodoIndex = todoList.findIndex((item) => item.id === todo.id);
    const findOverTodoIndex = todoList.findIndex(
      (item) => item.id === overTodo.id,
    );

    const removedElement = todoList.splice(findTodoIndex, 1)[0];

    todoList.splice(findOverTodoIndex, 0, removedElement);

    this.storeRepository.setTodoList(todoList);
    this.ShowTodoListAll();
  }

  RenderCompleteTodoCount() {
    const completedTodoList = this.storeRepository.getCompletedTodoList();
    this.renderRepository.updateAllClearButton(completedTodoList.length);
  }

  RenderMouseMoveBody(e: MouseEvent) {
    this.dragStatus = true;
    this.renderRepository.moveMirrorTodoItem(e.clientX, e.clientY);
  }

  RenderMouseUpBody(todo: Todo) {
    return () => {
      if (this.dragStatus) {
        this.ReLocateTodoItem(todo, this.overTodo);
      } else {
        this.ToggleTodoItem(todo.id);
      }

      this.renderRepository.hideMirrorTodoItem();
      this.renderRepository.removeBodyMouseMoveEvent();
      this.renderRepository.removeBodyMouseUpEvent();
      this.dragStatus = false;
    };
  }

  OverTodoItem(todo: Todo) {
    this.overTodo = todo;
  }

  RenderCreateTodo(todo: Todo) {
    this.renderRepository.createTodoItem({
      todo,
      onClickRemoveButton: (e: Event) => {
        e.stopPropagation();
        this.RemoveTodoItem(todo.id);
      },
      onOverTodoItem: () => this.OverTodoItem(todo),
      onDownTodoItem: (e) => {
        e.stopPropagation();
        this.renderRepository.showMirrorTodoItem(todo);

        this.renderRepository.addBodyMouseMoveEvent(
          this.RenderMouseMoveBody.bind(this),
        );

        this.renderRepository.addBodyMouseUpEvent(
          this.RenderMouseUpBody(todo).bind(this),
        );
      },
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
