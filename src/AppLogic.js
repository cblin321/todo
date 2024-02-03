import {createTask, createTaskManager, createTaskList} from "./TaskManager";
import { createFlex, createText } from "./DOMHelper";
import { create } from "enhanced-resolve";
import { upcomingProjects } from "./index";
const createTaskMenu = function(taskManager, container, i) {
    const temp = createFlex("column", "space-evenly", "center", "2px", "text-menu-container");
    const textMenu = createFlex("row", "space-evenly", "center", "0", "text-menu");
    temp.style.position = "relative";
    const circle1 = document.createElement("span");
    circle1.classList.add("menu-circle");
    const circle2 = document.createElement("span");
    circle2.classList.add("menu-circle");
    const circle3 = document.createElement("span");
    circle3.classList.add("menu-circle");
    temp.appendChild(circle1);
    temp.appendChild(circle2);
    temp.appendChild(circle3);

    //TODO create functionality for edit and delete
    const menu = createFlex("column", "space-evenly", "center", "0", "button-menu");
    // temp.addEventListener("click", () => {
    //     menu.classList.toggle("hidden");
    // })(menu);
    temp.addEventListener("click", (e) => {
        const selected = document.body.querySelector(".button-menu.active");
        if (selected)
            selected.classList.toggle("active");
        if (selected === menu) {
            menu.classList.toggle("active");
            e.stopPropagation();
        }
        menu.classList.toggle("active");
        e.stopPropagation();
    });
    (function(menu) {document.body.addEventListener("click", (e) => {
        // var isClickOnButton = (e.target === kebabButton);
        const selected = document.body.querySelector(".button-menu.active");
        if (selected)
            selected.classList.toggle("active");
    })})(menu);
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", (e) => {
        editTask(e.target, taskManager);        
    });
    const del = document.createElement("button");
    del.addEventListener("click", () => {
        taskManager.removeTask(i);
        initTasks(taskManager);
    });
    edit.classList.add("text-menu-btn");
    del.classList.add("text-menu-btn");
    del.textContent = "Delete";
    menu.setAttribute("task-id", i)
    menu.appendChild(edit);
    menu.appendChild(del);
    // menu.classList.add("hidden");
    textMenu.appendChild(temp);
    textMenu.appendChild(menu);
    textMenu.classList.add("interactable");
    container.appendChild(textMenu);
};

const removeManager = function(managerList, manager) {
    managerList.splice(managerList.indexOf(manager), 1);
}

const createTaskElement = function(task, taskManager) {
    const temp = document.createElement("li");
    temp.classList.add("task-ele");
    temp.setAttribute("task-id", task.id);
    temp.style.display = "flex"; 
    temp.style.justifyContent = "space-between"; 
    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    const priorityMap = new Map();
    priorityMap.set(0, "low-prio");
    priorityMap.set(1, "medium-prio");
    priorityMap.set(2, "high-prio");
    temp.classList.add(priorityMap.get(task.priority));
    check.addEventListener("click", () => {
            const h1 = temp.querySelectorAll("h1");
            const h2 = temp.querySelectorAll("h2");
            const p = temp.querySelectorAll("p");
            for (const i of h1)
                i.classList.toggle("linethrough");
            for (const i of h2)
                i.classList.toggle("linethrough");
            for (const i of p)
                i.classList.toggle("linethrough");
    });

    const title = document.createElement("h2");
    title.textContent = task.title;
    const desc = document.createElement("p");
    desc.textContent = task.desc;
    const left = document.createElement("div");
    left.appendChild(title);
    left.appendChild(desc);

    const right = createFlex("row", "space-evenly", "center", "8px", "task-right");
    const date = createText(task.dueDate, "task-date");
    right.appendChild(date);
    createTaskMenu(taskManager, right, taskManager.tasks.tasks.length - 1);  
    
    temp.appendChild(check);
    temp.appendChild(left);
    temp.appendChild(right);
    return temp;
};

