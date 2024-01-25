import { addTaskManager, removeManager, createNewTask } from "./AppLogic";
const createFlex = function(direction, justify, align, gap = "normal", clss = "") {
    const temp = document.createElement("div");
    if (clss) 
        temp.classList.add(clss);
    temp.style.display = "flex";
    temp.style.flexDirection = direction;
    temp.style.justifyContent = justify; 
    temp.style.alignItems = align;
    temp.style.gap = gap;
    return temp;
};

const createText = function(content, clss = "") {
    const temp = document.createElement("p");
    temp.textContent = content;
    if (clss) 
        temp.classList.add(clss);
    return temp;
};

const createProjectContainer = function() {
    const temp = createFlex("column", "center", "center", "5px", "task-list");
    const addTask = document.createElement("button");
    addTask.textContent = "Add a task";
    addTask.addEventListener("click", () => {
        createNewTask(); //TODO
    });
    temp.appendChild(addTask);
    return temp;
};

const createInitialContainer = function() {
    const temp = createFlex("column", "center", "center", "5px", "task-list");
    return temp;
}; 

const initSidebarElement = function(taskManager, projectList, content, i, title, sidebar) {
    const temp = createFlex("row", "space-between", "center", "5px", "sidebar-ele");
    temp.addEventListener("click", () => {
        content.innerHTML = "";
        content.appendChild(taskManager.container);
        title.textContent = taskManager.name;
    });
    const createMenu = function(i) {
        const menu = createFlex("row", "space-evenly", "center", "0", "text-menu");
        const buttonContainer = createFlex("column", "space-evenly", "center", "0", "button-menu");
        const edit = document.createElement("button");
        edit.textContent = "Edit";
        // edit.addEventListener("click", () => editProjectElement(taskManager.container, taskManager, projectList))(taskManager.container, taskManager, projectList);
        edit.addEventListener("click", (e) => editProjectElement(taskManager, projectList, content, title, sidebar, e.target));
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.addEventListener("click", () => {
            removeManager(projectList, taskManager);
            document.body.replaceChild(renderSidebar(projectList, content, title), sidebar);
        });
        edit.classList.add("text-menu-btn");
        del.classList.add("text-menu-btn");
        edit.classList.add("interactable");
        del.classList.add("interactable");
        const temp = createFlex("column", "space-evenly", "center", "2px", "text-menu-container");
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
        temp.addEventListener("click", (e) => {
            const selected = document.body.querySelector(".sidebar > .sidebar-ele >.text-menu > .button-menu.active");
            if (selected)
                selected.classList.toggle("active");
            if (selected === buttonContainer) {
                buttonContainer.classList.toggle("active");
                e.stopPropagation();
            }
            buttonContainer.classList.toggle("active");
            // edit.classList.toggle("active");
            // del.classList.toggle("active");
            e.stopPropagation();    
        });
        (function(buttonContainer) {document.body.addEventListener("click", (e) => {
            // var isClickOnButton = (e.target === kebabButton);
            const selected = document.body.querySelector(".sidebar > .sidebar-ele >.text-menu > .button-menu.active");
            if (selected)
                selected.classList.toggle("active");
        })})(buttonContainer);
        buttonContainer.setAttribute("id", i);
        menu.appendChild(temp);
        buttonContainer.appendChild(edit);
        buttonContainer.appendChild(del);
        menu.appendChild(buttonContainer);
        return menu;
    };
    temp.appendChild(createText(taskManager.name, "project-side-name"));
    temp.appendChild(createMenu(i));
    return temp;
};

const renderSidebar = function(projectList, content, title) {
    const temp = createFlex("column", "flex-start", "center", "20px", "sidebar");
    let j = 0;
    if (projectList) {
        for (const i of projectList) {
            temp.appendChild((() => initSidebarElement(i, projectList, content, j, title, temp))(i));
            j++;
        }
    }
    const add = document.createElement("button");
    add.textContent = "Add Project"
    add.classList.add("sidebar-ele");
    add.classList.add("add-btn");
    temp.appendChild(add);
    console.log(temp);
    add.addEventListener("click", () => {
        // const test = [].slice.call(temp.children);
        add.classList.toggle("hidden");
        // if (test[test.length - 1].textContent === "Create Project")
        createProjectElement(temp, projectList, content, title);
    });
    return temp;
};

const createProjectElement = function(elementList, projectList, content, title) {
    const container = createFlex("column", "space-evenly", "center", "5px", "sidebar-input-ele");
    const buttonContainer = createFlex("row", "center", "center", "20px", "btn-container");
    // target.parentElement.style.flexDirection = "column";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "New project name here");
    //TODO fix arrangement of input, submit, cancel (currently not in a triangle shape)
    const submit = document.createElement("button");
    submit.classList.add("submit-btn");
    submit.addEventListener("click", () => {
        addTaskManager(input.value, projectList);
        document.body.replaceChild(renderSidebar(projectList, content, title), elementList);
    });
    const cancel = document.createElement("button");
    cancel.classList.add("cancel-btn");
    cancel.addEventListener("click", () => {
        document.body.replaceChild(renderSidebar(projectList, content, title), elementList);
    });
    submit.textContent = "Submit";
    cancel.textContent = "Cancel";
    container.appendChild(input);
    buttonContainer.appendChild(submit);
    buttonContainer.appendChild(cancel);
    container.appendChild(buttonContainer);
    elementList.appendChild(container);
};

const editProjectElement = function(taskManager, projectList, content, title, sidebar, target) {
    let container;
    const input = document.createElement("input");
    const test = [].slice.call(sidebar.children);
    for (const i of test) {
        if (i === target.parentElement.parentElement.parentElement)
            container = i;
    }
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "New project name here");
    container.innerHTML = "";
    //TODO fix arrangement of input, submit, cancel (currently not in a triangle shape)
    const submit = document.createElement("button");
    submit.classList.add("submit-btn");
    submit.addEventListener("click", () => {
        taskManager.name = input.value;
        document.body.replaceChild(renderSidebar(projectList, content, title), sidebar);
    });
    const cancel = document.createElement("button");
    cancel.classList.add("cancel-btn");
    cancel.addEventListener("click", () => {
        document.body.replaceChild(renderSidebar(projectList, content, title), sidebar);
    });
    submit.textContent = "Submit";
    cancel.textContent = "Cancel";
    container.appendChild(input);
    container.appendChild(submit);
    container.appendChild(cancel);
};

export {createFlex, createText, createProjectContainer, renderSidebar, createInitialContainer};