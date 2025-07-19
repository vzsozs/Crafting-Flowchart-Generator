# Crafting Flowchart Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A visual, web-based tool for designing and analyzing complex production chains, inspired by factory simulation games like Factorio and Satisfactory. This application allows you to visually map out your production lines, calculate resource requirements, and get a real-time summary of your factory's overall balance.

## Screenshot

**(Important: Replace the placeholder image below with a real screenshot of your application!)**



*To add your screenshot: take a picture of the app, upload it to a site like [Imgur](https://imgur.com/), and paste the image link here.*

## ✨ Key Features

*   **Visual & Interactive Canvas:** Drag, drop, and connect nodes with a clean and intuitive interface powered by ReactFlow.
*   **Custom Node Types:**
    *   **Machine Nodes:** Represent factories or assemblers with customizable names, power consumption, and speed.
    *   **Resource Nodes:** Represent raw materials (inputs) or final products (outputs).
*   **Dynamic Editing:** Double-click or use the gear icon on any node to open a detailed editing modal.
*   **Intelligent Connections:**
    *   Automatically create and link resource nodes when adding inputs/outputs to a machine.
    *   Connections are automatically removed when inputs/outputs are deleted.
    *   Edge labels display the required quantity per second, updating automatically.
*   **Two-Way Data Syncing:** Renaming a resource node updates its name within all connected machines, and vice-versa.
*   **Advanced Resource Options:**
    *   **Color Picker:** Customize the color of your input nodes for better visual organization.
    *   **"Stocked" State:** Mark an input as an infinite source, which is reflected visually and in calculations.
*   **Powerful Dashboards:**
    *   **Production Summary:** A real-time sidebar table that shows the total input, output, and net balance for every item in your factory.
    *   **Requirement Calculator:** Select a final product and a desired quantity, and the app will recursively calculate the total raw materials required to produce it.
*   **Save & Load:** Save your entire flowchart, including node positions and data, to a local `.json` file and load it back anytime.
*   **Smart Suggestions:** All text fields for item names provide an auto-complete dropdown with all existing names in your project, preventing typos.

## 🛠️ Tech Stack

*   **Framework:** [React](https://reactjs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Diagramming:** [ReactFlow](https://reactflow.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vzsozs/Crafting-Flowchart-Generator.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Crafting-Flowchart-Generator
    ```3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or the next available port).

## 📄 License

This project is licensed under the MIT License.
