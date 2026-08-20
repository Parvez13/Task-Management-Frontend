# TaskFlow UI — Frontend Web Client

The responsive web interface for TaskFlow, built with React 18, Vite, and Tailwind CSS. Provides task management with live weather contextualization, Cloudinary file uploads, and session persistence.

---

## 🎨 Features & Highlights

* **Authentication & Protected Routes:** Centralized JWT session handling via React Context API and route guards.
* **Interactive Task Management:** Full CRUD task creation with multipart file uploads and dynamic status toggles (`PENDING` / `DONE`).
* **Live Weather Badging:** Real-time city temperature and condition tags integrated into task cards via backend weather snapshots.
* **Smart Search & Filters:** Debounced text queries and instant dropdown filtering by priority (`HIGH`, `MEDIUM`, `LOW`) and status.
* **Cloudinary Attachment Viewer:** Direct preview and download access for documents and image attachments.
* **Axios Interceptors:** Automatic Bearer token header injection on every outgoing request with graceful `401 Unauthorized` session cleanup.

---

## 🛠️ Tech Stack

* **Core:** React 18, Vite
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Routing:** React Router DOM (v6)
* **HTTP Client:** Axios
* **Icons:** Lucide React

---

## 📁 Project Structure

```text
frontend/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI elements
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskFormModal.jsx
│   ├── context/            # AuthContext & state providers
│   │   └── AuthContext.jsx
│   ├── pages/              # Primary route views
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/           # Axios instance & interceptors
│   │   └── api.js
│   ├── App.jsx             # Top-level routing layout
│   ├── index.css           # Tailwind directives & base styles
│   └── main.jsx            # React root mount
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind design system configuration
└── vite.config.js          # Vite build settings
