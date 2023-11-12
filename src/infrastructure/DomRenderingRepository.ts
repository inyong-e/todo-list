import { Todo } from "@/entities/Store";
import {
  CreateTodoParams,
  DomClassNames,
  TodoRenderRepository,
} from "@/entities/render";

export default class DomRenderingRepository implements TodoRenderRepository {
  mirrorTodoElement: HTMLElement | null;
  eventListenerMouseMoveMirrorTodoItem: (e: Event) => void;
  eventListenerMouseUpMirrorTodoItem: (e: Event) => void;

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
    todoCountText.className = DomClassNames.todoCountText;
    todoCountText.textContent = "0 items left";
    footer.appendChild(todoCountText);

    // filterButtonWrapper 생성
    const filterButtonWrapper = document.createElement("div");
    footer.appendChild(filterButtonWrapper);

    // filterButton-All 생성
    const filterButtonAll = document.createElement("button");
    filterButtonAll.className = DomClassNames.filterButtonAll;
    filterButtonAll.textContent = "All";
    filterButtonWrapper.appendChild(filterButtonAll);

    // filterButton-Active 생성
    const filterButtonActive = document.createElement("button");
    filterButtonActive.className = DomClassNames.filterButtonActive;
    filterButtonActive.textContent = "Active";
    filterButtonWrapper.appendChild(filterButtonActive);

    // filterButton-Completed 생성
    const filterButtonCompleted = document.createElement("button");
    filterButtonCompleted.className = DomClassNames.filterButtonCompleted;
    filterButtonCompleted.textContent = "Completed";
    filterButtonWrapper.appendChild(filterButtonCompleted);

    // all Clear 버튼 생성
    const allClearButton = document.createElement("button");
    allClearButton.className = DomClassNames.allClearButton;
    allClearButton.textContent = "Clear completed (0)";
    footer.appendChild(allClearButton);

    body.appendChild(rootElement);

