import { DomClassNames, TodoRenderRepository } from "@/entities/render";

export default class DomRenderingRepository implements TodoRenderRepository {
  initialRender(rootElement: HTMLElement): void {
    const todoListWrapperElement = document.createElement("div");
    todoListWrapperElement.className = DomClassNames.todoListWrapper;

    rootElement.appendChild(todoListWrapperElement);
  }
}
