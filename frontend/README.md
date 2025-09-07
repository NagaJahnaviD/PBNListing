# MERN Web Application

This project is a MERN stack web application with separate `frontend` and `backend` directories.  
The frontend is built with **Vite + React** (using `react-hook-form`, `react-router-dom`) and the backend is powered by **Express, Mongoose, CORS**, etc.

---

## Getting Started

### 1. Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

### 2. Install dependencies

Backend

  cd backend
  npm install


Frontend

cd ../frontend
npm install

### 3. Setup environment variables

Backend

PORT=3000
DBURL=mongodb://localhost:27017/openpixel_pbnlisting

Frontend

REACT_APP_API_BASE_URL=hhttp://localhost:3000

### 4. Run the application

Backend

cd backend
npm start


Frontend

cd ../frontend
npm run dev
