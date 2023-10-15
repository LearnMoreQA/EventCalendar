const holidays = [
  {
    hdate: "01-01-2023",
    holiday: "New Year Day",
  },
  {
    hdate: "15-01-2023",
    holiday: "Pongal",
  },
  {
    hdate: "16-01-2023",
    holiday: "Thiruvalluvar Day",
  },
  {
    hdate: "17-01-2023",
    holiday: "Uzhavar Thirunal",
  },
  {
    hdate: "26-01-2023",
    holiday: "Republic Day",
  },
  {
    hdate: "05-02-2023",
    holiday: "Thai Poosam",
  },
  {
    hdate: "22-03-2023",
    holiday: "Telugu New Year Day",
  },
  {
    hdate: "01-04-2023",
    holiday: "Annual closing of Accounts for Commercial Banks and Co-operative Banks",
  },
  {
    hdate: "04-04-2023",
    holiday: "Mahaveer Jayanthi",
  },
  {
    hdate: "07-04-2023",
    holiday: "Good Friday",
  },
  {
    hdate: "14-04-2023",
    holiday: "Tamil New Years Day and Dr.B.R.Ambedkars Birthday",
  },
  {
    hdate: "22-04-2023",
    holiday: "Ramzan (Idul Fitr)",
  },
  {
    hdate: "01-05-2023",
    holiday: "May Day",
  },
  {
    hdate: "29-06-2023",
    holiday: "Bakrid(Idul Azha)",
  },
  {
    hdate: "29-07-2023",
    holiday: "Muharram",
  },
  {
    hdate: "15-08-2023",
    holiday: "Independence Day",
  },
  {
    hdate: "06-09-2023",
    holiday: "Krishna Jayanthi",
  },
  {
    hdate: "17-09-2023",
    holiday: "Vinayakar Chathurthi",
  },
  {
    hdate: "28-09-2023",
    holiday: "Milad-un-Nabi",
  },
  {
    hdate: "02-10-2023",
    holiday: "Gandhi Jayanthi",
  },
  {
    hdate: "23-10-2023",
    holiday: "Ayutha Pooja",
  },
  {
    hdate: "24-10-2023",
    holiday: "Vijaya Dasami",
  },
  {
    hdate: "12-11-2023",
    holiday: "Deepavali",
  },
  {
    hdate: "25-12-2023",
    holiday: "Christmas",
  },
];
const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
const menuElement = document.querySelector(".contextMenu");
const editEventLink = document.querySelector(".editEventLink");
let selectedDate = '';
let navigation = 0;
let clicked = null;
let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : [];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var imageURL = null;
_currentMenuVisible = null;

