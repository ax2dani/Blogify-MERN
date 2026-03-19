<div align="center">

# ✍️ Blogify

### A Full-Stack Social Blogging Platform

**Write the Moment. Share the Connection.**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

</div>

---

## 📖 About

**Blogify** is a production-grade social blogging platform built with the MERN stack. It goes beyond a simple blog — it's a fully-featured content ecosystem with real-time interactions, user identity systems, notifications, bookmarking, and a glassmorphism-inspired dark/light UI.

Built as a portfolio-grade project demonstrating advanced full-stack architecture, performance optimization, and modern UI/UX design patterns.

---

## ✨ Features

### Core Platform
- 📝 **Rich Article Publishing** — Create, edit, and delete blog posts with cover image uploads
- 💬 **Real-Time Comments** — WebSocket-powered live commenting via Socket.IO
- ❤️ **Like System** — Interactive like/unlike toggle on posts
- 🔍 **Full-Text Search** — MongoDB text indexing across titles, content, and tags
- 🏷️ **Tag Filtering** — Browse articles by topic tags
- 📄 **Pagination** — Server-side paginated feeds for performance

### User Identity
- 🔐 **JWT Authentication** — Secure token-based auth with role-based access control (Admin/User)
- 👤 **User Profiles** — Bio, gender, interests, avatar uploads, post & comment history timelines
- ✏️ **Profile Editing** — Update identity metadata and upload profile pictures via Multer
- 🔑 **Password Recovery** — Cryptographic reset tokens dispatched via Nodemailer SMTP

### Social Engagement (V5)
- 🔔 **Notification Engine** — Database-triggered alerts when users like or comment on your posts
- 🔖 **Bookmarking** — Save articles to a personal read-later queue
- 🧭 **Icon-Centric Navigation** — Modern Lucide React icon-based navbar with dynamic unread badges

### UI/UX
- 🌗 **Dark & Light Mode** — Theme toggle persisted in localStorage
- 🎨 **Glassmorphism Design** — Premium frosted-glass aesthetic with CSS custom properties
- ⚡ **Framer Motion** — Smooth page transitions and micro-animations
- 🖼️ **Lazy Loading** — Custom IntersectionObserver-based image loading with shimmer placeholders
- 📱 **Responsive Layout** — Grid-based design that adapts to all screen sizes

### Security & Performance
- 🛡️ **Helmet** — HTTP security headers
- 🚦 **Rate Limiting** — API request throttling via express-rate-limit
- 🧹 **Optimized Queries** — Selective field projection and lean database populations
- ✂️ **Code Splitting** — React.lazy() for route-level bundle optimization

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Framer Motion, Lucide React, Socket.IO Client |
| **Backend** | Node.js, Express 5, Socket.IO, Multer, Nodemailer, Helmet, express-rate-limit |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Styling** | Vanilla CSS with CSS Custom Properties (no Tailwind) |

---

## 📁 Project Structure

```
Blog Flow/
├── blogify-backend/          # Express REST API + WebSocket Server
│   ├── controllers/          # Route handlers (posts, comments, auth, profiles, bookmarks, notifications)
│   ├── middleware/            # JWT auth & RBAC middleware
│   ├── models/               # Mongoose schemas (User, Post, Comment, Notification)
│   ├── routes/               # API route definitions
│   ├── uploads/              # Multer file storage (images, avatars)
│   ├── utils/                # Email utility (sendEmail.js)
│   ├── server.js             # App entry point
│   └── .env                  # Environment variables
│
├── blogify-frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, PostCard, LazyImage, BackButton)
│   │   ├── context/          # React Context (AuthContext, ThemeContext)
│   │   ├── pages/            # Route pages (Landing, Home, PostDetails, Profile, Dashboard, etc.)
│   │   ├── App.jsx           # Router configuration
│   │   └── index.css         # Global design system
│   └── vite.config.js        # Vite config with API proxy
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Blogify-MERN.git
cd Blogify-MERN
```

### 2. Setup the Backend

```bash
cd blogify-backend
npm install
```

Create a `.env` file in `blogify-backend/`:

```env
MONGO_URI=mongodb://localhost:27017/blogify
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_NAME=Blogify
PORT=5000
```

Start the server:

```bash
npm run start
```

### 3. Setup the Frontend

```bash
cd blogify-frontend
npm install
npm run dev
```

### 4. Open in Browser

Navigate to **http://localhost:5173** — the Vite dev server automatically proxies API requests to the Express backend on port 5000.

> 💡 **Tip:** The first user to register is automatically assigned the **ADMIN** role.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |
| `POST` | `/api/auth/forgotpassword` | Request password reset email | ❌ |
| `PUT` | `/api/auth/resetpassword/:token` | Reset password with token | ❌ |
| `GET` | `/api/posts` | Get paginated posts (search & tag filter) | ❌ |
| `GET` | `/api/posts/:id` | Get single post with comments | ❌ |
| `POST` | `/api/posts` | Create a new post | ✅ |
| `PUT` | `/api/posts/:id` | Update a post | ✅ |
| `DELETE` | `/api/posts/:id` | Delete a post | ✅ |
| `POST` | `/api/posts/:id/like` | Toggle like on a post | ✅ |
| `POST` | `/api/comments` | Add a comment | ✅ |
| `DELETE` | `/api/comments/:id` | Delete a comment | ✅ |
| `GET` | `/api/profiles/:username` | Get public user profile | ❌ |
| `PUT` | `/api/profiles/me` | Update own profile | ✅ |
| `POST` | `/api/bookmarks/:postId` | Toggle bookmark | ✅ |
| `GET` | `/api/bookmarks` | Get saved articles | ✅ |
| `GET` | `/api/notifications` | Get all notifications | ✅ |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | ✅ |
| `POST` | `/api/upload` | Upload an image file | ❌ |

---

## 📜 Version History

| Version | Highlights |
|---------|-----------|
| **V1** | Core CRUD, JWT Auth, Pagination, Glassmorphism UI, Lazy Loading |
| **V2** | Dark/Light Mode, Rich Text Editor, Socket.IO Live Comments, Multer Uploads, Framer Motion |
| **V3** | Author Moderation, Cryptographic Password Reset via SMTP |
| **V4** | Marketing Landing Page, User Profiles (Bio/Avatar/Interests), Post Editing |
| **V5** | Notification Engine, Bookmarking, Icon-Centric Navbar, Performance Optimization |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using the MERN Stack</sub>
</div>
