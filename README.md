# Time Blocker

CodePath WEB103 Final Project

Designed and developed by: **Veerendranath, Pranava Sree**

🔗 Link to deployed app:

## About

### Description

Time Blocker is a minimalist web application that digitizes author Cal Newport's proven time-blocking methodology. The core of the application is a clean, intuitive interface that helps you move from a reactive, distraction-filled day to a proactive and intentional one.

It features a unique two-panel layout:

- **The Collection Page**: A dedicated space on the left to quickly capture tasks, notes, and daily metrics, just like the collection page in a physical planner.

- **The Time Block Grid**: A visual, vertical timeline on the right where you can design your day. Simply drag tasks from your collection page and drop them onto the grid to assign them a specific time.

The application is built for the reality that plans change. When interruptions occur, you can easily adapt your schedule by dragging, dropping, and resizing time blocks, providing the flexibility of a digital tool with the focused clarity of pen and paper.

### Purpose

The primary purpose of this application is to solve the problem of "productivity app burnout" and the reactive nature of modern knowledge work. Many digital tools, in an attempt to be all-in-one solutions, become overly complex and a source of distraction themselves. Users often spend more time organizing their productivity app than doing the actual work.

This project provides an opinionated and simple alternative. Instead of offering endless features, it provides a proven framework for focus, helping users to:

- **Give Every Minute a Job**: Intentionally plan the day to balance important "deep work" with urgent shallow tasks.

- **Separate Capture from Planning**: By physically separating the task list from the schedule, the app reduces the cognitive load of a long to-do list and prevents the constant temptation to clutter the calendar.

- **Adapt with Ease**: The purpose of the app's drag-and-drop interface is to digitally replicate this fluid, realistic planning process.

- **Enable Clear Shutdowns**: The "Shutdown Complete" checkbox, taken directly from the planner template, is a key feature designed to help users consciously end their workday, reduce work-related anxiety, and prevent burnout.

### Inspiration

This project is directly inspired by Cal Newport's physical Time-Block Planner and his underlying philosophy of time management, which he has advocated for over fifteen years.

The core idea is to create the definitive digital version of Newport's system, which emphasizes replacing stressful busyness with empowering intention. The application is built for users who want to practice "Deep Work" and apply principles of digital minimalism to their daily planning.

## Tech Stack

#### Frontend:

- React
- Tailwind CSS
- React Router
- React Query
- Zustand

#### Backend:

- Node.js
- Express
- PostgreSQL
- Zod

## Features

### User Management

- [ ] **User Authentication**: Secure sign-up and login for users to create and access their personal planner.
- [ ] **Data Persistence**: All tasks, notes, and scheduled blocks are saved to the user's account and sync across sessions.
- [ ] **Two-Panel Interface**: The main screen is a persistent side-by-side layout, with the Collection Page on the left and the Time Block Grid on the right, mirroring the physical planner.

### THe Collection Page (Left Panel - For Capture)

- [ ] **Daily Metrics**: A dedicated field for the user to define and track their key goals or metrics for the day.
- [ ] **Task List**: A simple list where users can quickly add, view, and check off unstructured to-do items.
- [ ] **Notes Area**: A free-form text area for capturing miscellaneous thoughts, links, and ideas that are not yet defined tasks.
- [ ] **Shutdown Complete Checkbox**: A prominent checkbox that allows the user to formally end their workday, reinforcing the "shutdown ritual."

### The Time Block Grid (Right Panel -- For Planning)

- [ ] **Daily Timeline View**: A vertical, single-day calendar view with hourly and sub-hourly time slots (e.g., 9 AM, 10 AM, etc.).
- [ ] **Create Time Block**: Ability to create a new event or task block directly on the timeline by clicking or dragging on a time slot.
- [ ] **Edit Time Block Title**: Ability to click on a scheduled block to change its name or description.
- [ ] **Move Time Block (Drag & Drop)**: Ability to easily reschedule a block by dragging and dropping it to a different time slot, allowing the plan to adapt as the day unfolds.
- [ ] **Resize Time Block**: Ability to change the duration of a block by dragging its top or bottom edge to make it shorter or longer.
- [ ] **Delete Time Block**: Ability to remove a block from the schedule entirely.
- [ ] **Visual Customization**: Option to assign different colors or icons to time blocks to visually categorize types of work (e.g., Deep Work, Meetings, Shallow Work).

### Core Workflow & Interaction

- [ ] **Drag-to-Schedule**: The primary workflow enabling a user to drag a task from the "Task List" on the Collection Page and drop it onto the Time Block Grid to schedule it.
- [ ] **Task-to-Block Conversion**: When a task is dragged onto the grid, it is automatically converted into a new, editable time block with a default duration.

### Advanced & Post-MVP Features

- [ ] **Routines & Templates**: Ability to create and save recurring daily schedules or common blocks of tasks that can be applied to the timeline with one click.
- [ ] **Statistics & Progress View**:A feature to visualize how time was spent over the week, based on the categories assigned to time blocks.

## Installation Instructions

[instructions go here]