    // Mirror Todo Item 생성
    this.createMirrorTodoItem();
  }

  showMirrorTodoItem(todo: Todo): void {
    this.mirrorTodoElement.querySelector("span").textContent = todo.content;
  }

  moveMirrorTodoItem(x: number, y: number): void {
    const halfWidth = this.mirrorTodoElement.offsetWidth / 2;
    const halfHeight = this.mirrorTodoElement.offsetHeight / 2;

    this.mirrorTodoElement?.classList.remove(DomClassNames.hide);
    this.mirrorTodoElement?.style.setProperty("top", `${y - halfHeight}px`);
    this.mirrorTodoElement?.style.setProperty("left", `${x - halfWidth}px`);
  }

  hideMirrorTodoItem(): void {
    this.mirrorTodoElement?.classList.add(DomClassNames.hide);
  }

  addBodyMouseMoveEvent(e: (e: Event) => void) {
    document.body.addEventListener("mousemove", e);
    this.eventListenerMouseMoveMirrorTodoItem = e;
  }

  addBodyMouseUpEvent(e: (e: Event) => (todo: Todo) => void) {
    document.body.addEventListener("mouseup", e);
    this.eventListenerMouseUpMirrorTodoItem = e;
  }

  removeBodyMouseMoveEvent() {
    document.body.removeEventListener(
      "mousemove",
      this.eventListenerMouseMoveMirrorTodoItem,
    );
  }
  removeBodyMouseUpEvent() {
    document.body.removeEventListener(
      "mouseup",
      this.eventListenerMouseUpMirrorTodoItem,
    );
  }

  addInputBoxEvent(e: (e: Event) => void) {
    const inputBox = document.querySelector(
      `.${DomClassNames.inputBox}`,
    ) as HTMLInputElement;

    inputBox.addEventListener("keydown", e);
  }

  addAllClearCompletedButtonEvent(e: (e: Event) => void) {
    const allClearButton = document.querySelector(
      `.${DomClassNames.allClearButton}`,
    ) as HTMLElement;

    allClearButton.addEventListener("click", e);
  }

  addFilterButtonAllEvent(e: (e: Event) => void) {
    const filterButtonAll = document.querySelector(
      `.${DomClassNames.filterButtonAll}`,
    ) as HTMLElement;

    filterButtonAll.addEventListener("click", e);
  }

  addFilterButtonActiveEvent(e: (e: Event) => void) {
    const filterButtonActive = document.querySelector(
      `.${DomClassNames.filterButtonActive}`,
    ) as HTMLElement;

    filterButtonActive.addEventListener("click", e);
  }

  addFilterButtonCompletedEvent(e: (e: Event) => void) {
    const filterButtonCompleted = document.querySelector(
      `.${DomClassNames.filterButtonCompleted}`,
    ) as HTMLElement;

    filterButtonCompleted.addEventListener("click", e);
  }

  createTodoItem({
    todo,
    onClickRemoveButton,
    onDownTodoItem,
    onOverTodoItem,
  }: CreateTodoParams): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    // Todo Item 생성
    const todoItem = document.createElement("div");
    todoItem.classList.add(DomClassNames.todoItem);
    todoItem.classList.add(todo.id);

    todoListWrapper.insertBefore(todoItem, todoListWrapper.firstChild);

    // todo Item 에 필요한 이벤트 리스너들 추가
    todoItem.addEventListener("mousedown", onDownTodoItem);
    todoItem.addEventListener("mouseover", onOverTodoItem);

    // Todo CheckBox 생성
    const todoItemCheckBox = document.createElement("input");
    todoItemCheckBox.type = "checkbox";
    todoItemCheckBox.checked = todo.complete;
    todoItem.appendChild(todoItemCheckBox);

    // Todo Item Text 생성
    const todoItemText = document.createElement("span");
    todoItemText.textContent = todo.content;
    todoItem.appendChild(todoItemText);

    if (todo.complete) {
      todoItemText.classList.add("cancel");
    }

    // Todo Item Remove Button 생성
    const todoItemDeleteButton = document.createElement("button");
    todoItemDeleteButton.addEventListener("click", onClickRemoveButton);
    todoItemDeleteButton.textContent = "삭제";

    todoItem.appendChild(todoItemDeleteButton);
  }

  createMirrorTodoItem(): void {
    // Todo Item 생성
    const todoItem = document.createElement("div");
    todoItem.classList.add(DomClassNames.dragging);
    todoItem.classList.add(DomClassNames.disabled);
    todoItem.classList.add(DomClassNames.hide);

    // Todo CheckBox 생성
    const todoItemCheckBox = document.createElement("input");
    todoItemCheckBox.type = "checkbox";
    todoItem.appendChild(todoItemCheckBox);

    // Todo Item Text 생성
    const todoItemText = document.createElement("span");
    todoItem.appendChild(todoItemText);

    // Todo Item Remove Button 생성
    const todoItemDeleteButton = document.createElement("button");
    todoItemDeleteButton.textContent = "삭제";

    todoItem.appendChild(todoItemDeleteButton);
    document.body.insertBefore(todoItem, document.body.firstChild);

    this.mirrorTodoElement = todoItem;
  }

  removeTodoItem(id: string): void {
    const todoItem = document.getElementsByClassName(id)?.[0] as HTMLElement;
    todoItem?.remove();
  }

  updateTodoCountText(): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    const todoCountText = document.querySelector(
      `.${DomClassNames.todoCountText}`,
    ) as HTMLElement;

    todoCountText.textContent = `${todoListWrapper.childElementCount} items left`;
  }

  updateAllClearButton(count: number): void {
    const allClearButton = document.querySelector(
      `.${DomClassNames.allClearButton}`,
    ) as HTMLElement;

    allClearButton.textContent = `Clear completed (${count})`;
  }

  fillFilterButtonAll(): void {
    const filterButtonAll = document.querySelector(
      `.${DomClassNames.filterButtonAll}`,
    ) as HTMLElement;

    filterButtonAll.style.color = "red";
  }

  fillFilterButtonActive(): void {
    const filterButtonActive = document.querySelector(
      `.${DomClassNames.filterButtonActive}`,
    ) as HTMLElement;

    filterButtonActive.style.color = "red";
  }

  fillFilterButtonCompleted(): void {
    const filterButtonCompleted = document.querySelector(
      `.${DomClassNames.filterButtonCompleted}`,
    ) as HTMLElement;

    filterButtonCompleted.style.color = "red";
  }

  clearFilterButtonAll(): void {
    const filterButtonAll = document.querySelector(
      `.${DomClassNames.filterButtonAll}`,
    ) as HTMLElement;

    filterButtonAll.style.color = "black";
  }

  clearFilterButtonActive(): void {
    const filterButtonActive = document.querySelector(
      `.${DomClassNames.filterButtonActive}`,
    ) as HTMLElement;

    filterButtonActive.style.color = "black";
  }

  clearFilterButtonCompleted(): void {
    const filterButtonCompleted = document.querySelector(
      `.${DomClassNames.filterButtonCompleted}`,
    ) as HTMLElement;

    filterButtonCompleted.style.color = "black";
  }

  updateTodoItem(todo: Todo): void {
    const todoItem = document.getElementsByClassName(todo.id)[0] as HTMLElement;
    const span = todoItem.querySelector("span") as HTMLElement;
    span.classList.toggle("cancel");

    const checkbox = todoItem.querySelector("input") as HTMLInputElement;
    checkbox.checked = todo.complete;
  }

  clearAllTodoList(): void {
    const todoListWrapper = document.querySelector(
      `.${DomClassNames.todoListWrapper}`,
    ) as HTMLElement;

    todoListWrapper.innerHTML = "";
  }

  clearInputBox(): void {
    const inputBox = document.querySelector(
      `.${DomClassNames.inputBox}`,
    ) as HTMLInputElement;

    inputBox.value = "";
  }

  updateAllClearButtonText(index: number): void {
    const allClearButton = document.querySelector(
      `.${DomClassNames.allClearButton}`,
    ) as HTMLElement;

    allClearButton.textContent = `Clear completed (${index})`;
  }

  preventInputBox(): void {
    const inputBox = document.querySelector(
      `.${DomClassNames.inputBox}`,
    ) as HTMLInputElement;

    inputBox.disabled = true;
  }

  activeInputBox(): void {
    const inputBox = document.querySelector(
      `.${DomClassNames.inputBox}`,
    ) as HTMLInputElement;

    inputBox.disabled = false;
  }
}
