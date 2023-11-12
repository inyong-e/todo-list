import DomRenderingRepository from "@/infrastructure/DomRenderingRepository";
import TodoStoreRepository from "@/infrastructure/TodoStoreRepository";
import TodoListController from "@/usecases/TodoListController";

import "@/styles/index.css";

const todoListController = new TodoListController({
  todoStoreRepository: new TodoStoreRepository(), // TodoList 비즈니스 로직
  todoRenderRepository: new DomRenderingRepository(), // TodoList 렌더링 로직
});

const rootElement = document.body;
todoListController.InitialRender(rootElement);
