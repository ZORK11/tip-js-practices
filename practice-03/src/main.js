import { demoTasks, variantTasks, variantNumber } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
};

const isVariant = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariant ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

function renderApp() {
  const visible = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(elements.list, visible);
  renderSummary(elements.summary, currentTasks, visible.length);
  renderEmptyState(elements.empty, currentTasks.length, visible.length);

  elements.filters
    .querySelectorAll("button[data-filter]")
    .forEach((btn) => {
      const active = btn.dataset.filter === currentFilter;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
}

function handleTaskListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button || !elements.list.contains(button)) return;

  const card = button.closest("[data-task-id]");
  if (!card) return;

  const id = Number(card.dataset.taskId);
  if (!Number.isSafeInteger(id) || id <= 0) return;

  const action = button.dataset.action;

  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);
    if (!task) {
      elements.message.textContent = `Задача с id=${id} не найдена`;
      return;
    }
    const result = setTaskCompleted(currentTasks, id, !task.completed);
    if (result.ok) {
      currentTasks = result.tasks;
      elements.message.textContent = task.completed
        ? `Задача ${id} возвращена в работу`
        : `Задача ${id} выполнена`;
      renderApp();
      restoreTaskFocus(id, action);
    } else {
      elements.message.textContent = result.error;
    }
    return;
  }

  if (action === "delete") {
    const result = removeTask(currentTasks, id);
    if (result.ok) {
      currentTasks = result.tasks;
      elements.message.textContent = `Задача ${id} удалена`;
      renderApp();
      restoreTaskFocus(id, action);
    } else {
      elements.message.textContent = result.error;
    }
    return;
  }
}

function handleFilterClick(event) {
  const button = event.target.closest("button[data-filter]");
  if (!button || !elements.filters.contains(button)) return;

  const filter = button.dataset.filter;
  if (!["all", "pending", "completed"].includes(filter)) return;

  currentFilter = filter;
  elements.message.textContent = "";
  renderApp();
}

function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  const filterButton = elements.filters.querySelector(`[data-filter="${currentFilter}"]`);
  (actionButton ?? filterButton)?.focus();
}

elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);

try {
  renderApp();
} catch (error) {
  elements.message.textContent = `Ошибка запуска: ${error.message}`;
  console.error(error);
}