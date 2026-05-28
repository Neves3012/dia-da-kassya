/* -------------------- */
/* LOGIN */
/* -------------------- */

const CORRECT_PASSWORD = "110426";

const loginScreen = document.getElementById("loginScreen");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const app = document.getElementById("app");

/* -------------------- */
/* LOGIN ACTION */
/* -------------------- */

loginBtn.onclick = () => {

  if(passwordInput.value === CORRECT_PASSWORD){
    loginScreen.style.display = "none";
    app.style.display = "block";

    // reorganiza ao entrar
    sortTasks();
  } else {
    loginError.innerText = "senha incorreta 💔";
  }

};

/* -------------------- */
/* APP */
/* -------------------- */

const agenda = document.getElementById("agenda");
const modal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModal = document.getElementById("closeModal");
const saveTaskBtn = document.getElementById("saveTask");
const deleteTaskBtn = document.getElementById("deleteTask");
const taskTime = document.getElementById("taskTime");
const taskTitle = document.getElementById("taskTitle");
const taskMessage = document.getElementById("taskMessage");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const dailyReportBtn = document.getElementById("dailyReportBtn");

let currentCard = null;

/* -------------------- */
/* STORAGE */
/* -------------------- */

function saveTasks(){
  localStorage.setItem("kassyaTasks", agenda.innerHTML);
}

function loadTasks(){

  const saved = localStorage.getItem("kassyaTasks");

  if(saved){
    agenda.innerHTML = saved;
  }

  attachEvents();
  sortTasks();
}

/* -------------------- */
/* MODAL */
/* -------------------- */

function openModal(card = null){

  currentCard = card;

  if(card){
    taskTime.value =
      card.querySelector(".time")?.innerText || "";

    taskTitle.value =
      card.querySelector("h2")?.innerText || "";

    taskMessage.value =
      card.querySelector("p")?.innerText || "";
  } else {
    taskTime.value = "";
    taskTitle.value = "";
    taskMessage.value = "";
  }

  modal.classList.remove("hidden");
}

function closeModalWindow(){
  modal.classList.add("hidden");
  currentCard = null;
}

/* -------------------- */
/* CARD */
/* -------------------- */

function createCard(time, title, message){

  return `
    <div class="card">
      <input type="checkbox" class="task-checkbox">

      <div>
        <span class="time">${time}</span>
        <h2>${title}</h2>
        <p>${message}</p>
      </div>
    </div>
  `;
}

/* -------------------- */
/* ORGANIZAR TAREFAS */
/* -------------------- */

function sortTasks(){

  const cards =
    [...document.querySelectorAll(".card")];

  const pending =
    cards.filter(card =>
      !card.querySelector(".task-checkbox").checked
    );

  const done =
    cards.filter(card =>
      card.querySelector(".task-checkbox").checked
    );

  agenda.innerHTML = "";

  pending.forEach(card =>
    agenda.appendChild(card)
  );

  done.forEach(card =>
    agenda.appendChild(card)
  );

  attachEvents();
  saveTasks();
}

/* -------------------- */
/* EVENTS */
/* -------------------- */

function attachEvents(){

  document.querySelectorAll(".card")
    .forEach(card=>{

    card.onclick = (e)=>{

      if(
        e.target.classList.contains(
          "task-checkbox"
        )
      ) return;

      openModal(card);
    };

  });

  document
    .querySelectorAll(".task-checkbox")
    .forEach(box=>{

      const card =
        box.closest(".card");

      // visual ao carregar
      card.classList.toggle(
        "done",
        box.checked
      );

      box.onchange = ()=>{

        // cinza/riscado
        card.classList.toggle(
          "done",
          box.checked
        );

        // reorganiza
        sortTasks();

        updateProgress();
        saveTasks();
      };

    });

  updateProgress();
}

/* -------------------- */
/* SAVE */
/* -------------------- */

saveTaskBtn.onclick = ()=>{

  const time = taskTime.value;
  const title = taskTitle.value;
  const message = taskMessage.value;

  if(!title) return;

  if(currentCard){

    currentCard.querySelector(
      ".time"
    ).innerText = time;

    currentCard.querySelector(
      "h2"
    ).innerText = title;

    currentCard.querySelector(
      "p"
    ).innerText = message;

  } else {

    agenda.insertAdjacentHTML(
      "beforeend",
      createCard(
        time,
        title,
        message
      )
    );

  }

  attachEvents();
  sortTasks();
  saveTasks();
  updateProgress();
  closeModalWindow();
};

/* -------------------- */
/* DELETE */
/* -------------------- */

deleteTaskBtn.onclick = ()=>{

  if(currentCard){
    currentCard.remove();
    saveTasks();
    updateProgress();
  }

  closeModalWindow();
};

/* -------------------- */
/* BUTTONS */
/* -------------------- */

addTaskBtn.onclick =
  ()=> openModal();

closeModal.onclick =
  ()=> closeModalWindow();

/* -------------------- */
/* PROGRESS */
/* -------------------- */

function updateProgress(){

  const all =
    document.querySelectorAll(
      ".task-checkbox"
    ).length || 1;

  const done =
    document.querySelectorAll(
      ".task-checkbox:checked"
    ).length;

  const percent =
    Math.round((done / all) * 100);

  progressFill.style.width =
    percent + "%";

  progressText.innerText =
    percent + "%";
}

/* -------------------- */
/* WHATSAPP */
/* -------------------- */

dailyReportBtn.onclick = ()=>{

  const cards =
    document.querySelectorAll(
      ".card"
    );

  let report =
    "🌙 Relatório\n\n";

  let done = 0;

  cards.forEach(card=>{

    const checked =
      card.querySelector(
        ".task-checkbox"
      ).checked;

    const title =
      card.querySelector(
        "h2"
      ).innerText;

    if(checked){
      done++;
    }

    report +=
      `${checked ? "✔" : "✘"} ${title}\n`;

  });

  report +=
    `\n${done}/${cards.length} concluídas 💛`;

  const url =
    "https://wa.me/5527988335882?text=" +
    encodeURIComponent(report);

  window.open(url, "_blank");
};

/* -------------------- */
/* INIT */
/* -------------------- */

loadTasks();
