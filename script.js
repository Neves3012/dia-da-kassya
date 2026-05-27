const checkboxes =
document.querySelectorAll(".task-checkbox");

const progressFill =
document.getElementById("progressFill");

const progressText =
document.getElementById("progressText");

checkboxes.forEach(box=>{
  box.addEventListener("change", updateProgress);
});

function updateProgress(){

  const checked =
  document.querySelectorAll(
    ".task-checkbox:checked"
  ).length;

  const total = checkboxes.length;

  const percent =
  Math.round((checked / total) * 100);

  progressFill.style.width =
  percent + "%";

  progressText.innerText =
  percent + "%";
}

async function askPermission(){
  if(Notification.permission !== "granted"){
    await Notification.requestPermission();
  }
}

askPermission();

function sendNotification(text){

  if(Notification.permission==="granted"){
    new Notification("🌙 Dia da Kassya",{
      body:text
    });
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

const now = new Date();

const current =
`${String(now.getHours())
.padStart(2,'0')}:${String(
now.getMinutes())
.padStart(2,'0')}`;

reminders.forEach(r=>{
  if(current===r.time){
    sendNotification(r.text);
  }
});

},30000);
