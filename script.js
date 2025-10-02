const progress_text = document.getElementById("progress-text");
const progress_bar = document.getElementById("progress-bar");
const form = document.getElementById("task-form");
const textarea = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const categoryInput = document.getElementById("category-input");
const taskList = document.getElementById("task-list");
const filterContainer = document.getElementById("filter-container");
const listSelector = document.getElementById("list-selector");
const newListInput = document.getElementById("new-list-input");
const addListBtn = document.getElementById("add-list-btn");
const deleteListBtn = document.getElementById("delete-list-btn");
const priorityInput = document.getElementById("priority-input");

let appState = {
    lists: [],
    activeListId: null,
    currentFilter: 'all'
};

function saveState(){
    localStorage.setItem("studyPlannerState",JSON.stringify(appState)); 
}

function loadState() {
    const savedState = JSON.parse(localStorage.getItem("studyPlannerState"));
    if (savedState && savedState.lists.length > 0) {
        appState = savedState;
    } else {
        // Create a default list if nothing is saved
        appState = {
            lists: [{ id: Date.now(), name: "My First Study List", tasks: [] }],
            activeListId: 1, // This will be updated to the new ID
            currentFilter: 'all'
        };
        appState.activeListId = appState.lists[0].id; // Set the active ID
    }
}

// This single function updates the entire page based on the current state.
function render() {
    // Find the currently active list object
    const activeList = appState.lists.find(list => list.id === appState.activeListId);
    if (!activeList) {
        // If no list is active (e.g., after deleting the last one), handle it gracefully
        taskList.innerHTML = "<li>Please select or create a list.</li>";
        filterContainer.innerHTML = "";
        progress_text.textContent = "No list selected";
        progress_bar.style.width = '0%';
        renderListSelector(); // Still render the selector
        return;
    }

    renderListSelector();
    renderFilters(activeList);
    renderTasks(activeList);
    updateProgress(activeList);
}

// Renders the dropdown to switch between lists
function renderListSelector() {
    listSelector.innerHTML = "";
    appState.lists.forEach(list => {
        const option = document.createElement("option");
        option.value = list.id;
        option.textContent = list.name;
        if (list.id === appState.activeListId) {
            option.selected = true;
        }
        listSelector.appendChild(option);
    });
}

// Renders filter buttons based on categories in the active list
function renderFilters(activeList) {
    const isAllActive = appState.currentFilter === 'all' ? 'active' : '';
    filterContainer.innerHTML = `<button class="filter-btn ${isAllActive}" data-category="all">All</button>`;    
    const categories = activeList.tasks.map(task=>task.category);
    const uniqueCategories = [...new Set(categories)];
    uniqueCategories.forEach(category=>{
        if (category){
            const button=document.createElement("button");
            button.className="filter-btn";
            button.dataset.category=category;
            button.textContent=category;
            if(category===appState.currentFilter){
                button.classList.add("active");
            }
            filterContainer.appendChild(button);
        }
    }
    )
}

