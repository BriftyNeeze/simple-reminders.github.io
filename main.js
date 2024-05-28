
window.addEventListener("DOMContentLoaded", e => {
    document.getElementById('createbutton').addEventListener('click', createReminder);
    document.getElementById("startdelete").addEventListener('click', enableDelete);
    document.getElementById("deleteselected").addEventListener('click', deleteItems);
    document.getElementById("cancel").addEventListener('click', closeCreate);
    document.getElementById("create").addEventListener('click', addTask);
    document.getElementById("quickview").addEventListener('click', function() {
        changeRemindersTab(this, "All")
    })
    document.getElementById("boardview").addEventListener('click', function() {
        changeRemindersTab(this, "Board")
    })
    document.getElementById("datesort").addEventListener('click', sortByDate);
    document.getElementById("completionsort").addEventListener('click', sortByCompleted);
    changeRemindersTab(document.getElementById("quickview"), "All");
})

function test() {
    console.log("hi");
}

function onLoad() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("check")) {
            const data = localStorage.getItem(localStorage.key(i)).split("\\");
            const taskList = document.getElementById("tasklist");
            const tBody = taskList.getElementsByTagName('tbody')[0];
            const row = tBody.insertRow();
            const status = row.insertCell(0);
            status.setAttribute("style", "text-align: center;");
            const task = row.insertCell(1);
            const date = row.insertCell(2);
            const checkBox = document.createElement("button");
            checkBox.className = "statuscheck";
            if (data[2] == "2") {
                console.log("debug");
                checkBox.classList.toggle("completedtask");
            }
            // console.log(checkBox.className);
            checkBox.setAttribute("id", localStorage.key(i));
            checkBox.addEventListener('click', updateTaskStatus);
            status.appendChild(checkBox);
            task.innerHTML = data[0];
            const timeDate = new Date(data[1]);
            date.innerHTML = timeDate.toDateString() + " " + timeDate.toTimeString().substring(0, 8);
        }
    }

    
}


function changeRemindersTab(item, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("reminderstab");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("switchtabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    item.className += " active";
}

const remindersList = [];

function createReminder() {
    document.getElementById("creating1").style.display = "block";
}

function closeCreate() {
    document.getElementById("creating1").style.display = "none";
    document.getElementById("reminder1").value="";
    document.getElementById("date1").value="";
}

function addTask() {
    if (document.getElementById("reminder1").value != '' && document.getElementById("date1").value != '') {
        //remindersList.push([document.getElementById(task).value, document.getElementById(date).value, 0])
        updateList([document.getElementById("reminder1").value, document.getElementById("date1").value, 0]);
        closeCreate();
    }
}



function updateList(data) {
    const taskList = document.getElementById("tasklist");
    const tBody = taskList.getElementsByTagName('tbody')[0];
    const row = tBody.insertRow();
    const status = row.insertCell(0);
    status.setAttribute("style", "text-align: center;");
    const task = row.insertCell(1);
    const date = row.insertCell(2);
    const checkBox = document.createElement("button");
    checkBox.className = "statuscheck";
    for (let i = 0; i < localStorage.length+1; i++) {
        if (localStorage.getItem("check" + i) == null) {
            checkBox.setAttribute("id", "check" + (localStorage.length));
            break;
        }
    }

    checkBox.addEventListener('click', updateTaskStatus);
    data[0].replaceAll("\\", " ");
    localStorage.setItem(checkBox.id, data[0] + "\\" + data[1] + "\\" + data[2]);
    status.appendChild(checkBox);
    
    task.innerHTML = data[0];
    const timeDate = new Date(data[1]);
    date.innerHTML = timeDate.toDateString() + " " + timeDate.toTimeString().substring(0, 8);
}
// useless right now
function updateTaskStatus(event) {
    console.log(localStorage.getItem(event.currentTarget.id));
    event.currentTarget.classList.toggle("completedtask");
    // if (remindersList[event.currentTarget.id.substring(5)][2] == 0) {
    //     remindersList[event.currentTarget.id.substring(5)][2] = 2;
    // } else {
    //     remindersList[parseInt(event.currentTarget.id.substring(5))][2] = 0;
    // }
    let newData = localStorage.getItem(event.currentTarget.id).split("\\");
    if (newData[2] == "0") {
        newData[2] = "2";
    } else {
        newData[2] = "0";
    }
    localStorage.setItem(event.currentTarget.id, newData[0] + "\\" + newData[1] + "\\" + newData[2]);
}

// Deleting functions

let deleting = false;
function enableDelete() {
    const mainDeleteButton = document.getElementById("startdelete");
    const taskList = document.getElementById("tasklist");
    document.getElementById("createbutton").classList.toggle("unclickable");
    closeCreate();
    // td next
    const rows = taskList.getElementsByTagName('tbody')[0].getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.toggle("deletable");
    }
    deleting = !deleting;
    if (deleting) {
        document.getElementById("deleteselected").style.display = "block";
        for (let i = 0; i < rows.length; i++) {
            //rows[i].setAttribute("onclick", "selectedToDelete(event)");
            rows[i].addEventListener('click', selectedToDelete);
        }
        mainDeleteButton.innerHTML = "Cancel";
    } else {
        document.getElementById("deleteselected").style.display = "none";
        for (let i = 0; i < rows.length; i++) {
            //rows[i].setAttribute("onclick", "");
            rows[i].removeEventListener('click', selectedToDelete);
            if (rows[i].classList.contains("selectedtodelete")) {
                rows[i].classList.toggle("selectedtodelete");
            }
        }
        mainDeleteButton.innerHTML = "Delete";
        deleteList.clear();
    }
}

