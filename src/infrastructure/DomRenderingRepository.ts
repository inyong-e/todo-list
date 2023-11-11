import { TodoRenderRepository } from "@/entities/Todo";

export default class DomRenderingRepository implements TodoRenderRepository {
  initialRender(rootElement: HTMLElement): void {
    const todoListWrapperElement = document.createElement("div");
    todoListWrapperElement.id = "todo-list-wrapper";
    rootElement.appendChild(todoListWrapperElement);
  }
}
