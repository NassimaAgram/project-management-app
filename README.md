# Project Management System

A comprehensive project management system that integrates task management, real-time chat, video/audio conferencing, a chatbot, and automated report generation. This system aims to streamline project workflows and improve team collaboration, offering features similar to Jira, but enhanced with AI-driven automation and communication tools.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Diagrams](#diagrams)
    - [Class Diagram](#class-diagram)
    - [Use Case Diagram](#use-case-diagram)
    - [Sequence Diagrams](#sequence-diagrams)
- [Jira Project Board](#jira-project-board)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This project management system is designed to help teams plan, execute, and collaborate on tasks in real-time, integrating several advanced features such as:
- **Task and Project Management**: Inspired by Jira, users can create tasks, assign them, and manage sprints.
- **Real-Time Communication**: Built-in chat and video conferencing to keep teams connected.
- **AI Chatbot**: To assist in task management and user queries.
- **Automated Reporting**: Automatically generated reports based on project progress.

---

## Features

1. **Task Management**: Create, assign, and track tasks.
2. **Real-Time Collaboration**:
   - **Chat Rooms**: Group and direct messaging.
   - **Conferencing**: Built-in video and voice conferencing with the ability to schedule meetings.
3. **AI-Powered Chatbot**:
   - Query the system for task updates, project statuses, etc.
   - Automate reminders and simple tasks.
4. **Automated Reports**: Generate project summaries, progress reports, and risk assessments.
5. **User Roles**: Manage access with different user roles (e.g., Admin, Manager, Developer).
6. **Agile Support**: Manage sprints and backlogs for agile teams.

---

## Diagrams

Below are the core diagrams that describe the structure and behavior of the system.

### Class Diagram
![Class Diagram](./public/class_diagramm.png)

### Use Case Diagram
![Use Case Diagram](./public/use-case-diagram.png)

### Sequence Diagrams
1. **Task Creation Sequence**
   ![Task Creation Sequence](./public/sequence-diagram-task-creation.png)
   
2. **Real-Time Chat Sequence**
   ![Real-Time Chat Sequence](./public/sequence-diagram-chat.png)

3. **Conference Setup Sequence**
   ![Conference Setup Sequence](./public/sequence-diagram-conference.png)

---

## Jira Project Board

We are using Jira to manage the project's tasks and progress. You can track the latest updates and sprint plans via the following link:

[Jira Project Board](your-jira-link-here)

---

## Installation

### Prerequisites
- Node.js
- MongoDB/PostgreSQL (or your preferred database)
- Docker (optional for containerized deployments)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/project-management-system.git
    cd project-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
   - Add your database, API keys, and configuration details in `.env`.

4. Run the application:
    ```bash
    npm start
    ```

5. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

---

## Usage

- After installation, users can:
  1. Create projects and assign tasks to team members.
  2. Use the built-in chat for collaboration and real-time messaging.
  3. Set up video and voice conferences directly within the app.
  4. Generate automated reports from project progress and task completion.

For a detailed walkthrough, see the [User Guide](your-user-guide-link-here).

---

## Contributing

We welcome contributions to this project. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request and describe your changes.

Please see our [Contributing Guidelines](link-to-contributing.md) for more details.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or feedback, feel free to contact the project maintainers:

- **Name 1**: [Email](mailto:email1@example.com)
- **Name 2**: [Email](mailto:email2@example.com)

---

