let calendarTable = document.getElementById("calendarTable");
let switcherTable = document.getElementById("switcherTable");
let currentMonth = document.getElementById("currentMonth");
let backButton = document.getElementById("back");
let forButton = document.getElementById("forward");
let saveButton = document.getElementById("save");
let clearSaveButton = document.getElementById("clearsave");
let pillDiv = document.getElementById("pill");

let today = new Date();
let month = today.toLocaleString('default', { month: 'long' });
currentMonth.textContent = month.toString()+" "+today.getFullYear().toString();
let todayString = month.toString()+"-"+today.getFullYear().toString();
let currentDate = today;

//formatEx  {July_2020:{2:["yellow","nothing"]}};
let savedItems = JSON.parse(localStorage.getItem("savedItems")) || {};

let pillMode = false;

function save() {
  saveLocal(currentDate.toLocaleString('default', { month: 'long' }),currentDate.getFullYear())
  localStorage.setItem("savedItems",JSON.stringify(savedItems));
  saveButton.textContent = "Saved!";
  setTimeout(() => {saveButton.textContent = "Save";}, 2000);
}
saveButton.addEventListener("click",save);

function clearSave() {
  localStorage.clear();
  clearSaveButton.textContent = "Cleared!";
  setTimeout(() => {clearSaveButton.textContent = "Clear Save";},2000);
}
clearSaveButton.addEventListener("click",clearSave);

function back(){
  saveLocal(currentDate.toLocaleString('default',{ month: 'long'}),currentDate.getFullYear());
  deleteCells();
  currentDate.setMonth(currentDate.getMonth()-1);
  createDayCells(currentDate);
  load(currentDate.toLocaleString('default', {month: 'long'}),currentDate.getFullYear(),savedItems);
  currentMonth.textContent = currentDate.toLocaleString('default', {month: 'long'}).toString()+" "+currentDate.getFullYear().toString();
}
backButton.addEventListener("click",back);

function forward(){
  saveLocal(currentDate.toLocaleString('default',{ month: 'long'}),currentDate.getFullYear());
  deleteCells();
  currentDate.setMonth(currentDate.getMonth()+1);
  createDayCells(currentDate);
  load(currentDate.toLocaleString('default', {month: 'long'}),currentDate.getFullYear(),savedItems);
  currentMonth.textContent = currentDate.toLocaleString('default', {month: 'long'}).toString()+" "+currentDate.getFullYear().toString();
}
forButton.addEventListener("click",forward);

function load(month,year,search){
  for (let day of Array.from(document.getElementsByClassName("day"))) {
    if (search[month+"_"+year.toString()] == undefined) console.log('skip');
    else if (search[month+"_"+year.toString()][day.textContent] != undefined) day.setAttribute("id",search[month+"_"+year][day.textContent][0]);
  }
  if (search[month+"_"+year.toString()] == undefined) console.log('skipPills');
  else if (search[month+"_"+year.toString()]["pills"] != undefined) {
    for (let coord of search[month+"_"+year.toString()]["pills"]){
      let newPill = pillDiv.cloneNode(true);
      newPill.setAttribute("movingpill","2");
      newPill.style.position = "absolute";
      newPill.style.top = coord[0];
      newPill.style.left = coord[1];
      newPill.addEventListener("click", () => {
        document.body.removeChild(newPill);
        saveLocal(currentDate.toLocaleString('default', { month: 'long' }),currentDate.getFullYear());
      });
      document.body.appendChild(newPill);
    }
  }
}

function saveLocal(month,year) {
  let savobj = {};
  let yellow = document.querySelectorAll("#yellow");
  for (let day of yellow) {
    savobj[day.textContent] = ["yellow"];
  }
  let orange = document.querySelectorAll("#orange");
  for (let day of orange) {
    savobj[day.textContent] = ["orange"];
  }
  let red = document.querySelectorAll("#red");
  for (let day of red) {
    savobj[day.textContent] = ["red"];
  }

  let pills = document.querySelectorAll('[movingpill="2"]');
  savobj["pills"] = [];
  for (let pill of pills) {
    savobj["pills"].push([pill.style.top,pill.style.left]);
  }
  savedItems[month+"_"+year.toString()] = savobj;

}

