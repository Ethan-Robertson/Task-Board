// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    let id = nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId)); // Save nextId to localStorage
    return id;
}

// Function to create a task card
function createTaskCard(task) {
    return `
        <div class="card mb-3 task-card" data-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                <button class="btn btn-danger delete-task" data-id="${task.id}">Delete</button>
            </div>
        </div>
    `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    console.log('Rendering task list', taskList); // Debug log
    $("#todo-cards, #in-progress-cards, #done-cards").empty(); // Clear existing tasks
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });
    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone"
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const dueDate = $("#taskDueDate").val(); // Already in yyyy-MM-dd format
    const status = "todo"; // Default status

    const newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status
    };

    console.log('Adding new task', newTask); // Debug log

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $("#taskForm")[0].reset();
    $("#formModal").modal('hide');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).data("id");
    console.log('Deleting task', taskId); // Debug log
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.helper.data("id");
    const newStatus = $(this).attr("id").replace("-cards", "");

    console.log('Dropping task', taskId, 'to', newStatus); // Debug log

    taskList = taskList.map(task => {
        if (task.id == taskId) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#taskForm").on("submit", handleAddTask);

    $(document).on("click", ".delete-task", handleDeleteTask);

    $(".card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

    $("#taskDueDate").datepicker({
        dateFormat: "yy-mm-dd" // Ensures the date is in the correct format
    });
});
