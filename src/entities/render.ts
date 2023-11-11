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
}
