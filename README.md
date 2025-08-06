# AimHirePro - Frontend

 **AimHirePro** is a modern, AI-powered resume analysis and job description matcher platform.  
This repository contains the **frontend** of the application built using **React**, **Redux**, **Bootstrap**, and **Material UI**.

---

## Features

- Clean, modern UI for resume and job description input
- Resume analysis and AI-driven JD matching (via backend API)
- Resume preview with modal viewer
- User authentication integration (Login/Register)
- ATS score and skill match visualizations
- Responsive design with mobile support

---

## Tech Stack

| Layer        | Technology         | Purpose                                  |
|--------------|--------------------|------------------------------------------|
| UI Framework | React.js           | Build responsive UI components           |
| State Mgmt   | Redux Toolkit      | Manage app-wide state                    |
| Styling      | Bootstrap 5        | Grid & utility classes                   |
| Components   | Material UI        | UI elements like buttons, dialogs        |
| Routing      | React Router DOM   | Navigate between views                   |
| API          | Axios              | Handle API calls                         |
| Alerts       | React Toastify     | Show notifications and messages          |

---

## Folder Structure (Simplified)

```
aimhire-frontend/
├── public/                   # Static files like index.html and favicon
├── src/
│   ├── assets/              # Images and CSS files
│   ├── components/          # Reusable UI components (buttons, navbar, etc.)
│   ├── pages/               # Route-level pages (Home, Resume Match, etc.)
│   ├── redux/               # Redux store and slices
│   ├── services/            # Axios service files (API calls)
│   ├── App.js               # Main component with route definitions
│   └── index.js             # Entry point of the React app
├── .env.example             # Example environment file (no secrets)
├── package.json             # Dependencies and scripts
└── README.md                # Project overview
```

---

## Live Demo

🔗 [https://aimhirepro.tech](https://aimhirepro.tech)  
---

## Getting Started (Local Setup)

```bash
# 1. Clone the repo
git clone https://github.com/AkankshaMachcha/AimHirePro.git
cd AimHirePro

# 2. Install dependencies
npm install

# 3. Create a .env file
cp .env.example .env
# Add your API base URL in .env

# 4. Start the development server
npm start
```

---

## Note

- This repository only includes the **frontend** of AimHirePro.
- The **backend (Spring Boot)** and **AI matcher (FastAPI)** are hosted separately for security reasons.

---


## Author

**Akanksha Machcha**  
 [LinkedIn](https://www.linkedin.com/in/akanksha-machcha-4b1bbb306/)  
 [GitHub](https://github.com/AkankshaMachcha)
