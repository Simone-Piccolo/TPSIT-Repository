let tasks = []; 

document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.tasks || !Array.isArray(json.tasks)) {
        throw new Error("Invalid JSON format: missing 'tasks' array.");
      }
      tasks = json.tasks;
      document.getElementById("output").textContent = `Loaded ${tasks.length} tasks. Click "Run Simulation" to begin.`;
    } catch (err) {
      document.getElementById("output").textContent = "Error loading JSON: " + err.message;
      tasks = [];
    }
  };

  reader.readAsText(file);
}

function runSimulation() {
  if (!tasks || tasks.length === 0) {
    alert("Load a JSON file first!");
    return;
  }

  const fcfsResults = fcfs(JSON.parse(JSON.stringify(tasks)));
  const sjfResults = sjf(JSON.parse(JSON.stringify(tasks)));
  const sjfPreemptiveResults = sjfPreemptive(JSON.parse(JSON.stringify(tasks)));
  const rrResults = roundRobin(JSON.parse(JSON.stringify(tasks)), 2); // quantum=2
  const priorityResults = priorityScheduling(JSON.parse(JSON.stringify(tasks)));

  const fcfsAvg = calculateAverages(fcfsResults);
  const sjfAvg = calculateAverages(sjfResults);
  const sjfPreAvg = calculateAverages(sjfPreemptiveResults);
  const rrAvg = calculateAverages(rrResults);
  const priorityAvg = calculateAverages(priorityResults);

  const output =
    `📘 FCFS\n` +
    `Average Waiting Time: ${fcfsAvg.avgWaiting.toFixed(2)}\n` +
    `Average Turnaround Time: ${fcfsAvg.avgTurnaround.toFixed(2)}\n\n` +

    `📗 SJF (Non Preemptive)\n` +
    `Average Waiting Time: ${sjfAvg.avgWaiting.toFixed(2)}\n` +
    `Average Turnaround Time: ${sjfAvg.avgTurnaround.toFixed(2)}\n\n` +

    `📙 SJF Preemptive (SRTF)\n` +
    `Average Waiting Time: ${sjfPreAvg.avgWaiting.toFixed(2)}\n` +
    `Average Turnaround Time: ${sjfPreAvg.avgTurnaround.toFixed(2)}\n\n` +

    `🔵 Round Robin (Quantum=2)\n` +
    `Average Waiting Time: ${rrAvg.avgWaiting.toFixed(2)}\n` +
    `Average Turnaround Time: ${rrAvg.avgTurnaround.toFixed(2)}\n\n` +

    `🔴 Priority Scheduling\n` +
    `Average Waiting Time: ${priorityAvg.avgWaiting.toFixed(2)}\n` +
    `Average Turnaround Time: ${priorityAvg.avgTurnaround.toFixed(2)}\n`;

  document.getElementById("output").textContent = output;
}

function formatResults(results) {
  return results.map(t =>
    `Task ${t.id} — Waiting: ${t.waitingTime}, Turnaround: ${t.turnaroundTime}`
  ).join('\n');
}

function calculateAverages(results) {
  const totalWaiting = results.reduce((sum, t) => sum + t.waitingTime, 0);
  const totalTurnaround = results.reduce((sum, t) => sum + t.turnaroundTime, 0);
  const n = results.length;
  return {
    avgWaiting: totalWaiting / n,
    avgTurnaround: totalTurnaround / n
  };
}

// ------------------ FCFS ------------------
function fcfs(tasks) {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  return tasks.map(task => {
    task.startTime = Math.max(currentTime, task.arrivalTime);
    task.waitingTime = task.startTime - task.arrivalTime;
    task.turnaroundTime = task.waitingTime + task.burstTime;
    currentTime = task.startTime + task.burstTime;
    return task;
  });
}

