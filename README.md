#  Smart Scheduler

A full-stack scheduling assistant built for the SWE 363 course. This project helps users manage their time and schedule smartly, using a **React frontend styled with Tailwind CSS**, a Node.js backend, and (soon) MongoDB database.

---

## 📁 Project Structure

```plaintext
smart-scheduler/
├── client/                         # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Full screen/page views
│   │   ├── assets/                 # Images, logos, etc.
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
├── server/                         # Node.js + Express backend
│   ├── routes/
│   ├── .env                        # Environment variables (ignored by Git)
│   ├── .env.example                # Template for teammates
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── README.md
└── .gitignore                      # (optional) Root-level ignore file
```

---

## Getting Started (Frontend Only – Phase 4)

### Prerequisites
- Node.js
- npm
- Git

---
## 📥 Step 1: Clone the Project

Run the following commands to clone the repository and set up the frontend:

```bash
git clone https://github.com/Ali-Mashni/smart-scheduler.git  
cd smart-scheduler/client
```

---

## 💻 Step 2: Install and Run the Frontend (React)

Install the necessary dependencies and start the development server:

```bash
npm install  
npm start
```

This will launch the React app locally at:  
`http://localhost:3000`

---
## 🧪 Usage Instructions and Examples

After running the app (`npm start`), the browser will automatically open to the **Home Page**:

![Home Page](./client/src/assets/Phase1_images/homePage.png) 

From here, users can:

- Explore the content of the home page.
- Navigate to `Login`, `Signup`, or `FAQ` using the top navigation bar.

### 🔐 Login Behavior

The app uses **hardcoded mock users** for demonstration during Phase 5. Based on login credentials, users will be redirected to different dashboard pages:

| Role               | Username   | Password | Redirected Page  |
|--------------------|------------|----------|------------------|
| Admin              | `admin`    | `admin`  | `/admin`         |
| Student            | `student`  | `123`    | `/schedule`      |
| Customer Service   | `support`  | `helpme` | `/faq-management`|

To test this:
1. Click `Login` from the top bar.
2. Enter any of the above credential pairs.
3. You will be redirected to the corresponding interface.

Each role has a different UI depending on their responsibilities.

> This login system is mock-only and will be replaced with real backend authentication in future phases.

### 🧭 Role-Based Walkthrough (With Examples)

#### 📝 Signup Page

The **Signup Page** showcases a modern form with a two-panel layout and built-in input validation. It is currently mock-only (non-functional backend) but includes real-time checks for:

- Empty required fields (all fields must be filled)
- Valid email format
- Minimum password length (8 characters)
- Matching password and confirmation fields

![Signup Page](./client/src/assets/Phase1_images/signup.png)

---
#### 🛠️ Admin Interface

1. Go to the `Login` page.
2. Use the credentials:
   - **Username**: `admin`  
   - **Password**: `admin`
3. You will be redirected to the **Admin Dashboard** (`/admin`).

Example screenshots:

- ![Admin Dashboard - Overview](./client/src/assets/Phase1_images/admin_dashboard_1.png)
- ![Admin Dashboard - Details](./client/src/assets/Phase1_images/admin_dashboard_2.png)

---

#### 🎓 Student Interface

1. Return to the `Login` page.
2. Use the credentials:
   - **Username**: `student`  
   - **Password**: `123`
3. You will be redirected to the **Student Schedule Page** (`/schedule`).

Example screenshots:

- ![Student Dashboard - Overview](./client/src/assets/Phase1_images/student_dashboard_1.png)
- ![Student Dashboard - Timetable](./client/src/assets/Phase1_images/student_dashboard_2.png)

---

#### 💬 Customer Service Interface

1. Go back to the `Login` page again.
2. Use the credentials:
   - **Username**: `support`  
   - **Password**: `helpme`
3. You will be redirected to the **FAQ Management Page** (`/faq-management`).

Example screenshots:

- ![Support Dashboard - Overview](./client/src/assets/Phase1_images/support_dashboard_1.png)
- ![Support Dashboard - Requests](./client/src/assets/Phase1_images/support_dashboard_2.png)
##  Team Members

| Name               | Role / Contribution                                                                 |
|--------------------|--------------------------------------------------------------------------------------|
| Ali Mashni         | Project Integration, Home Page, Login & Signup Implementation                       |
| Khalid Alshehri    | Student Pages Development                                                            |
| Sultan Alatawi     | Student Pages Development                                                            |
| Moath Alzahrani    | Admin Pages Development                                                              |
| Fahad Alathel      | Customer Service Pages Implementation                                                |
---



