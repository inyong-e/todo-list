export enum RenderingDomIDs {
  todoListWrapper = "todo-list-wrapper",
}

export interface TodoRenderRepository {
  initialRender(rootElement: HTMLElement): void;
}
