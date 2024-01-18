const createTaskList = function(taskList) {
    return {
        tasks: taskList,
        getTask(id) {
            return this.tasks.filter((task) => task.id === id);
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