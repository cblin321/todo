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