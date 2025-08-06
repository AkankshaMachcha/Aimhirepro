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

## Folder Structure

```
aimhire-frontend/
├── public/                         # Static files
├── src/
│   ├── assets/                    # Images, logos, other media
│   ├── components/               # Reusable React components (e.g. Navbar, Modal)
│   ├── constants/                # Constants like enums, config variables
│   ├── hooks/                    # Custom React hooks (e.g. token expiry check)
│   ├── pages/                    # Route-level pages (Home, Dashboard, etc.)
│   ├── redux/                    # Redux slices and store configuration
│   ├── routes/                   # React Router route definitions
│   ├── services/                 # API service layer (Axios)
│   ├── styles/                   # Custom CSS or style modules
│   ├── App.js                    # Main app component and router
│   ├── index.js                  # App entry point
│   ├── App.css / index.css       # Global styling
│   └── setupTests.js             # Testing setup
├── .env.example                   # Sample env file (no real secrets)
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

---

## 🌐 Live Demo

🔗 [https://aimhirepro.tech](https://aimhirepro.tech)  

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/AkankshaMachcha/AimHirePro.git
cd AimHirePro

# 2. Install dependencies
npm install

# 3. Create a .env file from example
cp .env.example .env
# Add your API_BASE_URL in the .env file

# 4. Start development server
npm start
```

---

## Note

- This repo contains **only the frontend** part of AimHirePro.
- The **backend (Spring Boot)** and **AI matching engine (FastAPI)** are hosted and managed separately for security reasons.

---


## Author

**Akanksha Machcha**  
 [LinkedIn](https://www.linkedin.com/in/akanksha-machcha-4b1bbb306/)  
 [GitHub](https://github.com/AkankshaMachcha)
