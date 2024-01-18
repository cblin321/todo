const createTask = function(name, description, deadline, status = false, unique, prio) {
    return {
        title: name,
        desc: description,
        dueDate: deadline,
        completed: status,
        id: unique,
        priority: prio,
    };
};
const createTaskList = function(taskList) {
    return {
        tasks: taskList,
        getTask(id) {
            // console.log("fdasf");
            // console.log(this.tasks.find((task) => task.id === id));
            return this.tasks.find((task) => task.id === id);
        },
        addTask(task) {
            this.tasks.push(task);
        },
        removeTask(id) {
            const i = this.tasks.findIndex((task) => task.id === id);
            this.tasks.splice(i, 1); 
        }
    }
};
//refactored this method with sidebar, need to fix any errors that crop up & fix the sidebar editing feature
const createTaskManager = function(taskList, name, ele, unique) {
    return {
        tasks: taskList,
        name: name,
        container: ele,
        id: unique,
        // sidebar: sidebar,
        changeTask(property, id, newValue) {
            this.tasks.getTask(id)[property] = newValue; 
            console.log(this.tasks.getTask(id));
        }, 
        addTask(name, description, deadline, status = false, unique, prio) {
            this.tasks.addTask(createTask(name, description, deadline, status = false, unique, prio));
        },
        addTask(task) {
            this.tasks.addTask(task);
        },
        removeTask(id) {
            this.tasks.removeTask(id);
        },
        rename(newName) {
            this.name = newName;
        }
    }
};

export {createTask, createTaskManager, createTaskList};