/* -------------------- */
/* LOGIN */
/* -------------------- */

const CORRECT_PASSWORD = "110426";

const loginScreen = document.getElementById("loginScreen");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const app = document.getElementById("app");

loginBtn.onclick = () => {
  if (passwordInput.value === CORRECT_PASSWORD) {
    loginScreen.style.display = "none";
    app.style.display = "block";
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

let currentCard = null;

/* -------------------- */
/* INPUT DATA/HORA */
/* -------------------- */

taskTime.placeholder = "hh:mm ou mm/aa";
taskTime.maxLength = 5;

taskTime.addEventListener("input", () => {
  let value = taskTime.value.replace(/\D/g, "");

  // horário
  if (value.length >= 3) {
    const first2 = parseInt(value.slice(0, 2));

    // se parecer hora -> HH:MM
    if (first2 <= 23) {
      value = value.slice(0, 4);

      if (value.length >= 3) {
        taskTime.value =
          value.slice(0, 2) + ":" + value.slice(2);
      } else {
        taskTime.value = value;
      }

      return;
    }
  }

  // mês/ano -> MM/AA
  value = value.slice(0, 4);

  if (value.length >= 3) {
    taskTime.value =
      value.slice(0, 2) + "/" + value.slice(2);
  } else {
    taskTime.value = value;
  }
});

function isValidTimeOrDate(value) {
  const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const monthRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

  return hourRegex.test(value) ||
         monthRegex.test(value);
}

/* -------------------- */
/* STORAGE */
/* -------------------- */

function saveTasks() {
  localStorage.setItem(
    "kassyaTasks",
    agenda.innerHTML
  );
}

function loadTasks() {
  const saved =
    localStorage.getItem("kassyaTasks");

  if (saved) {
    agenda.innerHTML = saved;
  }

  attachEvents();
  sortTasks();
}

/* -------------------- */
/* MODAL */
/* -------------------- */

function openModal(card = null) {
  currentCard = card;

  if (card) {
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

function closeModalWindow() {
  modal.classList.add("hidden");
  currentCard = null;
}

/* -------------------- */
/* CARD */
/* -------------------- */

function createCard(time, title, message) {
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
/* SORT */
/* -------------------- */

function getSortValue(time) {
  // HH:MM
  if (time.includes(":")) {
    const [h, m] = time.split(":").map(Number);
    return {
      type: 0,
      value: h * 60 + m
    };
  }

  // MM/AA
  if (time.includes("/")) {
    const [month, year] =
      time.split("/").map(Number);

    return {
      type: 1,
      value: year * 100 + month
    };
  }

  return {
    type: 99,
    value: 999999
  };
}

function sortTasks() {
  const cards =
    [...document.querySelectorAll(".card")];

  const pending = cards.filter(
    card =>
      !card.querySelector(
        ".task-checkbox"
      ).checked
  );

  const done = cards.filter(
    card =>
      card.querySelector(
        ".task-checkbox"
      ).checked
  );

  function sortByDate(a, b) {
    const timeA =
      a.querySelector(".time").innerText;

    const timeB =
      b.querySelector(".time").innerText;

    const aVal =
      getSortValue(timeA);

    const bVal =
      getSortValue(timeB);

    if (aVal.type !== bVal.type) {
      return aVal.type - bVal.type;
    }

    return aVal.value - bVal.value;
  }

  pending.sort(sortByDate);
  done.sort(sortByDate);

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

function attachEvents() {

  document
    .querySelectorAll(".card")
    .forEach(card => {

      card.onclick = e => {
        if (
          e.target.classList.contains(
            "task-checkbox"
          )
        ) return;

        openModal(card);
      };
    });

  document
    .querySelectorAll(".task-checkbox")
    .forEach(box => {

      const card =
        box.closest(".card");

      card.classList.toggle(
        "done",
        box.checked
      );

      box.onchange = () => {

        card.classList.toggle(
          "done",
          box.checked
        );

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

saveTaskBtn.onclick = () => {

  const time =
    taskTime.value.trim();

  const title =
    taskTitle.value.trim();

  const message =
    taskMessage.value.trim();

  if (!title) {
    alert("Digite um título 💛");
    return;
  }

  if (time && !isValidTimeOrDate(time)) {
    alert(
      "Digite hh:mm ou mm/aa válido 💛"
    );
    return;
  }

  if (currentCard) {

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
  updateProgress();
  saveTasks();
  closeModalWindow();
};

/* -------------------- */
/* DELETE */
/* -------------------- */

deleteTaskBtn.onclick = () => {
  if (currentCard) {
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
  () => openModal();

closeModal.onclick =
  () => closeModalWindow();

/* -------------------- */
/* PROGRESS */
/* -------------------- */

function updateProgress() {

  const all =
    document.querySelectorAll(
      ".task-checkbox"
    ).length || 1;

  const done =
    document.querySelectorAll(
      ".task-checkbox:checked"
    ).length;

  const percent =
    Math.round(
      (done / all) * 100
    );

  progressFill.style.width =
    percent + "%";

  progressText.innerText =
    percent + "%";
}

/* -------------------- */
/* INIT */
/* -------------------- */

loadTasks();
