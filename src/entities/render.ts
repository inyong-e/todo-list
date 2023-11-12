import { Todo } from "./Store";

export interface CreateTodoParams {
  todo: Todo;
  onClickTodoItem: (e: Event) => void;
  onClickRemoveButton: () => void;
}

export enum DomClassNames {
  allClearButton = "all-clear-button",
  footer = "footer",
  todoListWrapper = "todo-list-wrapper",
  todoCountText = "todo-count-text",
  filterButtonWrapper = "filter-button-wrapper",
  filterButtonAll = "filter-button-all",
  filterButtonActive = "filter-button-active",
  filterButtonCompleted = "filter-button-completed",
  inputBox = "input-box",
  todoItem = "todo-item",
  wrapper = "wrapper",
}

export interface TodoRenderRepository {
  initialRender(rootElement: HTMLElement): void;
  addInputBoxEvent(e: (e: Event) => void): void;
  addAllClearCompletedButtonEvent(e: (e: Event) => void): void;
  addFilterButtonAllEvent(e: (e: Event) => void): void;
  addFilterButtonActiveEvent(e: (e: Event) => void): void;
  addFilterButtonCompletedEvent(e: (e: Event) => void): void;
  fillFilterButtonAll(): void;
  fillFilterButtonActive(): void;
  fillFilterButtonCompleted(): void;
  clearFilterButtonAll(): void;
  clearFilterButtonActive(): void;
  clearFilterButtonCompleted(): void;

  clearAllTodoList(): void;
  clearInputBox(): void;
  createTodoItem({
    todo,
    onClickTodoItem,
    onClickRemoveButton,
  }: CreateTodoParams): void;
  removeTodoItem(id: string): void;
  updateTodoItem(todo: Todo);
  updateTodoCountText(): void;
  updateAllClearButton(count: number): void;
  preventInputBox(): void;
  activeInputBox(): void;
}
