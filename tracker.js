let calendarTable = document.getElementById("calendarTable");
let switcherTable = document.getElementById("switcherTable");
let currentMonth = document.getElementById("currentMonth");
let backButton = document.getElementById("back");
let forButton = document.getElementById("forward");

let today = new Date();
let month = today.toLocaleString('default', { month: 'long' });
currentMonth.textContent = month.toString()+" "+today.getFullYear().toString();
let todayString = month.toString()+"-"+today.getFullYear().toString();
let currentDate = today;

//formatEx  {July_2020:{2:["yellow","nothing"]}};
let savedItems = localStorage.getItem("savedItems") || {};
let locallySaved = {July_2020:{2:["yellow","nothing"]}};

function back(){
  saveLocal(currentDate.toLocaleString('default',{ month: 'long'}),currentDate.getFullYear());
  deleteCells();
  currentDate.setMonth(currentDate.getMonth()-1);
  createDayCells(currentDate);
  load(currentDate.toLocaleString('default', {month: 'long'}),currentDate.getFullYear(),locallySaved);
  currentMonth.textContent = currentDate.toLocaleString('default', {month: 'long'}).toString()+" "+currentDate.getFullYear().toString();
}
backButton.addEventListener("click",back);

function forward(){
  saveLocal(currentDate.toLocaleString('default',{ month: 'long'}),currentDate.getFullYear());
  deleteCells();
  currentDate.setMonth(currentDate.getMonth()+1);
  createDayCells(currentDate);
  load(currentDate.toLocaleString('default', {month: 'long'}),currentDate.getFullYear(),locallySaved);
  currentMonth.textContent = currentDate.toLocaleString('default', {month: 'long'}).toString()+" "+currentDate.getFullYear().toString();
}
forButton.addEventListener("click",forward);

function load(month,year,search){
  for (let day of Array.from(document.getElementsByClassName("day"))) {
    if (search[month+"_"+year.toString()] == undefined) console.log('skip');
    else if (search[month+"_"+year.toString()][day.textContent] != undefined) day.setAttribute("id",search[month+"_"+year][day.textContent][0]);
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
  locallySaved[month+"_"+year.toString()] = savobj;

}

function changeColor(day) {
  if (day.getAttribute("id") == "none") day.setAttribute("id","yellow");
  else if (day.getAttribute("id") == "yellow") day.setAttribute("id","orange");
  else if (day.getAttribute("id") == "orange") day.setAttribute("id","red");
  else if (day.getAttribute("id") == "red") day.setAttribute("id","none");
  saveLocal(1,1);
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
    day.addEventListener("click",() => changeColor(day));
  }

}

function deleteCells() {
  let weeks = document.getElementsByClassName("week");
  for (let weekChild of Array.from(weeks)) {
    calendarTable.removeChild(weekChild);
  }
}

createDayCells(today);
load(month,today.getFullYear(),savedItems);
