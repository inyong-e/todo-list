import { TodoRenderRepository } from "@/entities/render";
import { Todo, TodoStoreRepository } from "@/entities/Store";
import generateUniqueId from "@/utils";

class TodoListService {
  filterType: "all" | "active" | "completed";
  timer: number | null = null;
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
    this.filterType = "all";
    this.renderRepository.initialRender(rootElement);
    this.renderRepository.addInputBoxEvent(this.InputBoxKeyEvent.bind(this));
    this.renderRepository.addOutsideMirrorTodo(this.ClearOverTodo.bind(this));

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

    this.renderRepository.addDocumentKeyEvent(
      this.InputDocumentKeyEvent.bind(this),
    );

    this.renderRepository.fillFilterButtonAll();
  }

  ClearOverTodo() {
    this.overTodo = null;
  }

  ClearCompletedTodoItem() {
    this.storeRepository.getCompletedTodoList().forEach((todo) => {
      this.storeRepository.removeTodoItem(todo.id);
      this.renderRepository.removeTodoItem(todo.id);
    });

    this.RenderCompleteTodoCount();
    this.renderRepository.updateTodoCountText();
  }

  ShowTodoList() {
    switch (this.filterType) {
      case "all":
        this.ShowTodoListAll();
        break;
      case "active":
        this.ShowTodoListActive();
        break;
      case "completed":
        this.ShowTodoListCompleted();
        break;
    }
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
    this.filterType = "all";
  }

  ShowTodoListActive() {
    this.renderRepository.clearAllTodoList();
    this.RenderActiveTodoList();

    this.renderRepository.updateTodoCountText();
    this.renderRepository.activeInputBox();

    this.renderRepository.clearFilterButtonAll();
    this.renderRepository.fillFilterButtonActive();
    this.renderRepository.clearFilterButtonCompleted();
    this.filterType = "active";
  }

  ShowTodoListCompleted() {
    this.renderRepository.clearAllTodoList();
    this.RenderCompletedTodoList();

    this.renderRepository.updateTodoCountText();
    this.renderRepository.preventInputBox();

    this.renderRepository.clearFilterButtonAll();
    this.renderRepository.clearFilterButtonActive();
    this.renderRepository.fillFilterButtonCompleted();
    this.filterType = "completed";
  }

  ToggleTodoItem(todoId: string) {
    const todo = this.storeRepository.getTodoItem(todoId);
    if (!todo) return;

    const updatedTodo = { ...todo, complete: !todo.complete };

    this.storeRepository.updateTodoItem(updatedTodo);

    this.ShowTodoList();

    this.RenderCompleteTodoCount();
  }

  CancelDragTodoItem() {
    this.renderRepository.hideMirrorTodoItem();
    this.renderRepository.removeBodyMouseMoveEvent();
    this.renderRepository.removeBodyMouseUpEvent();
    this.dragStatus = false;
    clearTimeout(this.timer);
    this.timer = null;
  }

  GetCurrentTodoList(): Todo[] {
    switch (this.filterType) {
      case "all":
        return this.storeRepository.getTodoListAll().slice();
      case "active":
        return this.storeRepository.getActiveTodoList().slice();
      case "completed":
        return this.storeRepository.getCompletedTodoList().slice();
    }
  }

  GetSortTodoList(todo: Todo, overTodo: Todo, todoList: Todo[]): Todo[] {
    if (overTodo === null) todoList;

    const activeTodoList = todoList.filter((item) => !item.complete);
    const completedTodoList = todoList.filter((item) => item.complete);

    const findTodoIndex = activeTodoList.findIndex(
      (item) => item.id === todo.id,
    );
    const findOverTodoIndex = activeTodoList.findIndex(
      (item) => item.id === overTodo.id,
    );

    const removedElement = activeTodoList.splice(findTodoIndex, 1)[0];

    activeTodoList.splice(findOverTodoIndex, 0, removedElement);

    return [...completedTodoList, ...activeTodoList];
  }

  GetReplaceByCompleteTodoList(todoList: Todo[]): Todo[] {
    const activeTodos = todoList.filter((item) => !item.complete);
    const completedTodos = todoList.filter((item) => item.complete);
    return [...activeTodos, ...completedTodos];
  }

  ReLocateTodoItem(todo: Todo, overTodo: Todo) {
    const todoList = this.GetSortTodoList(
      todo,
      overTodo,
      this.storeRepository.getTodoListAll().slice(),
    );

    this.storeRepository.setTodoList(todoList);
    this.ShowTodoList();
  }

  RenderCompleteTodoCount() {
    const completedTodoList = this.storeRepository.getCompletedTodoList();
    this.renderRepository.updateAllClearButton(completedTodoList.length);
  }

  TimerForPreview(todo: Todo, overTodo?: Todo) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      const todoList = this.GetSortTodoList(
        todo,
        overTodo,
        this.GetCurrentTodoList(),
      );
      this.renderRepository.previewTodoListLayout(todoList);
      this.timer = null;
    }, 1000) as unknown as number;
  }

  RenderMouseMoveBody(todo: Todo) {
    return (e: MouseEvent) => {
      if (todo.complete) return;

      if (!this.timer) {
        this.ShowTodoList();
      }

      this.dragStatus = true;
      this.renderRepository.moveMirrorTodoItem(e.clientX, e.clientY);
      this.TimerForPreview(todo, this.overTodo);
    };
  }

  RenderMouseUpBody(todo: Todo) {
    return () => {
      if (this.dragStatus) {
        this.ReLocateTodoItem(todo, this.overTodo);
      } else {
        this.ToggleTodoItem(todo.id);
      }

      this.CancelDragTodoItem();
    };
  }

  OverTodoItem(todo: Todo) {
    this.overTodo = todo;

    if (this.dragStatus) {
      this.renderRepository.fillOverBorderTodoItem(todo);
    }
  }

  RenderCreateTodo(todo: Todo) {
    this.renderRepository.createTodoItem({
      todo,
      onOverTodoItem: () => this.OverTodoItem(todo),
      onClickRemoveButton: (e: Event) => {
        e.stopPropagation();
        this.RemoveTodoItem(todo.id);
      },

      onDownTodoItem: (e) => {
        e.stopPropagation();
        this.renderRepository.showMirrorTodoItem(todo);

        this.renderRepository.addBodyMouseMoveEvent(
          this.RenderMouseMoveBody(todo).bind(this),
        );

        this.renderRepository.addBodyMouseUpEvent(
          this.RenderMouseUpBody(todo).bind(this),
        );
      },
      onLeaveTodoItem: () => {
        this.renderRepository.clearOverBorderTodoItem(todo);
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
    e.stopPropagation();
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

  InputDocumentKeyEvent(e: KeyboardEvent) {
    if (e.key !== "Escape") return;

    this.ClearOverTodo();
    this.CancelDragTodoItem();
  }

  RemoveTodoItem(todoId: string) {
    this.storeRepository.removeTodoItem(todoId);
    this.renderRepository.removeTodoItem(todoId);
    this.renderRepository.updateTodoCountText();

    this.RenderCompleteTodoCount();
  }
}

export default TodoListService;
