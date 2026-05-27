const agenda =
document.getElementById("agenda");

const addTaskBtn =
document.getElementById("addTaskBtn");

const progressFill =
document.getElementById("progressFill");

const progressText =
document.getElementById("progressText");

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

function attachEvents(){

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

  document
  .querySelectorAll(".editable")
  .forEach(input=>{
    input.addEventListener(
      "input",
      saveTasks
    );
  });

  document
  .querySelectorAll(".delete-btn")
  .forEach(btn=>{
    btn.onclick=()=>{
      btn.closest(".card").remove();
      updateProgress();
      saveTasks();
    };
  });

  updateProgress();
}

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
    (checked / total) * 100
  );

  progressFill.style.width =
  percent + "%";

  progressText.innerText =
  percent + "%";
}

addTaskBtn.addEventListener(
"click",
()=>{

agenda.insertAdjacentHTML(
"beforeend",
`
<div class="card">

<input
type="checkbox"
class="task-checkbox">

<div class="task-content">

<input
class="editable time"
placeholder="Horário">

<input
class="editable"
placeholder="Compromisso">

<input
class="editable"
placeholder="Mensagem fofinha">

<button class="delete-btn">
🗑 apagar
</button>

</div>
</div>
`
);

attachEvents();
saveTasks();

});

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

const reminders = [
{
time:"11:00",
text:"💊 amorrrr hora dos remédios 💛"
},
{
time:"13:00",
text:"🩺 kassytaaa hora da consulta ✨"
},
{
time:"15:00",
text:"💼 entrevista timeee 😌 você consegue"
},
{
time:"20:00",
text:"🌙💊 remédios da noiteee amor"
}
];

setInterval(()=>{

const now =
new Date();

const current =
`${String(
now.getHours()
).padStart(2,'0')}:${String(
now.getMinutes()
).padStart(2,'0')}`;

reminders.forEach(r=>{

if(current===r.time){
sendNotification(r.text);
}

});

},30000);

loadTasks();