/**
 * Update DOM when taskList of taskManager is changed
 * @param {*} taskManager taskManager whose list was changed
 * @param {*} skip 
 */
 const initTasks = function(taskManager, skip = null) {
    const container = createFlex("column", "center", "center", "25px", "task-list");
    const addTask = document.createElement("button");
    addTask.textContent = "Add a task";
    addTask.classList.add("add-btn");
    addTask.classList.add("task-ele");
    container.appendChild(addTask);
    addTask.addEventListener("click", () => {
        addTask.classList.toggle("hidden");
        createNewTask(taskManager, taskManager.id, addTask); 
    });
    for (const i of taskManager.tasks.tasks) {
        container.appendChild(createTaskElement(i, taskManager));
    }
    taskManager.container.parentElement.replaceChild(container, taskManager.container);
    taskManager.container = container;
 };

 const editTask = function(target, taskManager) {
     const currTask = taskManager.tasks.getTask(parseInt(target.parentElement.getAttribute("task-id")));
     const createEditMenu = function(titleDef, descDef, dateDef, prioDef, currTask) {
        const formRow = createFlex("row", "space-around", "center", "0", "form-row");
        const btnRow = createFlex("row", "space-evenly", "center", "0");         
        const temp = document.createElement("form");
        const title = document.createElement("input");
        title.setAttribute("type", "text");
        title.value = titleDef;
        title.setAttribute("required", "");
        title.required = true;
        const desc = document.createElement("textarea");
        desc.value = descDef;
        desc.setAttribute("required", "");
        desc.required = true;
        const date = document.createElement("input");
        date.setAttribute("type", "date");
        date.setAttribute("required", "");
        date.required = true;
        date.value = dateDef;
        const prioContainer = createFlex("row", "space-evenly", "center", "10px");
        const lowPrio = document.createElement("input");
        lowPrio.setAttribute("type", "radio");
        lowPrio.setAttribute("required", "");
        lowPrio.required = true;
        lowPrio.setAttribute("name", `priority-${currTask.id}`);
        lowPrio.setAttribute("id", `low-priority-${currTask.id}`);
        lowPrio.classList.add("low-prio");
        const lowLabel = document.createElement("label");
        lowLabel.setAttribute("for", `low-priority-${currTask.id}`)
        lowLabel.textContent = "Low";
        const medPrio = document.createElement("input");
        medPrio.setAttribute("type", "radio");
        medPrio.setAttribute("name", `priority-${currTask.id}`);
        medPrio.setAttribute("id", `med-priority-${currTask.id}`);
        medPrio.classList.add("med-prio");
        const medLabel = document.createElement("label");
        medLabel.setAttribute("for", `med-priority-${currTask.id}`)
        medLabel.textContent = "Med";
        const highPrio = document.createElement("input");
        highPrio.setAttribute("type", "radio");
        highPrio.setAttribute("name", `priority-${currTask.id}`);
        highPrio.classList.add("high-prio");
        highPrio.setAttribute("id", `high-priority-${currTask.id}`);
        highPrio.classList.add("high-prio");
        const highLabel = document.createElement("label");
        highLabel.setAttribute("for", `high-priority-${currTask.id}`)
        highLabel.textContent = "High";
        const buttons = [lowPrio, highPrio, medPrio];
        if (prioDef === 0) 
            lowPrio.checked = true;
        else if (prioDef === 1) 
            medPrio.checked = true;
        else
            highPrio.checked = true;
        const lowContainer = document.createElement("span");
        const medContainer = document.createElement("span");
        const highContainer = document.createElement("span");
        lowContainer.appendChild(lowPrio);
        lowContainer.appendChild(lowLabel);
        medContainer.appendChild(medPrio);
        medContainer.appendChild(medLabel);
        highContainer.appendChild(highPrio);
        highContainer.appendChild(highLabel);
        prioContainer.appendChild(lowContainer);
        prioContainer.appendChild(medContainer);
        prioContainer.appendChild(highContainer);

        const submit = document.createElement("input");
        submit.setAttribute("type", "submit");
        submit.textContent = "Submit";
        submit.addEventListener("click", () => {
            let newTask;
            event.preventDefault();
            if (medPrio.checked)
                newTask = createTask(title.value, desc.value, date.value, false, currTask.id, 1);
            else if (highPrio.checked)
                newTask = createTask(title.value, desc.value, date.value, false, currTask.id, 2);
            else
                newTask = createTask(title.value, desc.value, date.value, false, currTask.id, 0);
            submitEdit(newTask, taskManager, temp);
        }); 
        submit.classList.add("submit-btn");
        const cancel = document.createElement("button");
        cancel.classList.add("cancel-btn");
        cancel.addEventListener("click", () => {
            taskManager.container.innerHTML = "";
            initTasks(taskManager);
        });
        cancel.textContent = "Cancel";

        temp.appendChild(title);
        temp.appendChild(desc);
        formRow.appendChild(date);
        formRow.appendChild(prioContainer);
        temp.appendChild(formRow);
        btnRow.appendChild(submit);
        btnRow.appendChild(cancel);
        temp.appendChild(btnRow);
        const currEle = document.body.querySelector(`li[task-id="${target.parentElement.getAttribute("task-id")}"]`);
        console.log(currEle);
        document.body.querySelector(".task-list").replaceChild(temp, currEle);
        // taskManager.container.appendChild(temp);    
    };
    const editMenu = createEditMenu(currTask.title, currTask.desc, currTask.dueDate, currTask.priority, currTask);
    // initTasks(taskManager);
};