function loadCalendar() {
  const dt = new Date();

  if (navigation != 0) {
    dt.setMonth(new Date().getMonth() + navigation);
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  monthBanner.innerText = `${dt.toLocaleDateString("en-us", {
    month: "long",
  })} ${year}`;
  calendar.innerHTML = "";
  const dayInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayofMonth = new Date(year, month, 1);
  const date = firstDayofMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const dayString = date.split(", ")[0];
  const emptyDays = weekdays.indexOf(dayString);

  for (let i = 1; i <= dayInMonth + emptyDays; i++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");
    const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
    const dateVal = i - emptyDays < 10 ? "0" + (i - emptyDays) : i - emptyDays;
    const dateText = `${dateVal}-${monthVal}-${year}`;
    if (i > emptyDays) {
      dayBox.innerText = i - emptyDays;
      //Event Day
      const eventOfTheDay = events.find((e) => e.date == dateText);
      //Holiday
      const holidayOfTheDay = holidays.find((e) => e.hdate == dateText);

      if (i - emptyDays === day && navigation == 0) {
        dayBox.id = "currentDay";
      }

      if (eventOfTheDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventOfTheDay.title;
        dayBox.appendChild(eventDiv);
        menuElement.style.display = "none";
        eventDiv.addEventListener('contextmenu', (e) => {
          eventDiv.setAttribute("date", dateText);
          const eventDate = eventDiv.getAttribute("date");
          if (eventDate === eventOfTheDay.date) {
            selectedDate = eventOfTheDay.date;
            createMenuonRightClick(e.clientX, e.clientY);
            editEventLink.addEventListener("dblclick", () => {
            editModel(dateText);
          })
            btnUpdate.addEventListener("click", () => {
              if(selectedDate === dateText) updateValue(dateText);
          });
            e.preventDefault();
          }
        });
      }

      if (holidayOfTheDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.classList.add("holiday");
        eventDiv.innerText = holidayOfTheDay.holiday;
        dayBox.appendChild(eventDiv);
        menuElement.style.display = "none";
        eventDiv.addEventListener('contextmenu', e => {
          eventDiv.setAttribute("date", dateText);
          if (eventDiv.getAttribute("date") === eventOfTheDay.date) {
            createMenuonRightClick(e.clientX, e.clientY);
            editEventLink.addEventListener("dblclick", () => {
              editModel(eventDiv.getAttribute("date"));
            })
            btnUpdate.addEventListener("click", (e) => {
              updateValue(eventDiv.getAttribute("date"));
            });
            e.preventDefault();
          }
        });
      }

      dayBox.addEventListener("click", () => {
        showModal(dateText);
      });
    } else {
      dayBox.classList.add("plain");
    }
    calendar.append(dayBox);
  }
}

document.addEventListener('click', e => {
  closetheOpenedMenu();
});

function closetheOpenedMenu() {
  if (_currentMenuVisible !== null) {
    closeContextMenu(_currentMenuVisible);
  }
}

function closeContextMenu(menu) {
  menu.style.left = '0px';
  menu.style.top = '0px';
  document.body.removeChild(menu);
  eventDiv.removeAttribute("date");
  _currentMenuVisible = null;
}

function createMenuonRightClick(x, y) {
  closetheOpenedMenu();
  menuElement.style.display = 'block';
  menuElement.style.left = x + "px";
  menuElement.style.top = y + "px";
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      imageURL = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

document.querySelector("#imageUpload").addEventListener("change", function () {
  readURL(this);
});

function buttons() {
  const btnBack = document.querySelector("#btnBack");
  const btnNext = document.querySelector("#btnNext");
  const btnDelete = document.querySelector("#btnDelete");
  const btnSave = document.querySelector("#btnSave");
  const closeButtons = document.querySelectorAll(".btnClose");
  const txtTitle = document.querySelector("#txtTitle");
  const txtDesc = document.querySelector("#txtDesc");
  const txtType = document.querySelector("#txtType");
  const checkbox = document.querySelector("#txtCheckBox");
  const showTimecheckbox = document.querySelector("#showTime");
  const startTime = document.querySelector(".vTimeStart");
  const endTime = document.querySelector(".vTimeEnd");
  const multiCheckbox = document.querySelector("#inputCheckbox");

  btnBack.addEventListener("click", () => {
    navigation--;
    loadCalendar();
  });
  btnNext.addEventListener("click", () => {
    navigation++;
    loadCalendar();
  });
  modal.addEventListener("click", closeModal);
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  btnDelete.addEventListener("click", function () {
    events = events.filter((e) => e.date !== clicked);
    let deleteText = prompt("Please enter the text of  'delete' ");
    if (deleteText == "delete") {
    localStorage.setItem("events", JSON.stringify(events));
    }
    closeModal();
  });

  btnSave.addEventListener("click", function () {
    if (txtTitle.value) {
      txtTitle.classList.remove("error");
      events.push({
        date: clicked,
        title: txtTitle.value.trim(),
        desc: txtDesc.value.trim(),
        type: txtType.value.trim(),
        time: checkbox.value.trim(),
        specificTime: showTimecheckbox.value.trim(),
        sTime: startTime.value.trim(),
        eTime: endTime.value.trim(),
        chOPtion: multiCheckbox.value.trim(),
        imagepath: imageURL,
      });
      txtTitle.value = "";
      txtDesc.value = "";
      txtType.value = "";
      checkbox.value = "";
      multiCheckbox.value = "";
      localStorage.setItem("events", JSON.stringify(events));
      alert("Saved Succeesfully");
      closeModal();
      location.reload();
    } else {
      txtTitle.classList.add("error");
    }
  });
}

const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");
const editEventForm = document.querySelector("#editEvent");

//============= Edit ================

const btnUpdate = document.querySelector("#edit_btn_update");
const closeBtn = document.querySelectorAll(".btnClose");
const editTxtTitle = document.querySelector("#edit_txt_Title");
const editTxtDesc = document.querySelector("#edit_txt_Desc");

function editModel(dateText) {
  viewEventForm.style.display = "none";
  addEventForm.style.display = "none";
  editEventForm.style.display = "block";
  const eventOfTheDay = events.find((e) => e.date == dateText);
  if (eventOfTheDay) {
    editTxtTitle.value = eventOfTheDay.title;
    editTxtTitle.setAttribute("disabled", "disabled");
    editTxtDesc.value = eventOfTheDay.desc;
  }
}

function editButton() {
  modal.addEventListener("click", closeModal);
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
}

function updateValue(dateText) {
  clicked = dateText;
  const eventOfTheDay = events.find((e) => e.date == selectedDate);
  eventOfTheDay.desc = (eventOfTheDay.desc !== editTxtDesc.value.trim()) ? editTxtDesc.value.trim() : eventOfTheDay.desc;
   if (confirm("Do you want to save changes?") == true) {
     localStorage.setItem("events", JSON.stringify(events));
   }
  closeModal();
}
//=============================
function showModal(dateText) {
  clicked = dateText;
  const eventOfTheDay = events.find((e) => e.date == dateText);
  if (eventOfTheDay) {
    //Event already Preset
    document.querySelector("#eventText").innerText = eventOfTheDay.title;
    document.querySelector("#eventDesc").innerText = eventOfTheDay.desc;
    document.querySelector("#eventType").innerText = eventOfTheDay.type;
    document.querySelector("#multiOption").innerText = eventOfTheDay.chOPtion;
    if (eventOfTheDay.imagepath != null) {
      document.querySelector("#imagePreview").removeAttribute('style', 'background-image: url(profile.png);');
      document.querySelector("#imagePreview").setAttribute('style', 'background-image: url(' + eventOfTheDay.imagepath + ');');
    } else {
      document.querySelector("#imagePreview").setAttribute('style', 'background-image: url(profile.png);');
    }
    if (eventOfTheDay.specificTime == "checked") {
      document.querySelector("#eventTimeSlot").innerText = eventOfTheDay.sTime + " - " + eventOfTheDay.eTime;
    } else {
      document.querySelector("#eventTimeSlot").innerText = "All Day";
      document.querySelector("#eventTimeSlot").setAttribute('style', 'background-color:green;color:#fff;border-radius:3px;padding:5px;width:9vw;text-align:center');
    }
    viewEventForm.style.display = "block";
  } else {
    addEventForm.style.display = "block";
  }
  modal.style.display = "block";
}

//Close Modal
function closeModal() {
  txtTitle.classList.remove("error");
  viewEventForm.style.display = "none";
  addEventForm.style.display = "none";
  editEventForm.style.display = "none";
  modal.style.display = "none";
  clicked = null;
  loadCalendar();
}

const inputField = document.querySelector('.chosen-value');
const dropdown = document.querySelector('.value-list');
const dropdownArray = [...document.querySelectorAll('li')];

dropdown.classList.add('open');
inputField.focus();
let valueArray = [];
dropdownArray.forEach(item => {
  valueArray.push(item.textContent);
});


const closeDropdown = () => {
  dropdown.classList.remove('open');
}

inputField.addEventListener('input', () => {
  dropdown.classList.add('open');
  let inputValue = inputField.value.toLowerCase();
  let valueSubstring;
  if (inputValue.length > 0) {
    for (let j = 0; j < valueArray.length; j++) {
      if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
        dropdownArray[j].classList.add('closed');
      } else {
        dropdownArray[j].classList.remove('closed');
      }
    }
  } else {
    for (let i = 0; i < dropdownArray.length; i++) {
      dropdownArray[i].classList.remove('closed');
    }
  }
});

dropdownArray.forEach(item => {
  item.addEventListener('click', (evt) => {
    inputField.value = item.textContent;
    dropdownArray.forEach(dropdown => {
      dropdown.classList.add('closed');
    });
  });
})

inputField.addEventListener('focus', () => {
  dropdown.classList.add('open');
  dropdownArray.forEach(dropdown => {
    dropdown.classList.remove('closed');
  });
});

inputField.addEventListener('blur', () => {
  dropdown.classList.remove('open');
});

document.addEventListener('click', (evt) => {
  const isDropdown = dropdown.contains(evt.target);
  const isInput = inputField.contains(evt.target);
  if (!isDropdown && !isInput) {
    dropdown.classList.remove('open');
  } else {
    dropdown.style.display = "block";
  }
});

function toggleRadioField() {
  var multiselect = document.getElementById("combobox");
  var yesCheck = document.getElementById("selectYes");
  var noCheck = document.getElementById("selectNo");
  if (yesCheck.checked) {
    yesCheck.value = "checked";
    noCheck.value = "";
    multiselect.style.display = "block";
    multiselect.removeAttribute("hidden");
  } else if (noCheck.checked) {
    noCheck.value = "checked";
    yesCheck.value = "";
    multiselect.style.display = "none";
  } else {
    noCheck.value = "";
    yesCheck.value = "";
    multiselect.style.display = "none";
  }
}

function validateTimeField() {
  var currentStartTimeValue = document.querySelector('.vTimeStart').value;
  var currentEndTimeValue = document.querySelector('.vTimeEnd').value;
  if (!currentStartTimeValue) {
    document.getElementById("timeFieldErrorMsg").setAttribute('style', 'color:#ff0000');
    document.getElementById("timeFieldErrorMsg").innerText = "Enter value for Start Time";
  } else if (!currentEndTimeValue) {
    document.getElementById("timeFieldErrorMsg").setAttribute('style', 'color:#ff0000');
    document.getElementById("timeFieldErrorMsg").innerText = "Enter value for End Time";
  } else if (currentStartTimeValue >= currentEndTimeValue) {
    document.getElementById("timeFieldErrorMsg").setAttribute('style', 'color:#ff0000');
    document.getElementById("timeFieldErrorMsg").innerText = "Current StartTime must be lesser than current EndTime";
  } else {
    document.getElementById("timeFieldErrorMsg").setAttribute('style', 'color:#fff');
  }
}

function showOptions(e) {
  let divOptions = document.getElementById("divOptions");
  let checkboxContainer = document.getElementById("chkboxContainer");
  if (divOptions.style.display == "none" || divOptions.style.display == "") {
    divOptions.style.display = "inline-block";
    checkboxContainer.style = "margin-top: 95px;";
  } else {
    divOptions.style.display = "none";
  }
}
function clickMe(e) {
  e.stopPropagation();
}
function hideOptions(e) {
  let divOptions = document.getElementById("divOptions");
  let checkboxContainer = document.getElementById("chkboxContainer");
  if (divOptions.contains(e.target)) {
    divOptions.style.display = "inline-block";

  } else {
    divOptions.style.display = "none";
    checkboxContainer.style = "margin-top: 15px;";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let checkbox = document.querySelectorAll("#divOptions input");
  let inputCheckbox = document.getElementById("inputCheckbox");

  for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener("change", (e) => {
      if (e.target.checked == true) {
        if (inputCheckbox.value == "") {
          inputCheckbox.value = checkbox[i].value;
        } else {
          inputCheckbox.value += `,${checkbox[i].value}`;
        }
      } else {
        let values = inputCheckbox.value.split(",");

        for (let r = 0; r < values.length; r++) {
          if (values[r] == e.target.value) {
            values.splice(r, 1);
          }
        }
        inputCheckbox.value = values;
      }
    });
  }
});

document.addEventListener("click", () => {
  var fullTimeCheckbox = document.getElementById("txtCheckBox");
  var specificTimeCheckbox = document.getElementById("showTime");
  var timeField = document.getElementById("timeField");
  if (specificTimeCheckbox.checked) {
    document.getElementById("showTime").setAttribute("checked", "");
    document.getElementById("showTime").setAttribute("value", "checked");
    document.getElementById("txtCheckBox").removeAttribute("checked");
    timeField.style.display = "block";
  } else {
    document.getElementById("showTime").removeAttribute("checked");
    document.getElementById("txtCheckBox").setAttribute("checked", "");
    document.getElementById("showTime").removeAttribute("value", "checked");
    timeField.style.display = "none";
  }
});
buttons();
editButton();
loadCalendar();