
const tasks = [
  { id: "P1", arrival: 0, burst: 20, priority: 1 },
  { id: "P2", arrival: 8, burst: 5, priority: 2 },
  { id: "P3", arrival: 3, burst: 12, priority: 3 },
  { id: "P4", arrival: 10, burst: 6, priority: 4 },
  { id: "P5", arrival: 7, burst: 8, priority: 5 },
];

// ---------- ALGORITMI ----------

// FCFS
function fcfs(tasks) {
  let time = 0;
  let result = [];
  const sorted = [...tasks].sort((a, b) => a.arrival - b.arrival);
  for (let t of sorted) {
    if (time < t.arrival) time = t.arrival;
    let start = time;
    let end = start + t.burst;
    time = end;
    result.push({ id: t.id, start, end, waiting: start - t.arrival, turnaround: end - t.arrival });
  }
  return result;
}

// SJF (non preemptive)
function sjf(tasks) {
  let time = 0;
  let done = [];
  let remaining = [...tasks];
  while (remaining.length > 0) {
    let available = remaining.filter(t => t.arrival <= time);
    if (available.length === 0) {
      time++;
      continue;
    }
    available.sort((a, b) => a.burst - b.burst);
    let t = available[0];
    remaining = remaining.filter(x => x.id !== t.id);
    let start = time;
    let end = start + t.burst;
    time = end;
    done.push({ id: t.id, start, end, waiting: start - t.arrival, turnaround: end - t.arrival });
  }
  return done;
}

// Round Robin
function rr(tasks, quantum = 3) {
  let time = 0;
  let queue = [];
  let remaining = tasks.map(t => ({ ...t, rem: t.burst }));
  let result = [];

  while (remaining.length > 0 || queue.length > 0) {
    for (let t of remaining) {
      if (t.arrival <= time && !queue.includes(t)) queue.push(t);
    }
    remaining = remaining.filter(t => !queue.includes(t));

    if (queue.length === 0) {
      time++;
      continue;
    }

    let t = queue.shift();
    let start = time;
    let exec = Math.min(quantum, t.rem);
    t.rem -= exec;
    time += exec;
    if (t.rem > 0) {
      for (let newT of remaining) {
        if (newT.arrival <= time && !queue.includes(newT)) queue.push(newT);
      }
      queue.push(t);
    } else {
      result.push({ id: t.id, start, end: time, waiting: time - t.arrival - t.burst, turnaround: time - t.arrival });
    }
  }
  return result;
}

// Priority Scheduling (non preemptive)
function priorityScheduling(tasks) {
  let time = 0;
  let done = [];
  let remaining = [...tasks];
  while (remaining.length > 0) {
    let available = remaining.filter(t => t.arrival <= time);
    if (available.length === 0) {
      time++;
      continue;
    }
    available.sort((a, b) => a.priority - b.priority);
    let t = available[0];
    remaining = remaining.filter(x => x.id !== t.id);
    let start = time;
    let end = start + t.burst;
    time = end;
    done.push({ id: t.id, start, end, waiting: start - t.arrival, turnaround: end - t.arrival });
  }
  return done;
}

// ---------- VISUALIZZAZIONE ----------

function creaGantt(result, container) {
  const gantt = document.createElement("div");
  gantt.className = "gantt";

  const colors = {};
  const palette = ["#ff7675", "#74b9ff", "#55efc4", "#fdcb6e", "#a29bfe", "#fab1a0", "#81ecec", "#ffeaa7"];

  let totalTime = Math.max(...result.map(r => r.end));
  for (let r of result) {
    if (!colors[r.id]) colors[r.id] = palette[Object.keys(colors).length % palette.length];
  }

  for (let r of result) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.textContent = r.id;
    bar.style.backgroundColor = colors[r.id];
    bar.style.width = ((r.end - r.start) / totalTime) * 100 + "%";
    gantt.appendChild(bar);
  }

  container.appendChild(gantt);
}

function mostraRisultato(nome, dati, container) {
  const section = document.createElement("div");
  section.className = "algorithm";

  const title = document.createElement("h2");
  title.textContent = nome;
  section.appendChild(title);

  creaGantt(dati, section);

  const table = document.createElement("table");
  const head = `<tr><th>Processo</th><th>Start</th><th>End</th><th>Waiting</th><th>Turnaround</th></tr>`;
  table.innerHTML = head + dati.map(r =>
    `<tr><td>${r.id}</td><td>${r.start}</td><td>${r.end}</td><td>${r.waiting}</td><td>${r.turnaround}</td></tr>`
  ).join("");
  section.appendChild(table);

  container.appendChild(section);
}

// ---------- MAIN ----------
document.getElementById("simulateBtn").addEventListener("click", () => {
  const q = parseInt(document.getElementById("quantum").value);
  const resDiv = document.getElementById("results");
  resDiv.innerHTML = "";

  mostraRisultato("FCFS", fcfs(tasks), resDiv);
  mostraRisultato("SJF", sjf(tasks), resDiv);
  mostraRisultato(`Round Robin (q=${q})`, rr(tasks, q), resDiv);
  mostraRisultato("Priority Scheduling", priorityScheduling(tasks), resDiv);
});
