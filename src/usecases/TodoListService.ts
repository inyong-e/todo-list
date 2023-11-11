import { TodoRenderRepository } from "@/entities/render";
import { TodoStoreRepository } from "@/entities/Store";

class TodoListService {
  todoStoreRepository: TodoStoreRepository;
  todoRenderRepository: TodoRenderRepository;

  constructor({
    todoStoreRepository,
    todoRenderRepository,
  }: {
    todoStoreRepository: TodoStoreRepository;
    todoRenderRepository: TodoRenderRepository;
  }) {
    this.todoStoreRepository = todoStoreRepository;
    this.todoRenderRepository = todoRenderRepository;
  }

  initialRender(rootElement: HTMLElement) {
    this.todoRenderRepository.initialRender(rootElement);
  }
}

export default TodoListService;