/**
 * Creates a form element for creating a new task
 * @param {*} manager manager to add task to
 * @param {*} i id 
 */
const createNewTask = function(manager, i, btn = null) {
        const formRow = createFlex("row", "space-around", "center", "0", "form-row");
        const temp = document.createElement("form");
        const title = document.createElement("input");
        title.setAttribute("type", "text");
        title.placeholder = "Task name here";
        title.required = true;
        const desc = document.createElement("textarea");
        desc.placeholder = "Task description here";
        desc.setAttribute("required", "true");
        const date = document.createElement("input");
        date.setAttribute("required", "");
        date.setAttribute("type", "date");
        const prioContainer = createFlex("row", "space-between", "center", "10px");
        const lowPrio = document.createElement("input");
        lowPrio.setAttribute("required", "");
        lowPrio.setAttribute("type", "radio");
        lowPrio.setAttribute("name", `priority-${i}`);
        lowPrio.setAttribute("id", `low-priority-${i}`);
        lowPrio.classList.add("low-prio");
        const lowLabel = document.createElement("label");
        lowLabel.setAttribute("for", `low-priority-${i}`)
        lowLabel.textContent = "Low";
        // lowPrio.classList.add("unselected-btn");
        const medPrio = document.createElement("input");
        medPrio.setAttribute("type", "radio");
        medPrio.setAttribute("name", `priority-${i}`);
        medPrio.setAttribute("id", `med-priority-${i}`);
        medPrio.classList.add("med-prio");
        const medLabel = document.createElement("label");
        medLabel.setAttribute("for", `med-priority-${i}`)
        medLabel.textContent = "Med";
        // medPrio.classList.add("unselected-btn");
        const highPrio = document.createElement("input");
        highPrio.setAttribute("type", "radio");
        highPrio.setAttribute("name", `priority-${i}`);
        highPrio.classList.add("high-prio");
        highPrio.setAttribute("id", `high-priority-${i}`);
        highPrio.classList.add("high-prio");
        const highLabel = document.createElement("label");
        highLabel.setAttribute("for", `high-priority-${i}`)
        highLabel.textContent = "High";
        // highPrio.classList.add("unselected-btn");
        const buttons = [lowPrio, highPrio, medPrio];
        const lowContainer = document.createElement("span");
        const medContainer = document.createElement("span");
        const highContainer = document.createElement("span");
        lowContainer.appendChild(lowPrio);
        lowContainer.appendChild(lowLabel);
        medContainer.appendChild(medPrio);
        medContainer.appendChild(medLabel);
        highContainer.appendChild(highPrio);
        highContainer.appendChild(highLabel);
        prioContainer.appendChild(lowContainer);
        prioContainer.appendChild(medContainer);
        prioContainer.appendChild(highContainer);
        const submit = document.createElement("input");
        submit.classList.add("submit-btn");
        submit.setAttribute("type", "submit");
        submit.textContent = "Submit";
        const required = [lowPrio, highPrio, medPrio, title, date, desc];
        const result = submit.addEventListener("click", () => {
            let newTask;
            event.preventDefault();
            for (const i of required) {
                if (!i.checkValidity()) {
                    i.reportValidity();
                    return;
                }
            }
            if (btn)
                btn.classList.toggle("hidden");
            if (medPrio.checked)
                newTask = createTask(title.value, desc.value, date.value, false, i, 1);
            else if (highPrio.checked)
                newTask = createTask(title.value, desc.value, date.value, false, i, 2);
            else
                newTask = createTask(title.value, desc.value, date.value, false, i, 0);
            //manager.addTask(newTask) 
            submitCreation(newTask, manager, temp); 
        }); 
        const cancel = document.createElement("button");
        const btnRow = createFlex("row", "space-evenly", "center", "0");
        cancel.classList.add("cancel-btn");
        cancel.addEventListener("click", () => {
            manager.container.innerHTML = "";
            initTasks(manager);
            if (btn)
                btn.classList.toggle("hidden");
        });
        cancel.textContent = "Cancel";
        temp.appendChild(title);
        temp.appendChild(desc);
        formRow.appendChild(date);
        formRow.appendChild(prioContainer);
        temp.appendChild(formRow);
        btnRow.appendChild(submit);
        btnRow.appendChild(cancel);
        temp.appendChild(btnRow);
        manager.container.appendChild(temp);      
    };

