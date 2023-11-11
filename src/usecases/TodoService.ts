import { TodoRepository } from "@/entities/Todo";

class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  public add(): void {}
}

export default TodoService;
