#  Smart Scheduler

A full-stack scheduling assistant built for the SWE 363 course. This project helps users manage their time and schedule smartly, using a React frontend, Node.js backend, and (soon) MongoDB database.

---

## 📁 Project Structure

```plaintext
SWE363_project/
├── client/               # React frontend
├── server/               # Node.js + Express backend
│   ├── routes/
│   ├── .env              # environment variables (ignored in Git)
│   ├── .env.example      # Template for teammates
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── README.md
└── .gitignore            # (optional, root level)
```

---

## Getting Started (Frontend Only – Phase 4)

### Prerequisites
- Node.js
- npm
- Git

---
## 📥 Step 1: Clone the Project

Run the following to clone the repository and enter the project folder:

```bash
git clone https://github.com/Ali-Mashni/smart-scheduler.git
cd smart-scheduler
```

---

## 💻 Step 2: Install and Run the Frontend (React)

Install the dependencies and start the development server:

```bash
cd client
npm install
npm start
```

This will start the React app at:  
`http://localhost:3000`

> Make sure this exists in `client/package.json`:

```json
"proxy": "http://localhost:5000"
```

---

## 🔧 Step 3: (Optional) Run the Backend (Node.js + Express)

This backend is **optional for this phase**, but ready for future use. Here's how to run it locally if needed:

### 🛠 Install Backend Dependencies

```bash
cd server
npm install
```

Then, create a `.env` file in the `server/` folder with the following content: 
```js
PORT=5000
```
### ▶️ Run the Backend with nodemon

If you do **not** have nodemon installed globally, install it as a **dev dependency**:

```bash
npm install --save-dev nodemon
```

Then start the server with:

```bash
npm run dev
```

Or, if nodemon is installed globally:

```bash
nodemon server.js
```

This will run the backend at:  
`http://localhost:5000`

---

## Team Members

- Ali  
- Teammate 1  
- Teammate 2