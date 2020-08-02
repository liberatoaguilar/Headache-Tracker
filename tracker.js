let calendarTable = document.getElementById("calendarTable");
let switcherTable = document.getElementById("switcherTable");
let currentMonth = document.getElementById("currentMonth");

let today = new Date();
let month = today.toLocaleString('default', { month: 'long' });
currentMonth.textContent = month.toString()+" "+today.getFullYear().toString();
let todayString = month.toString()+"-"+today.getFullYear().toString();

//formatEx  {Aug-2020:{2:["mild","nothing"]},{25:["bad","ibuprofen"]}};
let savedItems = localStorage.getItem("savedItems") || {todayString};

function createDayCells() {
  let calHeight = calendarTable.clientHeight;
  let switcherHeight = switcherTable.clientHeight;
  let bodyHeight = document.body.clientHeight;
  for (let i = 0; i < 6; i++) {
    let newWeek = document.createElement("tr");
    newWeek.setAttribute("id","week-"+i.toString());
    for (let x = 0; x < 7; x++) {
      let newDay = document.createElement("td");
      newDay.setAttribute("id","day-"+x.toString());
      newDay.style.height = (bodyHeight-(calHeight+switcherHeight))/6-2;
      newWeek.appendChild(newDay);
    }
    calendarTable.appendChild(newWeek);
  }
}

createDayCells();
