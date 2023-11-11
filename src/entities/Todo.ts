export interface Todo {
  content: string;
  complete: boolean;
}

export interface TodoStoreRepository {}

export interface TodoRenderRepository {
  initialRender(rootElement: HTMLElement): void;
}
