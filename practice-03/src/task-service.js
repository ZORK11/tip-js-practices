// Заготовка модуля. throw ниже отмечает отсутствие реализации,
// а не способ обработки некорректных данных в готовом решении.
// Для предусмотренных ошибок необходимо возвращать { ok: false, error: "..." }.
// console.log(), prompt(), document и чтение внешнего состояния здесь не нужны.

export function createTask(id, title, priority = "medium") {
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0) {
    return {
      ok: false,
      error: "id должен быть положительным безопасным целым числом",
    };
  }

  if (typeof title !== "string") {
    return {
      ok: false,
      error: "title должен быть строкой",
    };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < 1 || trimmedTitle.length > 100) {
    return {
      ok: false,
      error: "title после trim() должен содержать от 1 до 100 символов",
    };
  }

  const allowedPriorities = ["low", "medium", "high"];

  if (typeof priority !== "string" || !allowedPriorities.includes(priority)) {
    return {
      ok: false,
      error: 'priority должен быть одним из: "low", "medium", "high"',
    };
  }

  return {
    ok: true,
    task: {
      id,
      title: trimmedTitle,
      completed: false,
      priority,
    },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter(task => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map(task => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed === true).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return { total, completed, pending, progress };
}

function validateId(id) {
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
    return {
      ok: false,
      error: 'id должен быть положительным безопасным целым числом',
    };
  }
  return { ok: true };
}


function validateTitle(title) {
  if (typeof title !== 'string') {
    return { ok: false, error: 'title должен быть строкой' };
  }
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return {
      ok: false,
      error: 'title после trim() должен содержать от 1 до 100 символов',
    };
  }
  return { ok: true, value: trimmed };
}


export function addTask(tasks, id, title, priority = "medium") {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  if (tasks.some(task => task.id === id)) {
    return { ok: false, error: `Задача с id=${id} уже существует` };
  }

  const createResult = createTask(id, title, priority);
  if (!createResult.ok) {
    return { ok: false, error: createResult.error };
  }

  return { ok: true, tasks: [...tasks, createResult.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  if (typeof completed !== 'boolean') {
    return { ok: false, error: 'completed должен быть логическим значением' };
  }

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.map(task => {
    if (task.id !== id) return task;
    return { ...task, completed };
  });

  return { ok: true, tasks: newTasks };
}


export function renameTask(tasks, id, title) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.map(task => {
    if (task.id !== id) return task;
    return { ...task, title: titleCheck.value };
  });

  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  const exists = tasks.some(task => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.filter(task => task.id !== id);

  return { ok: true, tasks: newTasks };
}
