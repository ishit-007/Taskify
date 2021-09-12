let addbtn = document.querySelector(".add");
let bodyTag = document.querySelector("body");
let colorsArr = ["red", "blue", "pink", "black"];
let deletebtn = document.querySelector(".delete");
if (localStorage.getItem("allTickets") == undefined) {
  let allTickets = {};
  allTickets = JSON.stringify(allTickets);
  localStorage.setItem("allTickets", allTickets);
}
let allcolors = document.querySelectorAll(".filter div");
for (let i = 0; i < allcolors.length; i++) {
  allcolors[i].addEventListener("click", function (e) {
    let filtercolor = e.currentTarget.classList[0];
    loadTasks(filtercolor);
  });
}
loadTasks();
addbtn.addEventListener("click", function () {
  deleteMode = false;
  deletebtn.classList.remove("delete-selected");
  let modalexists = document.querySelector(".modal");
  if (modalexists != null) {
    return;
  }
  let div = document.createElement("div");
  div.classList.add("modal");
  div.innerHTML = `<div class="task-section">
            <div class="task-inner-containner" contenteditable="true"></div>
          </div>
          <div class="priority-section">
            <div class="priority-inner-container">
              <div class="modal-priority red"></div>
              <div class="modal-priority blue"></div>
              <div class="modal-priority pink"></div>
              <div class="modal-priority black selected"></div>
            </div>
          </div>`;
  let ticketcolor = "black";
  let allPriority = div.querySelectorAll(".modal-priority");
  for (let i = 0; i < allPriority.length; i++) {
    allPriority[i].addEventListener("click", function (e) {
      for (let j = 0; j < allPriority.length; j++) {
        allPriority[j].classList.remove("selected");
      }
      e.currentTarget.classList.add("selected");
      ticketcolor = e.currentTarget.classList[1];
    });
  }
  let textbox = div.querySelector(".task-inner-containner");
  let id_unique = uniqueID();
  let task_current = "";
  textbox.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let newdiv = document.createElement("div");
      newdiv.classList.add("ticket");
      newdiv.innerHTML = `<div data-id="${id_unique}"class="ticket-color ${ticketcolor}"></div>
          <div class="ticket-id">${id_unique}</div>
          <div data-id="${id_unique}" class="ticket-actual-task" contenteditable="true">
        ${e.currentTarget.innerText}
          </div>`;
      let tickettaskdiv = newdiv.querySelector(".ticket-actual-task");
      tickettaskdiv.addEventListener("input", function (e) {
        let myID = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        allTickets[myID].task = e.currentTarget.innerText;
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
      });
      task_current = e.currentTarget.innerText;
      let allTickets = JSON.parse(localStorage.getItem("allTickets"));
      let Ticketobj = { color: ticketcolor, task: task_current };
      allTickets[id_unique] = Ticketobj;
      localStorage.setItem("allTickets", JSON.stringify(allTickets));
      let color_section = newdiv.querySelector(".ticket-color");
      color_section.addEventListener("click", function (e) {
        let myID = e.currentTarget.getAttribute("data-id");

        let current_color = e.currentTarget.classList[1];
        let current_color_idx = -1;
        for (let idx = 0; idx < colorsArr.length; idx++) {
          if (current_color == colorsArr[idx]) {
            current_color_idx = idx;
          }
        }
        let new_color_idx = (current_color_idx + 1) % colorsArr.length;
        let new_color = colorsArr[new_color_idx];

        //fetch data from local storage
        let ticketsdata = JSON.parse(localStorage.getItem("allTickets"));
        ticketsdata[myID]["color"] = new_color;
        localStorage.setItem("allTickets", JSON.stringify(ticketsdata));
        e.currentTarget.classList.remove(current_color);
        e.currentTarget.classList.add(new_color);
      });
      let gridTag = document.querySelector(".grid");
      gridTag.append(newdiv);
      newdiv.setAttribute("data-id", id_unique);
      newdiv.addEventListener("click", function (e) {
        if (deleteMode) {
          let allTickets = JSON.parse(localStorage.getItem("allTickets"));
          delete allTickets[e.currentTarget.getAttribute("data-id")];
          localStorage.setItem("allTickets", JSON.stringify(allTickets));
          newdiv.remove();
        }
      });
      div.remove();
    } else if (e.key == "#") {
      div.remove();
    }
  });
  bodyTag.append(div);
});
let deleteMode = false;
deletebtn.addEventListener("click", function (e) {
  if (e.currentTarget.classList.contains("delete-selected")) {
    e.currentTarget.classList.remove("delete-selected");
    deleteMode = false;
  } else {
    e.currentTarget.classList.add("delete-selected");
    deleteMode = true;
  }
});

function loadTasks(color) {
  let ticketsonUI = document.querySelectorAll(".ticket");
  for (let i = 0; i < ticketsonUI.length; i++) {
    ticketsonUI[i].remove();
  }
  let allTickets = JSON.parse(localStorage.getItem("allTickets"));
  for (x in allTickets) {
    let grid = document.querySelector(".grid");
    let curr_ticket_id = x;
    let curr_ticket = allTickets[x];
    if (color && color != curr_ticket.color) {
      continue;
    }
    let newdiv = document.createElement("div");
    newdiv.classList.add("ticket");
    newdiv.innerHTML = `<div data-id="${curr_ticket_id}"class="ticket-color ${curr_ticket.color}"></div>
          <div class="ticket-id">${curr_ticket_id}</div>
          <div data-id="${curr_ticket_id}" class="ticket-actual-task" contenteditable="true">
        ${curr_ticket.task}
          </div>`;
    let color_section = newdiv.querySelector(".ticket-color");
    let tickettaskdiv = newdiv.querySelector(".ticket-actual-task");
    color_section.addEventListener("click", function (e) {
      let myID = e.currentTarget.getAttribute("data-id");

      let current_color = e.currentTarget.classList[1];
      let current_color_idx = -1;
      for (let idx = 0; idx < colorsArr.length; idx++) {
        if (current_color == colorsArr[idx]) {
          current_color_idx = idx;
        }
      }
      let new_color_idx = (current_color_idx + 1) % colorsArr.length;
      let new_color = colorsArr[new_color_idx];

      //fetch data from local storage
      let ticketsdata = JSON.parse(localStorage.getItem("allTickets"));
      ticketsdata[myID]["color"] = new_color;
      localStorage.setItem("allTickets", JSON.stringify(ticketsdata));
      e.currentTarget.classList.remove(current_color);
      e.currentTarget.classList.add(new_color);
    });
    tickettaskdiv.addEventListener("input", function (e) {
      let myID = e.currentTarget.getAttribute("data-id");
      let allTickets = JSON.parse(localStorage.getItem("allTickets"));
      allTickets[myID].task = e.currentTarget.innerText;
      localStorage.setItem("allTickets", JSON.stringify(allTickets));
    });
    newdiv.addEventListener("click", function (e) {
      if (deleteMode) {
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let ticketid = e.currentTarget.querySelector(".ticket-id").innerText;
        delete allTickets[ticketid];
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
        newdiv.remove();
      }
    });
    grid.append(newdiv);
  }
}