// Renders tasks based on the active list and current filter
function renderTasks(activeList){
    taskList.innerHTML="";
    const filteredTasks=activeList.tasks.filter(task=>appState.currentFilter=="all" || task.category==appState.currentFilter);
    const priorityValues = { "High": 1, "Medium": 2, "Low": 3 };
    // Sort tasks by due date (earliest first)
    const sortedTasks = filteredTasks.sort((a, b) => {
        // Primary Sort: By Completion Status (completed tasks go to the bottom)
        if (a.completed !== b.completed) {
            return a.completed - b.completed;
        }
        // Secondary Sort: By Priority
        const priorityA = priorityValues[a.priority];
        const priorityB = priorityValues[b.priority];
        
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Tertiary Sort: By Due Date (if priorities are the same)
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    const today= new Date();
    today.setHours(0,0,0,0); // Set to start of the day for accurate comparisons
    sortedTasks.forEach(task=>{
        let li=document.createElement("li");
        li.className = `task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id; // This sets the data-id attribute on the <li>
        const isoverdue= !task.completed && new Date(task.dueDate) <today;
        if(isoverdue){
            li.classList.add("overdue");
        }
        let detailsDateHTML = `<span class="task-date">Due: ${task.dueDate}</span>`;

        // If the task is completed and has a completedDate, add the new span
        if (task.completed && task.completedDate) {
            detailsDateHTML += `<span class="completed-date">Completed on: ${task.completedDate}</span>`;
        }
        li.innerHTML=`
            <div class="task-text-container">
                <span class="task-text">${task.text}</span>
                <span class="task-details">
                    <span class="task-category">${task.category}</span>
                    ${detailsDateHTML}
                </span>
            </div>
            <div class="task-actions">
                <button class="complete-button">✔️</button>
                <button class="delete-button">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function updateProgress(activeList){
    const totalTasks=activeList.tasks.length;
    const completedTasks=activeList.tasks.filter(task=>task.completed).length;
    // console.log(completedTasks,totalTasks);
    progress_text.textContent=`${completedTasks}/${totalTasks}`;
    const progressPercent=totalTasks===0 ? 0 : (completedTasks/totalTasks)*100;
    progress_bar.style.width=`${progressPercent}%`;
}

function setUpEventListeners(){
    // Add a new task to the CURRENT list
    form.addEventListener("submit",function(e){
        e.preventDefault();
        const activeList=appState.lists.find(list=>list.id===appState.activeListId);
        if(!activeList) {
            alert("Please select or create a list first.");
            return;
        }
        const newTask = {
                id: Date.now(),
                text: textarea.value.trim(),
                category: categoryInput.value.trim()||"General",
                dueDate: dateInput.value,
                completed: false,
                priority: priorityInput.value || "Medium",
                completedDate: null // Initialize as null
            };
        activeList.tasks.push(newTask);
        saveState();
        render();
        // textarea.value="";
        // dateInput.value="";
        form.reset();
    })

    // Complete or delete a task in the CURRENT list
    taskList.addEventListener("click",function(e){
        // let li=e.target.parentElement; // Get the parent of the button i.e., <li> element that is completed
        // let id=Number(li.dataset.id);
        const target = e.target;
        const parentLi = target.closest('.task-item');
        if (!parentLi){ 
            console.log("no parent") ;
            return
        };
        const id = Number(parentLi.dataset.id);
        const activeList=appState.lists.find(list=>list.id===appState.activeListId);
        if (!activeList) return;

        // console.log(id);
        if(e.target.classList.contains("complete-button")){
            const task = activeList.tasks.find(t => t.id === id);
            if (task) task.completed = !task.completed;
            if(task.completed){
                // If the task is completed, set the completion date in DD-MM-YYYY format
                // task.completedDate = new Date().toLocaleDateString('en-GB'); // Store as DD-MM-YYYY format
                task.completedDate = new Date().toISOString().split('T')[0]; // Store as DD-MM-YYYY format
                //task.priority = "Low"; // Automatically set priority to Low when completed
                //this makes the task go to the bottom
                //but when mark as incomplete the priority will remain as low
            }
            else {
                // Task is being UN-MARKED as complete
                // It's good practice to clear the completedDate
                delete task.completedDate;
            }
            // console.log(tasks.find(task=>Number(task.id)==id).completed);
        }
        else if(e.target.classList.contains("delete-button")){
            activeList.tasks=activeList.tasks.filter(task=>task.id!==id);
        }
        saveState();
        render();

    });

    // Handle filtering
    filterContainer.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            appState.currentFilter = e.target.dataset.category;
            render();
        }
    });

    // Add a new LIST
    addListBtn.addEventListener("click",()=>{
        const listName=newListInput.value.trim();
        if (listName){
            const newList={
                id:Date.now(),
                name:listName,
                tasks:[]
            };
            appState.lists.push(newList);
            appState.activeListId=newList.id;// Switch to the new list immediately
            newListInput.value = "";
            saveState();
            render();
        }
    });

    // Switch between LISTS
    listSelector.addEventListener("change",function(e){
        appState.activeListId=Number(e.target.value);
        appState.currentFilter='all'; // Reset filter when switching lists
        saveState();
        render();
    })

    // script.js (inside setUpEventListeners function)
    // ... your other listeners (form submit, taskList click, etc.) ...

    // ---- NEW EVENT LISTENER FOR DELETING A LIST ----
    deleteListBtn.addEventListener("click", (e) => {
        console.log("Delete list button clicked");
        // 1. Don't allow deletion if there's only one list left
        if (appState.lists.length <= 1) {
            alert("You cannot delete your only list!");
            return;
        }

        // 2. Find the current list's name for the confirmation message
        const activeList = appState.lists.find(list => list.id === appState.activeListId);
        if (!activeList) return; // Safety check

        // 3. Confirm with the user before deleting! This is very important.
        const isConfirmed = confirm(`Are you sure you want to delete the list "${activeList.name}"? This cannot be undone.`);

        if (isConfirmed) {
            // 4. Filter out the list to be deleted
            appState.lists = appState.lists.filter(list => list.id !== appState.activeListId);

            // 5. CRITICAL STEP: Update the activeListId to the first remaining list
            appState.activeListId = appState.lists.length > 0 ? appState.lists[0].id : null;
            appState.currentFilter = 'all'; // Reset filter

            // 6. Save the new state and re-render everything
            saveState();
            render();
        }
    });
}



// ===================================
//  INITIALIZATION
// ===================================
loadState();
render();
setUpEventListeners();