const deleteList = new Set();
function selectedToDelete(event) {
    if (event.currentTarget.classList.contains("selectedtodelete")) {
        event.currentTarget.classList.toggle("selectedtodelete");
        deleteList.delete(event.currentTarget);
    } else {
        event.currentTarget.classList.toggle("selectedtodelete");
        deleteList.add(event.currentTarget);
    }
    console.log(deleteList);
    document.getElementById("deleteselected").innerHTML = "Delete Selected (" + deleteList.size + ")";
}

function deleteItems() {
    const taskList = document.getElementById("tasklist");
    const tBody = taskList.getElementsByTagName('tbody')[0];
    document.getElementById("deleteselected").innerHTML = "Delete Selected (0)";
    for (const item of deleteList) {
        const storageKey = item.getElementsByTagName("td")[0].getElementsByTagName("button")[0].id;
        
        //console.log(item, storageKey);
        localStorage.removeItem(storageKey);
        tBody.removeChild(item);
    }
    enableDelete();
}

function sortByDate() {
    const rows = document.getElementById("tasklist").getElementsByTagName('tbody')[0].getElementsByTagName("tr");
    const items = [];
    for (let i = 0; i < rows.length; i++) {
        items.push(localStorage.getItem(rows[i].getElementsByClassName("statuscheck")[0].id).split("\\"));
        items[i].push(rows[i].getElementsByClassName("statuscheck")[0].id)
        items[i][1] = new Date(items[i][1]);
    }
    console.log(items);
    for (let i = 0; i < items.length; i++) {
        for (let j = 1; j < items.length-i; j++) {
            if (items[j-1][1].getTime() > items[j][1].getTime()) {
                const temp = items[j-1];
                items[j-1] = items[j];
                items[j] = temp;
            }
        }
    }
    const tBody = document.createElement('tbody');
    
    const taskList = document.getElementById("tasklist");
    for (let i = 0; i < items.length; i++) {
        
        const row = tBody.insertRow();
        const status = row.insertCell(0);
        status.setAttribute("style", "text-align: center;");
        const task = row.insertCell(1);
        const date = row.insertCell(2);
        const checkBox = document.createElement("button");
        checkBox.className = "statuscheck";
        if (items[i][2] == 2) {
            checkBox.classList.toggle("completedtask");
        }
        checkBox.addEventListener('click', updateTaskStatus);
        checkBox.setAttribute('id', items[i][3]);
        status.appendChild(checkBox);
        task.innerHTML = items[i][0];
        const timeDate = items[i][1];
        date.innerHTML = timeDate.toDateString() + " " + timeDate.toTimeString().substring(0, 8);
    }
    taskList.getElementsByTagName('tbody')[0].parentNode.replaceChild(tBody, taskList.getElementsByTagName('tbody')[0]); 
    
}

function sortByCompleted() {
    const rows = document.getElementById("tasklist").getElementsByTagName('tbody')[0].getElementsByTagName("tr");
    const items = [];
    for (let i = 0; i < rows.length; i++) {
        items.push(localStorage.getItem(rows[i].getElementsByClassName("statuscheck")[0].id).split("\\"));
        items[i].push(rows[i].getElementsByClassName("statuscheck")[0].id)
        items[i][1] = new Date(items[i][1]);
    }
    console.log(items);
    for (let i = 0; i < items.length; i++) {
        for (let j = 1; j < items.length-i; j++) {
            if (items[j-1][2] > items[j][2]) {
                const temp = items[j-1];
                items[j-1] = items[j];
                items[j] = temp;
            }
        }
    }
    const tBody = document.createElement('tbody');
    
    const taskList = document.getElementById("tasklist");
    for (let i = 0; i < items.length; i++) {
        
        const row = tBody.insertRow();
        const status = row.insertCell(0);
        status.setAttribute("style", "text-align: center;");
        const task = row.insertCell(1);
        const date = row.insertCell(2);
        const checkBox = document.createElement("button");
        checkBox.className = "statuscheck";
        if (items[i][2] == 2) {
            checkBox.classList.toggle("completedtask");
        }
        checkBox.addEventListener('click', updateTaskStatus);
        checkBox.setAttribute('id', items[i][3]);
        status.appendChild(checkBox);
        task.innerHTML = items[i][0];
        const timeDate = items[i][1];
        date.innerHTML = timeDate.toDateString() + " " + timeDate.toTimeString().substring(0, 8);
    }
    taskList.getElementsByTagName('tbody')[0].parentNode.replaceChild(tBody, taskList.getElementsByTagName('tbody')[0]); 
}