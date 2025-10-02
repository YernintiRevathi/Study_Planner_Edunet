# Smart Study Planner

[<img width="1919" height="883" alt="image" src="https://github.com/user-attachments/assets/abb3c73f-67f9-46cf-a372-74fddf580cfb" />
](url)
[<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/74ef2480-8e7c-4276-ad63-93b3fcadb3e1" />
](url)
A feature-rich, responsive web application designed to help students organize their academic tasks. This isn't just a simple to-do list; it's a powerful productivity tool with features like multiple list management, custom categories, task prioritization, reminders, and a visual calendar timeline.

**Live Demo:** [**https://yernintirevathi.github.io/Study_Planner_Edunet/**](https://yernintirevathi.github.io/Study_Planner_Edunet/)

---

## ✨ Features

This project was built from the ground up and includes a wide range of modern web application features:

*   **📝 Multiple List Management:**
    *   Create, switch between, and manage separate to-do lists for different subjects or projects.
    *   Delete entire lists with a confirmation step to prevent accidental data loss.

*   **🚀 Advanced Task Organization:**
    *   **Custom Categories:** Create your own categories (e.g., "Reading," "Lab Report," "Practice") on the fly for each list.
    *   **Task Priorities:** Assign **High**, **Medium**, or **Low** priority to each task.
    *   **Automatic Smart Sorting:** Tasks are automatically sorted using a three-tiered system:
        1.  **Completion Status** (incomplete tasks are always at the top).
        2.  **Priority** (High > Medium > Low).
        3.  **Due Date** (earliest first).

*   **📊 Dynamic UI & UX:**
    *   **Reminders:** Get native desktop notifications for tasks that are due today.
    *   **Visual Calendar:** Switch to a full-page calendar view (powered by FullCalendar.js) to see all your tasks visually laid out by due date.
    *   **Visual Indicators:** Priorities are clearly marked with colors, and overdue tasks are highlighted in red.
    *   **Progress Tracking:** A visual progress bar shows the completion percentage for the currently active list.
    *   **"Completed On" Date:** When a task is completed, its priority is automatically downgraded, and the completion date is recorded and displayed.
    *   **Responsive Design:** The layout is fully responsive for a seamless experience on both desktop and mobile devices.

*   **💾 Data Persistence:**
    *   The entire application state, including all lists, tasks, and settings, is saved to the browser's **Local Storage**, so your data is always there when you return.

---

## 🛠️ Technologies Used

This project was built entirely with foundational web technologies, demonstrating a strong command of core front-end development skills.

*   **HTML5:** For the structure and content of the application.
*   **CSS3:** For all styling, including modern features like Flexbox for layout and a mobile-first, responsive design approach.
*   **Vanilla JavaScript (ES6+):** For all the logic and interactivity. No frameworks were used, showcasing a deep understanding of:
    *   DOM Manipulation
    *   State Management (using a single state object)
    *   Event Handling and Delegation
    *   Browser APIs (Local Storage, Notification API)
    *   Data Structures and complex sorting algorithms
*   **FullCalendar.js:** Integrated as a third-party library to provide the powerful calendar view functionality.

---

## 🚀 Getting Started

To view the project, simply visit the [**Live Demo**](https://yernintirevathi.github.io/Study_Planner_Edunet/).

To run the project locally:
1.  Clone this repository: `git clone https://github.com/YernintiRevathi/Study_Planner_Edunet.git`
2.  Navigate to the project directory: `cd Study_Planner_Edunet`
3.  Open the `index.html` file in your web browser.

---
with 🤎 by Revathi
