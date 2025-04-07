# 🧠 Smart Scheduler

A full-stack scheduling assistant built for the SWE 363 course. This project helps users manage their time and schedule smartly, using a React frontend, Node.js backend, and (soon) MongoDB database.

---

## 📁 Project Structure

```plaintext
SWE363_project/
├── client/               # React frontend
├── server/               # Node.js + Express backend
│   ├── routes/
│   ├── .env              # Your environment variables (ignored in Git)
│   ├── .env.example      # Template for teammates
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── README.md
└── .gitignore            # (optional, root level)


---

## 🚀 Getting Started (Frontend Only – Phase 4)

### ⚙️ Prerequisites
- Node.js
- npm
- Git

---

## ⚛️ Frontend (React)

To run the frontend locally:

```bash
cd client
npm install
npm start
```

This will start the React app at:  
`http://localhost:3000`

> Make sure you have the proxy set in `client/package.json`:

```json
"proxy": "http://localhost:5000"
```

---

## 🧪 Backend (Optional for This Phase)

Although this project includes a Node.js backend (`/server`), **you do not need to run or use it for this phase**.

The backend is prepared for future milestones when integrating real data and user functionality.

If you'd like to explore or test the backend locally (for development purposes only), follow these steps:

### First Time Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following content:
PORT=5000

### ▶️ Run Backend with nodemon

If you installed **nodemon** as a dev dependency, run:

```bash
npm run dev
```

Or if installed globally:

```bash
nodemon server.js
```

This will run the backend at:  
`http://localhost:5000`

---

## 🧑‍💻 Team Members
- Ali 
- Teammate 1
- Teammate 2