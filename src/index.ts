import DomRenderingRepository from "@/infrastructure/DomRenderingRepository";
import TodoStoreRepository from "@/infrastructure/TodoStoreRepository";
import TodoListService from "@/usecases/TodoListService";

import "@/styles/index.css";

const todoListService = new TodoListService({
  todoStoreRepository: new TodoStoreRepository(), // TodoList 비즈니스 로직
  todoRenderRepository: new DomRenderingRepository(), // TodoList 렌더링 로직
});

const rootElement = document.body;
todoListService.InitialRender(rootElement);
