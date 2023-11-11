import { DomClassNames, TodoRenderRepository } from "@/entities/render";

export default class DomRenderingRepository implements TodoRenderRepository {
  initialRender(body: HTMLElement): void {
    const rootElement = document.createElement("div");
    rootElement.className = DomClassNames.wrapper;

    // inputBox 생성
    const inputBox = document.createElement("input");
    inputBox.className = DomClassNames.inputBox;
    inputBox.type = "text";
    inputBox.placeholder = "What needs to be done?";
    rootElement.appendChild(inputBox);

    // todoListWrapper 생성
    const todoListWrapper = document.createElement("div");
    todoListWrapper.className = DomClassNames.todoListWrapper;
    rootElement.appendChild(todoListWrapper);

    // footer 영역 생성
    const footer = document.createElement("div");
    footer.className = DomClassNames.footer;
    rootElement.appendChild(footer);

    // todoCountText 생성
    const todoCountText = document.createElement("span");
    todoCountText.textContent = "0 items left";
    footer.appendChild(todoCountText);

    // filterButtonWrapper 생성
    const filterButtonWrapper = document.createElement("div");
    footer.appendChild(filterButtonWrapper);

    // filterButton-All 생성
    const filterButtonAll = document.createElement("button");
    filterButtonAll.textContent = "All";
    filterButtonWrapper.appendChild(filterButtonAll);

    // filterButton-Active 생성
    const filterButtonActive = document.createElement("button");
    filterButtonActive.textContent = "Active";
    filterButtonWrapper.appendChild(filterButtonActive);

    // filterButton-Completed 생성
    const filterButtonCompleted = document.createElement("button");
    filterButtonCompleted.textContent = "Completed";
    filterButtonWrapper.appendChild(filterButtonCompleted);

    // all Clear 버튼 생성
    const allClearButton = document.createElement("button");
    allClearButton.textContent = "Clear completed(0)";
    footer.appendChild(allClearButton);

    body.appendChild(rootElement);

    // Todo Item 생성
    this.createTodoItem("Todo Item 1", () => {});
  }

  createTodoItem(text: string, eventHandler: () => void): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoListWrapper.appendChild(todoItem);

    const todoItemText = document.createElement("span");
    todoItemText.textContent = text;
    todoItem.appendChild(todoItemText);

    const todoItemDeleteButton = document.createElement("button");
    todoItemDeleteButton.textContent = "삭제";

    todoItemDeleteButton.addEventListener("click", eventHandler);

    todoItem.appendChild(todoItemDeleteButton);
  }

  removeTodoItem(index: number): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    const todoItem = document.getElementsByClassName(DomClassNames.todoItem)[
      index
    ] as HTMLElement;

    todoListWrapper.removeChild(todoItem);
  }

  updateTodoCountText(count: number): void {
    const todoCountText = document.querySelector(
      `.${DomClassNames.todoCountText}`,
    ) as HTMLElement;

    todoCountText.textContent = `${count} items left`;
  }

  updateAllClearButton(count: number): void {
    const allClearButton = document.querySelector(
      `.${DomClassNames.allClearButton}`,
    ) as HTMLElement;

    allClearButton.textContent = `Clear completed(${count})`;
  }

  updateFilterButtonAll(): void {
    const filterButtonAll = document.querySelector(
      `.${DomClassNames.filterButtonAll}`,
    ) as HTMLElement;

    filterButtonAll.style.color = "red";
  }

  updateFilterButtonActive(): void {
    const filterButtonActive = document.querySelector(
      `.${DomClassNames.filterButtonActive}`,
    ) as HTMLElement;

    filterButtonActive.style.color = "red";
  }

  updateFilterButtonCompleted(): void {
    const filterButtonCompleted = document.querySelector(
      `.${DomClassNames.filterButtonCompleted}`,
    ) as HTMLElement;

    filterButtonCompleted.style.color = "red";
  }

  clearFilterButtonCompletedToDefault(): void {
    const filterButtonCompleted = document.querySelector(
      `.${DomClassNames.filterButtonCompleted}`,
    ) as HTMLElement;

    filterButtonCompleted.style.color = "black";
  }

  clearFilterButtonAllToDefault(): void {
    const filterButtonAll = document.querySelector(
      `.${DomClassNames.filterButtonAll}`,
    ) as HTMLElement;

    filterButtonAll.style.color = "black";
  }

  clearFilterButtonActiveToDefault(): void {
    const filterButtonActive = document.querySelector(
      `.${DomClassNames.filterButtonActive}`,
    ) as HTMLElement;

    filterButtonActive.style.color = "black";
  }

  updateInputBox(text: string): void {
    const inputBox = document.querySelector(
      `.${DomClassNames.inputBox}`,
    ) as HTMLInputElement;

    inputBox.value = text;
  }

  updateTodoItem(index: number, text: string): void {
    const todoItem = document.getElementsByClassName(DomClassNames.todoItem)[
      index
    ] as HTMLElement;

    const todoItemText = todoItem.querySelector("span") as HTMLElement;
    todoItemText.textContent = text;
  }

  clearAllTodoList(): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    todoListWrapper.innerHTML = "";
  }

  updateAllClearButtonText(index: number): void {
    const allClearButton = document.querySelector(
      `.${DomClassNames.allClearButton}`,
    ) as HTMLElement;

    allClearButton.textContent = `Clear completed(${index})`;
  }
}
