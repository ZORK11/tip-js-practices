import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

console.log("ПР2. Демонстрационный сценарий");
console.log("Номер варианта:", variantNumber);

// ---------------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------------

function apply(result, state) {
  if (result.ok) return result.tasks;
  console.error("Ошибка:", result.error);
  return state;
}

function printSummary(tasks, label) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`\n--- ${label} ---`);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
  console.log("id:", tasks.map((t) => t.id));
}

// ---------------------------------------------------------------------------
// Общий сценарий
// ---------------------------------------------------------------------------

const demoSnapshot = JSON.stringify(demoTasks);
let current = demoTasks;

console.log("\nНазвания:", getTaskTitles(current));
console.log("Невыполненные id:", getPendingTasks(current).map((t) => t.id));
printSummary(current, "Общий набор: исходный");

current = apply(addTask(current, 20, "Добавить проверку", "high"), current);
printSummary(current, "После добавления id = 20");

current = apply(setTaskCompleted(current, 4, true), current);
printSummary(current, "После выполнения id = 4");

current = apply(renameTask(current, 10, "Подготовить инструкцию запуска"), current);
printSummary(current, "После переименования id = 10");

current = apply(removeTask(current, 7), current);
printSummary(current, "После удаления id = 7");

console.log("\nОбработка отказов:");
console.log("Повтор id = 1:", addTask(current, 1, "Дубликат"));
console.log('Статус "true":', setTaskCompleted(current, 4, "true"));
console.log("Нет id = 999:", removeTask(current, 999));
console.log('Строковый id "20":', addTask(current, "20", "Задача"));

console.log("\ndemoTasks не изменился:", JSON.stringify(demoTasks) === demoSnapshot);

// ---------------------------------------------------------------------------
// Индивидуальный вариант 1
// ---------------------------------------------------------------------------

console.log("\n================ ВАРИАНТ 1 ================");

const variantSnapshot = JSON.stringify(variantTasks);
let v = variantTasks;

printSummary(v, "Вариант: исходный");
console.log("Названия:", getTaskTitles(v));
console.log("Невыполненные id:", getPendingTasks(v).map((t) => t.id));

// 1. Добавить задачу id = 80, priority = "high"
v = apply(addTask(v, 80, "Защитить учебный проект", "high"), v);
printSummary(v, "После добавления id = 80");

// 2. Установить completed = true для id = 11
v = apply(setTaskCompleted(v, 11, true), v);
printSummary(v, "После выполнения id = 11");

// 3. Переименовать id = 23
v = apply(renameTask(v, 23, "Составить подробный план работы"), v);
printSummary(v, "После переименования id = 23");

// 4. Удалить id = 37
v = apply(removeTask(v, 37), v);
printSummary(v, "После удаления id = 37");

// 5. Повторно добавить id = 80 — ожидается отказ
console.log("\nПовторное добавление id = 80:");
console.log(addTask(v, 80, "Дубликат", "low"));

// 6. Итог
printSummary(v, "Вариант: итоговый набор");
console.log("\nИтоговая таблица варианта:");
console.table(v);

console.log("\nvariantTasks не изменился:", JSON.stringify(variantTasks) === variantSnapshot);

// ---------------------------------------------------------------------------
// Итоговая таблица общего набора
// ---------------------------------------------------------------------------

console.log("\nИтоговая таблица общего набора:");
console.table(current);