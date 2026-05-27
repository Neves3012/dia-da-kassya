const agenda =
document.getElementById("agenda");

const modal =
document.getElementById("taskModal");

const addTaskBtn =
document.getElementById("addTaskBtn");

const closeModal =
document.getElementById("closeModal");

const saveTaskBtn =
document.getElementById("saveTask");

const deleteTaskBtn =
document.getElementById("deleteTask");

const taskTime =
document.getElementById("taskTime");

const taskTitle =
document.getElementById("taskTitle");

const taskMessage =
document.getElementById("taskMessage");

const progressFill =
document.getElementById("progressFill");

const progressText =
document.getElementById("progressText");

let currentCard = null;

/* -------------------- */
/* LOCAL STORAGE */
/* -------------------- */

function saveTasks(){

  localStorage.setItem(
    "kassyaTasks",
    agenda.innerHTML
  );
}

function loadTasks(){

  const saved =
  localStorage.getItem(
    "kassyaTasks"
  );

  if(saved){
    agenda.innerHTML = saved;
  }

  attachEvents();
}

/* -------------------- */
/* MODAL */
/* -------------------- */

function openModal(card=null){

  currentCard = card;

  if(card){

    taskTime.value =
    card.querySelector(".time")
    ?.innerText || "";

    taskTitle.value =
    card.querySelector("h2")
    ?.innerText || "";

    taskMessage.value =
    card.querySelector("p")
    ?.innerText || "";

    deleteTaskBtn.style.display =
    "block";

  }else{

    taskTime.value = "";
    taskTitle.value = "";
    taskMessage.value = "";

    deleteTaskBtn.style.display =
    "none";
  }

  modal.classList.remove(
    "hidden"
  );
}

function closeModalWindow(){

  modal.classList.add(
    "hidden"
  );

  currentCard = null;
}

/* -------------------- */
/* CARDS */
/* -------------------- */

function createCard(
time,
title,
message,
checked=false
){

  return `
  <div class="card">

    <input
      type="checkbox"
      class="task-checkbox"
      ${checked ? "checked" : ""}
    >

    <div class="task-content">

      <span class="time">
        ${time}
      </span>

      <h2>
        ${title}
      </h2>

      <p>
        ${message}
      </p>

    </div>

  </div>
  `;
}

/* -------------------- */
/* EVENTOS */
/* -------------------- */

function attachEvents(){

  const cards =
  document.querySelectorAll(
    ".card"
  );

  cards.forEach(card=>{

    card.onclick=(e)=>{

      if(
      e.target.classList.contains(
      "task-checkbox"
      )
      ) return;

      openModal(card);
    };
  });

  const checkboxes =
  document.querySelectorAll(
    ".task-checkbox"
  );

  checkboxes.forEach(box=>{

    box.addEventListener(
      "change",
      ()=>{
        updateProgress();
        saveTasks();
      }
    );
  });

  updateProgress();
}

saveTaskBtn.onclick=()=>{

  const time =
  taskTime.value.trim();

  const title =
  taskTitle.value.trim();

  const message =
  taskMessage.value.trim();

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

  }else{

    agenda.insertAdjacentHTML(
      "beforeend",
      createCard(
        time,
        title,
        message
      )
    );

    attachEvents();
  }

  saveTasks();
  updateProgress();
  closeModalWindow();
};

deleteTaskBtn.onclick=()=>{

  if(currentCard){

    currentCard.remove();

    saveTasks();
    updateProgress();
  }

  closeModalWindow();
};

addTaskBtn.onclick=()=>{

  openModal();
};

closeModal.onclick=()=>{

  closeModalWindow();
};

modal.onclick=(e)=>{

  if(e.target===modal){
    closeModalWindow();
  }
};

/* -------------------- */
/* PROGRESSO */
/* -------------------- */

function updateProgress(){

  const checkboxes =
  document.querySelectorAll(
    ".task-checkbox"
  );

  const checked =
  document.querySelectorAll(
    ".task-checkbox:checked"
  ).length;

  const total =
  checkboxes.length || 1;

  const percent =
  Math.round(
    (checked/total)*100
  );

  progressFill.style.width =
  percent+"%";

  progressText.innerText =
  percent+"%";
}

/* -------------------- */
/* NOTIFICAÇÕES */
/* -------------------- */

async function askPermission(){

  if(
    Notification.permission
    !=="granted"
  ){
    await Notification
    .requestPermission();
  }
}

askPermission();

function sendNotification(text){

  if(
    Notification.permission
    ==="granted"
  ){
    new Notification(
      "🌙 Dia da Kassya",
      {
        body:text
      }
    );
  }
}

const sentNotifications =
new Set();

setInterval(()=>{

  const now =
  new Date();

  const current =
  `${String(
    now.getHours()
  ).padStart(2,'0')}:${String(
    now.getMinutes()
  ).padStart(2,'0')}`;

  document
  .querySelectorAll(".card")
  .forEach(card=>{

    const time =
    card.querySelector(".time")
    ?.innerText
    ?.trim();

    const title =
    card.querySelector("h2")
    ?.innerText
    ?.trim();

    if(
      !time ||
      time==="A definir"
    ) return;

    const key =
    `${current}-${title}`;

    if(
      time===current &&
      !sentNotifications.has(
        key
      )
    ){

      sendNotification(
        `💛 ${title}`
      );

      sentNotifications.add(
        key
      );
    }
  });

},30000);

/* -------------------- */
/* INIT */
/* -------------------- */

loadTasks();
