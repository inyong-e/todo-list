class TodoService {
    constructor(private todoRepository: TodoRepository) {}

    public add(todo: Todo): void {
        if (todo.title.length < 10) {
            throw new Error('...');
        }

        this.todoRepository.save(todo);
    }
}