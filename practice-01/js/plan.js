"use strict";

const totalTasks = 12;
const completedTasks = 11;
const dailyLimit = 2;

if (typeof totalTasks === "string" || typeof completedTasks === "string") {
  console.log("Ошибка: вместо числа передана строка.");
} 
else if (typeof totalTasks !== "number" || typeof completedTasks !== "number") {
  console.log("Ошибка: недопустимое числовое значение.");
} 
else if (Number.isNaN(totalTasks) || Number.isNaN(completedTasks)) {
  console.log("Ошибка: недопустимое числовое значение.");
} 
else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
  console.log("Ошибка: дробное количество.");
} 
else if (totalTasks < 0 || completedTasks < 0) {
  console.log("Ошибка: отрицательное количество.");
} 
else if (totalTasks > 1000) {
  console.log("Ошибка: превышена верхняя граница.");
} 
else if (completedTasks > totalTasks) {
  console.log("Ошибка: некорректное число выполненных задач.");
} 
else if (typeof dailyLimit === "string") {
  console.log("Ошибка: дневная норма задана строкой.");
} 
else if (typeof dailyLimit !== "number" || Number.isNaN(dailyLimit)) {
  console.log("Ошибка: недопустимое числовое значение.");
} 
else if (!Number.isInteger(dailyLimit)) {
  console.log("Ошибка: дробной дневной нормы быть не должно.");
} 
else if (dailyLimit < 1) {
  console.log("Ошибка: дневная норма должна быть целым числом от 1 до 1000.");
} 
else if (dailyLimit > 1000) {
  console.log("Ошибка: превышена верхняя граница нормы.");
} 
else {
  let remaining = totalTasks - completedTasks;

  if (remaining === 0) {
    if (totalTasks === 0) {
      console.log("Задач пока нет.");
    } else {
      console.log("Все задачи уже выполнены.");
    }
    console.log("Потребуется дней: 0");
  } else {
    console.log("Осталось задач: " + remaining);

    let day = 0;

    while (remaining > 0) {
      day += 1;
      const doneToday = Math.min(dailyLimit, remaining);
      remaining -= doneToday;

      console.log(`День ${day}: выполнено ${doneToday}, осталось ${remaining}`);
    }

    console.log("Потребуется дней: " + day);
  }
}