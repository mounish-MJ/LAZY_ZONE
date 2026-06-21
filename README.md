# Lazy Zone — Full-Stack Local Setup Guide

This guide details how to run **Lazy Zone** locally on your computer using **VS Code** (Visual Studio Code). Since this is a full-stack Node.js + Express + React application, we run our backend server and frontend Vite runtime together seamlessly.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your machine:
1. **Node.js**: (Version 18.x or 20.x+ is highly recommended) -> [Download here](https://nodejs.org/)
2. **VS Code**: [Download here](https://code.visualstudio.com/)

---

## 🚀 Step-by-Step Installation

### Step 1: Export or Extract Code
Ensure you have downloaded the project files (via standard export from Google AI Studio) into a folder on your machine, e.g., `~/Projects/LazyZone`.

### Step 2: Open in VS Code
1. Open VS Code.
2. Go to **File** > **Open Folder...** (or `Cmd+O` on Mac / `Ctrl+O` on Windows) and select your project's root folder.

### Step 3: Configure Environment Variables
You will need to create a local `.env` file to configure your API keys.
1. Duplicate the `.env.example` file and rename it to `.env`.
2. Fill inside your keys:
   ```env
   # Your Google Gemini Key
   GEMINI_API_KEY="AIzaSy..."

   # Your xAI Groq API Key (Optional)
   GROQ_API_KEY="gsk_..."

   # Your local port address
   APP_URL="http://localhost:3000"
   ```

### Step 4: Install Dependencies
Open the VS Code Integrated Terminal (**Terminal** > **New Terminal** or ``Ctrl+```) and run:
```bash
npm install
```

---

## 🏃 Running the Application

### Option A: Running from the Terminal (Recommended)
In your VS Code terminal, start the development server by running:
```bash
npm run dev
```
- **What happens:** This triggers the `tsx server.ts` script. 
- It configures Express as the primary host.
- It attaches Vite as dynamic middleware for high-fidelity frontend updates on **http://localhost:3000**.
- Open your browser to **[http://localhost:3000](http://localhost:3000)** to view your application!

---

## 💡 Running/Debugging with VS Code Configurations (Optional)

If you prefer using VS Code's native **Run & Debug** panel:
1. In the root directory, create a folder named `.vscode` if it doesn't exist.
2. Create a file inside named `launch.json` with the following content:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Launch Lazy Zone (Dev)",
         "runtimeExecutable": "npm",
         "runtimeArgs": ["run", "dev"],
         "skipFiles": ["<node_internals>/**"],
         "console": "integratedTerminal"
       }
     ]
   }
   ```
3. Open the **Run and Debug** view in the sidebar (`Ctrl+Shift+D` or `Cmd+Shift+D`).
4. Click the green Play button (**Launch Lazy Zone (Dev)**).

---

## 📦 Production Builds

To compile and verify the build works exactly like the cloud environment:
```bash
# 1. Compile both React code & bundle server.ts with esbuild
npm run build

# 2. Run the final compressed standalone app
npm run start
```
The compiled output is hosted in the `/dist` directory.
