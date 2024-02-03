import { createTaskManager } from './TaskManager';
import './styles.css';
import {createFlex, createText, createProjectContainer, renderSidebar, createInitialContainer} from "./DOMHelper";
let managerId = 0;
const today = createTaskManager([], "Today", createInitialContainer(), managerId++); 
const week = createTaskManager([], "Week", createInitialContainer(), managerId++); 
const month = createTaskManager([], "Month", createInitialContainer(), managerId++); 
const upcoming = document.createElement("div");
upcoming.classList.add("sidebar-ele");
const upcomingHeading = document.createElement("h1");
upcomingHeading.textContent = "Upcoming";
const userProjects = document.createElement("div");
userProjects.classList.add("sidebar-ele");
const userProjectsHeading = document.createElement("h1");
userProjectsHeading.textContent = "Your Projects"; //TODO section off sidebar, get upcoming tasks to display by date
const nav = document.createElement("nav");
const logo = document.createElement("img");
const navContent = document.createElement("ul");
const content = document.createElement("div");
const projectList = [today, week, month];
const upcomingProjects = [today, week, month];
content.setAttribute("id", "content");
const taskListDOM = document.createElement("ul");
let currProject = today;
const titleContainer = document.createElement("div");
titleContainer.classList.add("project-heading");
const title = document.createElement("h1");
const hamburgerContainer = createFlex("column", "space-evenly", "center", "2px", "hamburger");
const temp = createFlex("column", "flex-start", "center", "0", "sidebar");
let sidebar = renderSidebar(projectList, taskListDOM, title);
const bun1 = document.createElement("span");
const bun2 = document.createElement("span");
const bun3 = document.createElement("span");
bun1.classList.add("burger-bar");
bun2.classList.add("burger-bar");
bun3.classList.add("burger-bar");
hamburgerContainer.appendChild(bun1);
hamburgerContainer.appendChild(bun2);
hamburgerContainer.appendChild(bun3);
hamburgerContainer.addEventListener("click", () => {
    bun1.classList.toggle("active");
    bun2.classList.toggle("active");
    bun3.classList.toggle("active");
    // sidebar.classList.toggle("active");
    document.querySelector(".sidebar").classList.toggle("active");
    content.classList.toggle("active");
});

navContent.style.display = "flex";
navContent.style.height = "calc(100%)";
navContent.style.justifyContent = "space-between";
navContent.style.alignItems = "center";
navContent.appendChild(hamburgerContainer);
navContent.appendChild(logo); 
nav.appendChild(navContent);

title.textContent = "To-Do";
titleContainer.appendChild(title);

taskListDOM.appendChild(today.container);
document.body.appendChild(nav);
document.body.appendChild(sidebar);
content.appendChild(titleContainer);
content.appendChild(taskListDOM);
document.body.appendChild(content);

export {upcomingProjects};
