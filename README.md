#  CareerGuide AI

## Overview

CareerGuide AI is a full stack web app powered by AI to guide students and aspiring developers in their career preparation journey.

Users can upload their resume or enter a target job role for a detailed skills analysis. The platform develops a tailored learning path according to the identified skill gaps, suggests industry relevant projects, offers AI-powered project guidance, reviews project code, and lastly suggests appropriate job roles considering the user’s acquired skills and project experience.

The platform provides a structured, end-to-end learning experience that prepares users for interviews and the industry.

## Features

- Resume & Job Role Examination
- AI-Driven Skill Gap Identification
- Customized Learning Path
- Weekly and daily learning plans
- AI Project Suggestions
- Day by Day Project Planner
- Chat with AI Project Mentor
- AI code review-Role Suggestions
- Unlock features one by one
- Auto-progression On Role Reset
- User Authentication & User Profile Management

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI Integration
- Google Gemini API
- Groq API

### Other Libraries
- Multer
- bcryptjs
- dotenv
- React Markdown
- Rehype Highlight

## How It Works

```text
Resume Upload / Target Role
            │
            ▼
      Skill Analysis
            │
            ▼
    Known & Missing Skills
            │
            ▼
 Personalized Learning Roadmap
            │
            ▼
 Complete Weekly Learning Plan
            │
            ▼
      Project Recommendations
            │
            ▼
      Select a Project
            │
            ▼
 Day-by-Day Project Planner
            │
            ▼
      AI Project Mentor Chat
            │
            ▼
      AI Code Review
            │
            ▼
     Job Role Suggestions
```

## Screenshots

### Login Page

<img width="1907" height="876" alt="image" src="https://github.com/user-attachments/assets/3b0a10aa-f781-4177-bd63-8c7cc18dcbb0" />

### SignUp Page

<img width="1911" height="882" alt="image" src="https://github.com/user-attachments/assets/526b15b0-cba3-4bac-82e0-f35d6f664016" />

### Dashboard

<img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/8a5e7da9-d1e0-4e27-8f87-22a63a1c1fc7" />

### Skill Analysis

<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/f1a42937-a998-4b24-8297-ef542e23b9cd" />

### Learning Roadmap

<img width="1903" height="902" alt="image" src="https://github.com/user-attachments/assets/d9ba03e3-9fc7-42d0-95b0-6bac21d75fbc" />

### Daily Learning Plan

<img width="1912" height="906" alt="image" src="https://github.com/user-attachments/assets/f2ba56d0-a3ca-4027-b0de-4bfab7ed7fbb" />

### Project Planner

<img width="1910" height="902" alt="image" src="https://github.com/user-attachments/assets/16d7b12b-224e-4ee8-a176-c9876f61260c" />

### Project Route

<img width="1917" height="901" alt="image" src="https://github.com/user-attachments/assets/a12631fa-3203-46b9-ae48-92c58ee188ca" />

### AI Mentor Chat

<img width="1907" height="906" alt="image" src="https://github.com/user-attachments/assets/8223081f-2bfa-436d-90c4-d3e9a93af633" />

### Code Review

<img width="1910" height="910" alt="image" src="https://github.com/user-attachments/assets/510c4695-2b67-41c9-83ea-06b6f032f06c" />

### Job Role Suggestions

<img width="1910" height="905" alt="image" src="https://github.com/user-attachments/assets/0f25553f-c5aa-4b7e-ab83-9d7da1dbabdc" />

## Installation

### Clone Repository

```bash
git clone https://github.com/arelli-sanjay/CareerGuide-AI.git
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

GEMINI_API_KEY=your_api_key

GROQ_API_KEY=your_api_key
```

Run Backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## Live Demo

**comming soon**

## What I Learned

As I built CareerGuide AI I learned by doing:

- Building scalable full-stack MERN apps
- RESTful API Development using Express.js
- JWT Authentication & Protected Routes Implementation
- MongoDB schema design & DB management
- Inclusion of Large Language Models (LLMs) for AI-powered functionalities
- Prompt engineering for structured AI outputs
- Uploading and processing files with Multer- AI driven skill analysis & Roadmap creation
- Dynamic project planning & feature-unlock logic
- Workflows for job recommendation systems and code reviewing
- React Hooks State Management
- local storage for data persistence
- handling of user specific data
- Error handling, fallbacks and API integration-Deploying full-stack application on Render and Vercel

## Author

**ARELLI SANJAY**
- GitHub: https://github.com/arelli-sanjay
- Linkedin: https://www.linkedin.com/in/sanjay-arelli-2b0970383/

## Support
If you like CareerGuide AI consider giving it a star, on GitHub.
