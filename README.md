# Competitive English Vocabulary Learning Platform

> A production-quality, full-stack web application designed for competitive-exam aspirants in India (SSC, Banking, UPSC, RBI, State PSCs, etc.).

---

## 🎯 Core Product Philosophy

1. **No Exam Silos**: High-frequency, high-yield vocabulary is universally essential across all competitive exams. The platform does not fragment learning into artificial categories like "Banking vs SSC". The entire collection serves as high-yield competitive vocabulary.
2. **Content-Oriented Categorization**: Groupings are structured by domain (Economy, Governance, Science, Politics, Society, General), not exam labels.
3. **Multi-Type Linguistic Architecture**: Built from day one to support:
   - **Words**
   - **Idioms**
   - **Phrases**
   - **Phrasal Verbs**
   - **One-Word Substitutions**
4. **Targeted Initial Launch**: Launching with **exactly 1,000 curated vocabulary words**, with future phases introducing user-generated content and remaining linguistic categories.
5. **Decoupled User Progress & Learning Retention**: Strict decoupling between content and user progress for infinite scalability.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js (Modular Layered Architecture)
- **Database**: MongoDB via Mongoose ODM
- **Security**: Helmet, CORS with credential handling, HttpOnly secure cookies, rate limiting

---

## 🚀 Phase-by-Phase Roadmap

- [x] **Phase 1: Project Setup & Core Foundation** (Scaffolding, layout, health checks, environment setup)
- [ ] **Phase 2: Database Schemas & 1,000 Initial Word Seed Dataset**
- [ ] **Phase 3: Production Authentication & User System**
- [ ] **Phase 4: Vocabulary Explorer, Search Engine & A-Z Filtering**
- [ ] **Phase 5: User-Added Content & Custom Vocabulary Management**
- [ ] **Phase 6: Bookmarking, Mastery Tracking & Personal Notes**
- [ ] **Phase 7: Scalable Quiz Engine & Intelligent Distractor Generation**
- [ ] **Phase 8: Analytics Dashboard & Spaced Repetition Revision System**
- [ ] **Phase 9: Production Hardening, Optimization & Deployment**

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js >= 18
- MongoDB (Local instance or MongoDB Atlas cluster URI)

### 2. Environment Configuration
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Run Development Servers
To run both backend API (`http://localhost:5000`) and frontend client (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Alternatively, run each service independently:
```bash
# In one terminal (Backend on :5000)
npm run dev:server

# In another terminal (Frontend on :5173)
npm run dev:client
```

---

## 🩺 Health Check Endpoint
- `GET /api/v1/health` on `http://localhost:5000/api/v1/health`
- Returns system uptime, environment, timestamp, and live MongoDB connection state.