/**
 * Run once the submit button on a new task creation is pressed.
 * Adds the new task to the appropriate container
 * @param {*} task 
 * @param {*} taskManager the new taskManager that was created by
 * @param {*} container the form element
 */
const submitCreation = function(task, taskManager, container) {
    taskManager.addTask(task);
    dateCategorize(task);
    initTasks(taskManager);
};


/**
 * Run once the submit button on a existing task is pressed.
 * Modifies the task provided and refreshes the display
 * @param {*} task 
 * @param {*} taskManager the new taskManager that was created by
 * @param {*} container the form element
 */
const submitEdit = function(task, taskManager, container) {
    const inputs = container.querySelectorAll("input");
    const desc = container.querySelectorAll("textarea");
    const selected = [].slice.call(container.querySelectorAll('input[type="radio"]')).find((btn) => btn.checked);
    const components = selected.id.split("-");
    const prioMap = new Map();
    prioMap.set("lowpriority", 0);
    prioMap.set("medpriority", 1);
    prioMap.set("highpriority", 2);
    const values = [inputs[0].value, desc[0].value, inputs[1].value, prioMap.get(components[0] + components[1])];
    const fields = ["title", "desc", "dueDate", "priority"];
    //title, desc, date, prio
    for (let i = 0; i < 4; i++) {
        taskManager.changeTask(fields[i], task.id, values[i]);
    }
    dateCategorize(task);
    initTasks(taskManager);
};

const addTaskManager = function(name, managerList) { 
    //TODO implement indicator to show user how many unfinished tasks
    const newTaskList = createTaskList([]);
    const container = createFlex("column", "center", "center", "20px", "task-list");
    const addTask = document.createElement("button");
    addTask.classList.add("add-btn");
    addTask.classList.add("task-ele");
    addTask.textContent = "Add a task";
    container.appendChild(addTask);
    const newTaskManager = createTaskManager(newTaskList, name, container, managerList[managerList.length - 1].id + 1);
    addTask.addEventListener("click", () => {
        addTask.classList.toggle("hidden");
        createNewTask(newTaskManager, newTaskManager.tasks.tasks.length, addTask);
        //TODO if a new task is created add it to the appropriate week, month, etc. 
    });
    managerList.push(newTaskManager);
};

const dateCategorize = function(changedTask) {
    // const upcomingProjects = [today, week, month];
    console.log(upcomingProjects);
    const today  = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
      ));
    const components = changedTask.dueDate.split("-");
    const taskDate = new Date(Date.UTC(components[0], parseInt(components[1]) - 1, components[2]));
    const taskNextMonth = new Date(Date.UTC(components[0], parseInt(components[1]) - 1, components[2]));
    taskNextMonth.setDate(taskNextMonth.getMonth() + 1);
    let index = upcomingProjects[0].tasks.indexOf((task) => {
        return changedTask === task;
    });
    if (index !== -1)
        upcomingProjects[0].tasks.splice(index, 1);
    index = upcomingProjects[1].tasks.indexOf((task) => {
        return changedTask === task;
    });
    if (index !== -1)
        upcomingProjects[1].tasks.splice(index, 1);
    index = upcomingProjects[2].tasks.indexOf((task) => {
        return changedTask === task;
    });
    if (index !== -1)
        upcomingProjects[2].tasks.splice(index, 1);
    console.log(today);
    console.log(taskDate);
    if (today.getDay() == taskDate.getDay() && today.getMonth() == taskDate.getMonth() && today.getUTCFullYear() == taskDate.getUTCFullYear()){
        upcomingProjects[0].tasks.push(changedTask);
        console.log("today task");
    } else if (today.getDate() + 7 >= taskDate) 
        upcomingProjects[1].addTask(changedTask);
    else if (taskNextMonth.getDate() >= taskDate)
        upcomingProjects[2].addTask(changedTask);
    // console.log(upcomingProjects[0].tasks);
    // console.log(upcomingProjects[1].tasks);
    // console.log(upcomingProjects[2].tasks);
};

export {addTaskManager, removeManager, createNewTask};