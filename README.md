# Electronic Logic Gate symulation && build (React + TS + React Flow)


## 🚀 Quick Start

### Clone the repository and install dependencies:

```bash
git clone https://github.com/jaman7/logic-react-react-flow.git .
```
### 1. in the server folder run command:

```bash
npm i
```

### 1.2 in the server folder run command next first run docker:

```bash
docker-compose up -d
```

### 1.3 in the server folder execute:

```bash
npm run dev
```

### 2. in the client folder run command:

```bash
npm i
npm run dev
```

### The app will be available at: [http://localhost:5173/](http://localhost:5173/)

### default login:
email = test@test.io
password: "Test123$"
 

### 🧠 Client:
An interactive educational platform built with React, TypeScript, and React Flow for simulating, visualizing, and minimizing digital logic functions. The application includes real-time logic gate simulation, Karnaugh map-based minimization, and automatic logic circuit generation.

## 🚀 Features

### ✅ Logic Gate Simulator (Dashboard)
- Simulates basic logic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR
- Interactive buttons to toggle input values (`0` or `1`)
- Dynamic LED output indicators
- Auto-play functionality to step through truth table inputs
- Time-series chart of input/output changes using ApexCharts
- Truth table viewer with row selection
- Adjustable simulation speed (10s, 5s, 2s, 1s, 0.5s)

## Application preview
![Logic Gate Simulator](https://github.com/user-attachments/assets/aaa7c7f0-2dbb-48c9-8d02-15fa931799ac)

---

### ✅ Logic Function Minimizer (Logic Minimizer)
- Define number of inputs and outputs (up to 4)
- Input truth table manually or import via CSV
- Validation of binary formats and lengths
- Export valid tables to CSV
- Karnaugh Map (K-map) generation and visualization
- Automatically minimized Boolean function (e.g., `F(A,B) = A'B + AB'`)
- Auto-generated logic gate diagram using React Flow


## Application preview
![Logic Minimizer Table](https://github.com/user-attachments/assets/ef2e3edf-a332-4e78-9622-b5be362c7bc9)
![Logic Minimizer Schematic](https://github.com/user-attachments/assets/3dd5e254-00f7-4314-92da-852e4454bba6)

---

## 🛠 Tech Stack

- **Framework**: React 19, TypeScript
- **UI Libraries**: PrimeReact, Shadcn UI, Tailwind CSS, SCSS Modules
- **Simulation & Charts**:
  - [React Flow](https://reactflow.dev/) – logic circuit builder
  - [ApexCharts](https://apexcharts.com/) – waveform charts
- **Form Validation**: `react-hook-form`, `yup`
- **Internationalization**: `react-i18next` (EN/PL support)
- **State Management**: Zustand
- **Data Processing**:
  - `kmap-solver`, `kmap-solver-lib` – for logic minimization
  - `mathjs`, `papaparse`

---



### 🧠 Server:

## 🧠 Logic Table API (Node.js + Prisma + Redis + JWT)

This project is a RESTful API built with **Express.js**, **Prisma ORM**, **PostgreSQL**, **Redis**, and **JWT authentication**. It supports user management, authentication, and logic gate truth tables, including seeding predefined logic structures.

---

## 🚀 server Features

-  JWT-based authentication (access & refresh tokens)
-  Token verification using RSA keys
-  Secure session handling with Redis
-  Modular architecture with Zod validation
-  REST API with:
  - User CRUD (with roles)
  - Truth table management (preloaded examples)
-  Environment-based config system using `config` and `envalid`
-  Dockerized Redis
-  Testing with Jest + Supertest
-  Prettier + ESLint ready
