import { getTaskStats } from "./task-service.js";

const PRIORITY_LABELS = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

// Здесь создаётся DOM, но не изменяется состояние приложения.
export function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.taskId = String(task.id);
  if (task.completed) {
    li.classList.add("is-completed");
  }

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const status = document.createElement("p");
  status.className = "task-status";
  status.textContent = task.completed ? "Выполнена" : "В работе";

  const priority = document.createElement("p");
  priority.className = "task-priority";
  priority.textContent = PRIORITY_LABELS[task.priority] ?? task.priority;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.dataset.action = "toggle";
  toggle.setAttribute("aria-pressed", String(task.completed));
  const toggleLabel = document.createElement("span");
  toggleLabel.className = "action-label";
  toggleLabel.textContent = "Выполнена";
  toggle.appendChild(toggleLabel);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.action = "delete";
  const removeLabel = document.createElement("span");
  removeLabel.className = "action-label";
  removeLabel.textContent = "Удалить";
  remove.appendChild(removeLabel);

  actions.append(toggle, remove);
  li.append(title, status, priority, actions);

  return li;
}

export function renderTaskList(listElement, tasks) {
  // listElement сохраняется: на нём висит делегированный обработчик.
  const cards = tasks.map(createTaskElement);
  listElement.replaceChildren(...cards);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const { total, completed, pending, progress } = getTaskStats(tasks);

  const set = (name, value) => {
    const el = summaryElement.querySelector(`[data-stat="${name}"]`);
    if (el) el.textContent = String(value);
  };

  set("total", total);
  set("completed", completed);
  set("pending", pending);
  set("progress", `${progress.toFixed(1)}%`);
  set("visible", visibleCount);
}

export function renderEmptyState(messageElement, total, visibleCount) {
  if (total === 0) {
    messageElement.textContent = "Задач пока нет";
    messageElement.hidden = false;
    return;
  }
  if (visibleCount === 0) {
    messageElement.textContent = "Нет задач по выбранному фильтру";
    messageElement.hidden = false;
    return;
  }
  messageElement.textContent = "";
  messageElement.hidden = true;
}