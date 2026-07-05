# CPU Scheduling Visualizer

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=blue)

## Overview

**CPU Scheduling Visualizer** is an interactive, physics-based web application designed to help Computer Science students and professors visualize and understand core Operating System scheduling algorithms. It goes beyond standard graphing tools by acting as an intelligent tutor—generating step-by-step mathematical explanations, animating queue states in real-time, and offering an interactive Practice Quiz mode for test preparation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Comprehensive Algorithms**: Supports First Come First Serve (FCFS), Shortest Job First (SJF / SRTF), Priority Scheduling (Preemptive & Non-Preemptive), and Round Robin.
- **Physics-Based Visuals**: Features a real-time, animated Ready Queue and an auto-generating Gantt Chart built with Framer Motion.
- **Intelligent Tutor Log**: As the simulation runs, an Event Log explains the *why* behind every context switch, preemption, and metric calculation using detailed mathematical formulas.
- **Practice Quiz Mode**: Auto-generates random scheduling scenarios and grades your manual calculations of Turnaround and Waiting Times before revealing the full solution.
- **Responsive Design**: A sleek, Notion-like UI powered by Shadcn that works seamlessly across desktop and mobile devices.

---

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: TailwindCSS & Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (usually comes with Node.js) or [pnpm](https://pnpm.io/)

---

## Installation & Setup

Follow these steps to clone the repository and run the visualizer locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/marmalade1124/CPUScheduler.git
   cd CPUScheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the app**
   Open your browser and navigate to `http://localhost:5173`.

---

## Usage

1. **Configure Processes**: Use the left sidebar to add custom processes (defining Arrival Time, Burst Time, and Priority) or click **Random** to generate a quick test case.
2. **Select an Algorithm**: Pick an algorithm from the dropdown (e.g., Round Robin with a Time Quantum of 2).
3. **Simulate**: Click **Solve Scheduling**. Use the media controls (or the Spacebar) to step through the timeline and watch the Gantt Chart render.
4. **Learn**: Scroll down to the Event Log to read the AI-generated explanations of the scheduling math.
5. **Practice**: Toggle to the **Quiz** view using the top navigation bar to test your knowledge against the engine.

---

## Contributing

Contributions are always welcome! If you'd like to add a new algorithm (like Multilevel Queue Scheduling) or improve the UI, feel free to open a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. Feel free to use this project for educational or personal purposes.