// ------------------ SJF ------------------
function sjf(tasks) {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  let completed = [];
  let readyQueue = [];

  while (tasks.length > 0 || readyQueue.length > 0) {
    while (tasks.length > 0 && tasks[0].arrivalTime <= time) {
      readyQueue.push(tasks.shift());
    }

    if (readyQueue.length === 0) {
      time++;
      continue;
    }

    readyQueue.sort((a, b) => a.burstTime - b.burstTime);
    const task = readyQueue.shift();
    task.startTime = time;
    task.waitingTime = time - task.arrivalTime;
    task.turnaroundTime = task.waitingTime + task.burstTime;
    time += task.burstTime;
    completed.push(task);
  }

  return completed;
}

// ------------------ SJF PREEMPTIVE (SRTF) ------------------
function sjfPreemptive(tasks) {
  const n = tasks.length;
  const completed = [];
  const remaining = tasks.map(task => ({
    ...task,
    remainingTime: task.burstTime,
    isCompleted: false
  }));

  let currentTime = 0;
  let completedCount = 0;

  while (completedCount < n) {
    const available = remaining.filter(
      task => task.arrivalTime <= currentTime && !task.isCompleted
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.remainingTime - b.remainingTime);
    const currentTask = available[0];

    if (currentTask.startTime === undefined) {
      currentTask.startTime = currentTime;
    }

    currentTask.remainingTime--;
    currentTime++;

    if (currentTask.remainingTime === 0) {
      currentTask.completionTime = currentTime;
      currentTask.turnaroundTime = currentTask.completionTime - currentTask.arrivalTime;
      currentTask.waitingTime = currentTask.turnaroundTime - currentTask.burstTime;
      currentTask.isCompleted = true;
      completed.push(currentTask);
      completedCount++;
    }
  }

  return completed.sort((a, b) => a.id - b.id);
}

// ------------------ ROUND ROBIN ------------------
function roundRobin(tasks, quantum = 2) {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  const queue = [];
  const completed = [];
  const remaining = tasks.map(task => ({
    ...task,
    remainingTime: task.burstTime,
    startTime: null,
  }));

  while (remaining.length > 0 || queue.length > 0) {
    while (remaining.length > 0 && remaining[0].arrivalTime <= time) {
      queue.push(remaining.shift());
    }

    if (queue.length === 0) {
      time++;
      continue;
    }

    const task = queue.shift();

    if (task.startTime === null) {
      task.startTime = time;
    }

    const execTime = Math.min(task.remainingTime, quantum);
    task.remainingTime -= execTime;
    time += execTime;

    while (remaining.length > 0 && remaining[0].arrivalTime <= time) {
      queue.push(remaining.shift());
    }

    if (task.remainingTime === 0) {
      task.completionTime = time;
      task.turnaroundTime = task.completionTime - task.arrivalTime;
      task.waitingTime = task.turnaroundTime - task.burstTime;
      completed.push(task);
    } else {
      queue.push(task);
    }
  }

  return completed.sort((a, b) => a.id - b.id);
}

// ------------------ PRIORITY SCHEDULING ------------------
function priorityScheduling(tasks) {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const completed = [];
  const readyQueue = [];
  let time = 0;

  while (tasks.length > 0 || readyQueue.length > 0) {
    while (tasks.length > 0 && tasks[0].arrivalTime <= time) {
      readyQueue.push(tasks.shift());
    }

    if (readyQueue.length === 0) {
      time++;
      continue;
    }

    readyQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);

    const task = readyQueue.shift();
    task.startTime = time;
    task.waitingTime = time - task.arrivalTime;
    task.turnaroundTime = task.waitingTime + task.burstTime;
    time += task.burstTime;
    completed.push(task);
  }

  return completed;
}

function generaFileTaskRandom(n = 5) {
  const tasks = [];

  for (let i = 0; i < n; i++) {
    const task = {
      id: i + 1,
      arrivalTime: Math.floor(Math.random() * 10),         
      burstTime: Math.floor(Math.random() * 10) + 1,        
      priority: Math.floor(Math.random() * 5) + 1           
    };
    tasks.push(task);
  }

  const fileData = {
    tasks: tasks
  };

  const jsonString = JSON.stringify(fileData, null, 2); 
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tasks.json";
  a.click();

  URL.revokeObjectURL(url); 
}
