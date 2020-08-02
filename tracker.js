let calendarTable = document.getElementById("calendarTable");
let switcherTable = document.getElementById("switcherTable");
let currentMonth = document.getElementById("currentMonth");

let today = new Date();
let month = today.toLocaleString('default', { month: 'long' });
currentMonth.textContent = month.toString()+" "+today.getFullYear().toString();
let todayString = month.toString()+"-"+today.getFullYear().toString();

//formatEx  {Aug-2020:{2:["mild","nothing"]},{25:["bad","ibuprofen"]}};
let savedItems = localStorage.getItem("savedItems") || {todayString};

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
    newDay.textContent = todayDate.getDate();
    todayDate.setDate(todayDate.getDate()+1);
    newWeek.appendChild(newDay);
  }
  for (let i = todayDate.getDay(); i < 7; i++) {
    let newDay = document.createElement("td");
    newDay.setAttribute("class","day");
    newWeek.appendChild(newDay);
  }
  let weeks = document.getElementsByClassName("week");
  for (let week of weeks) {
    week.style.height = (bodyHeight-(calHeight+switcherHeight))/weeks.length-2;
  }

}

createDayCells(today);