function changeColor(day) {
  if (!pillMode){
    if (day.getAttribute("id") == "none") day.setAttribute("id","yellow");
    else if (day.getAttribute("id") == "yellow") day.setAttribute("id","orange");
    else if (day.getAttribute("id") == "orange") day.setAttribute("id","red");
    else if (day.getAttribute("id") == "red") day.setAttribute("id","none");
  } else {
    pillMode = false;
    pillDiv.addEventListener("click",pillClick);
    let newPill = document.querySelector('[movingpill="1"]');
    newPill.setAttribute("movingPill","2");
    newPill.addEventListener("click",() => {
      document.body.removeChild(newPill);
      saveLocal(currentDate.toLocaleString('default', { month: 'long' }),currentDate.getFullYear());
    });
    document.body.removeEventListener("mousemove",movePill);
  }
}

function createDayCells(givenDate) {
  let calHeight = calendarTable.clientHeight;
  let switcherHeight = switcherTable.clientHeight;
  let bodyHeight = document.body.clientHeight;
  let todayDate = new Date(givenDate.getFullYear(),givenDate.getMonth());
  let weekOne = document.createElement("tr");
  weekOne.setAttribute("class","week");
  for (let i = 0; i < todayDate.getDay(); i++){
    let newDay = document.createElement("td");
    newDay.setAttribute("class","day");
    weekOne.appendChild(newDay);
  }
  for (let i = todayDate.getDay(); i < 7; i++){
    let newDay = document.createElement("td");
    newDay.setAttribute("class","day");
    newDay.setAttribute("notblank","1");
    newDay.textContent = todayDate.getDate();
    weekOne.appendChild(newDay);
    todayDate.setDate(todayDate.getDate()+1);
  }
  calendarTable.appendChild(weekOne);

  let currentMonth = todayDate.getMonth();
  let newWeek;
  while (todayDate.getMonth() == currentMonth) {
    if (todayDate.getDay() == 0) {
      newWeek = document.createElement("tr");
      newWeek.setAttribute("class","week");
      calendarTable.appendChild(newWeek);
    }
    let newDay = document.createElement("td");
    newDay.setAttribute("class","day");
    newDay.setAttribute("notblank","1");
    newDay.textContent = todayDate.getDate();
    todayDate.setDate(todayDate.getDate()+1);
    newWeek.appendChild(newDay);
  }
  if (todayDate.getDay() > 0) {
    for (let i = todayDate.getDay(); i < 7; i++) {
      let newDay = document.createElement("td");
      newDay.setAttribute("class","day");
      newWeek.appendChild(newDay);
    }
  }
  let weeks = document.getElementsByClassName("week");
  for (let week of weeks) {
    week.style.height = (bodyHeight-(calHeight+switcherHeight))/weeks.length-2;
  }
  for (let day of Array.from(document.getElementsByClassName("day"))){
    day.setAttribute("id","none");
    if (day.textContent != "") day.addEventListener("click",() => changeColor(day));
  }

}

function deleteCells() {
  let weeks = document.getElementsByClassName("week");
  for (let weekChild of Array.from(weeks)) {
    calendarTable.removeChild(weekChild);
  }
  let pills = document.querySelectorAll('[movingpill="2"]');
  for (let pill of pills) {
    document.body.removeChild(pill);
  }
}

function movePill(event) {
  let newPill = document.querySelector('[movingpill="1"]');
  newPill.style.top = event.clientY;
  newPill.style.left = event.clientX;
}

function pillClick() {
  pillMode = true;
  let newPill = pillDiv.cloneNode(true);
  newPill.style.position = "absolute";
  newPill.style.top = pillDiv.style.top.toString()+"px";
  newPill.style.top = pillDiv.style.top.toString()+"px";
  newPill.setAttribute("movingpill","1");
  document.body.appendChild(newPill);
  document.body.addEventListener("mousemove",movePill);
  pillDiv.removeEventListener("click",pillClick);
}
pillDiv.addEventListener("click",pillClick);

window.addEventListener("keydown", event => {
  if (event.key == "Escape" && pillMode) {
    pillMode = false;
    pillDiv.addEventListener("click",pillClick);
    let newPill = document.querySelector('[movingpill="1"]');
    document.body.removeChild(newPill);
    document.body.removeEventListener("mousemove",movePill);
  }
});


createDayCells(today);
load(month,today.getFullYear(),savedItems);
