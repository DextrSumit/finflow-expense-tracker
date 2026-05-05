# FinFlow – Smart Expense Tracker

> A modern, full-stack expense tracker with authentication, real-time data, and smart insights.

![Version](https://img.shields.io/badge/version-1.1.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration with **OTP email verification** (Nodemailer + Gmail)
- JWT-based login with 7-day token expiry
- Protected API routes — every user sees only their own data
- Change password with old password verification
- Auto logout on token expiry

### 🏠 Landing Page
- Premium fintech-inspired hero section with gradient accents
- Smooth scroll navigation with sticky navbar
- Feature showcase grid with hover animations
- Step-by-step "How it works" section
- About section with live dashboard preview card & AI insight float
- Responsive CTA sections and footer

### 📊 Dashboard
- Total balance, income & expense stats (all time)
- This month's summary — income, expenses, net, budget %
- AI-powered spending insights (month-over-month, savings rate, top category)
- Recent transactions with edit/delete
- Category budget progress bars

### 💸 Transactions
- Add, edit, delete transactions
- Fields: amount, type, category, date, description, recurring
- Search by keyword
- Filter by category, type, date range
- Net summary bar (income / expense / net)
- Export to **CSV**

### 🎯 Budget Planner
- Set total monthly budget
- Per-category limits with live progress bars
- Overspending alerts (amber at 80%, red at 100%)
- Strict calendar month tracking (industry standard)

### 📈 Analytics
- **Doughnut chart** — category-wise expenses (current month)
- **Bar chart** — income vs expenses (last 6 months)
- **Line chart** — spending trend over time
- Summary stats — avg income, avg expense, best savings month
- Export **PDF report** (browser native)

### 👤 User Profile
- View and edit display name (inline editing with save/cancel)
- **Emoji avatar picker** — 20 themed avatars with colored backgrounds
- Fallback to initials when no avatar is selected
- Account stats — balance, income, expenses, savings rate
- Activity summary — total transactions, income/expense count
- Change password with validation
- Logout

### 🎨 UI/UX
- Premium fintech-inspired design with glassmorphism elements
- **Dark mode** toggle (persisted)
- Fully **responsive** — sidebar on desktop, bottom nav on mobile
- Smooth animations and micro-interactions
- Empty states and loading indicators
- Sticky page header with date and quick-add button

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 | UI framework |
| Chart.js 4 + react-chartjs-2 | Data visualization |
| date-fns | Date utilities |
| Lucide React | Icons |
| DM Sans + DM Mono | Typography |
| CSS Custom Properties | Theming & dark mode |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 9 | Database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password & OTP hashing |
| Nodemailer | OTP email delivery |
| dotenv | Environment variables |
| nodemon | Dev auto-restart |

---

## 📁 Project Structure

```
finflow-client/                   ← React frontend (port 3000)
  src/
    context/
      AppContext.jsx               # Global state — auth, transactions, budgets, theme
    components/
      Sidebar.jsx                  # Desktop navigation
      MobileNav.jsx                # Mobile bottom tab bar
      UI.jsx                       # Reusable: Card, Btn, Modal, Input, Badge, etc.
      TxItem.jsx                   # Transaction list row
      TransactionModal.jsx         # Add / Edit transaction form
      AIInsights.jsx               # Auto-generated spending insight cards
    pages/
      LandingPage.jsx              # Public landing page with hero, features, about
      Dashboard.jsx                # Overview page
      Transactions.jsx             # Full transaction list with filters
      Budget.jsx                   # Budget planner (strict calendar month)
      Analytics.jsx                # Charts + PDF export
      Profile.jsx                  # User profile + avatar picker + settings
      AuthPage.jsx                 # Login / Register / OTP verify screens
    hooks/
      useTransactionFilter.js      # Search, filter, sort logic
    utils/
      api.js                       # All fetch calls to backend API
      avatarUtils.js               # Emoji avatar options & lookup
      helpers.js                   # fmt, fmtDate, exportCSV, getLast6Months
      pdfExport.js                 # Browser-native PDF report generator
    App.jsx                        # Root — landing/auth guard + routing
    index.js                       # Entry point
    index.css                      # CSS variables, animations, responsive breakpoints

finflow-server/                   ← Express backend (port 5000)
  models/
    User.js                        # name, email, password, avatar, isVerified, otp
    Transaction.js                 # type, amount, category, date, desc, recur, user
  routes/
    auth.js                        # /register, /login, /verify-otp, /resend-otp
    transactions.js                # GET, POST, PUT, DELETE /transactions
    budgets.js                     # /budgets (placeholder)
    profile.js                     # GET, PUT /profile, PUT /change-password
  middleware/
    authMiddleware.js              # JWT verification for protected routes
  server.js                        # Entry point — Express + MongoDB connection
  .env                             # Secrets (never commit!)
  package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Gmail account with App Password enabled

### 1. Clone & install

```bash
# Frontend
cd finflow-client
npm install

# Backend
cd ../finflow-server
npm install
```

### 2. Configure environment

Create `finflow-server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finflow?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
PORT=5000
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

> **EMAIL_PASS** is a Gmail App Password, not your real password.
> Get it from: Google Account → Security → App Passwords

### 3. Run both servers

```bash
# Terminal 1 — Backend
cd finflow-server
npm run dev
# Should print: ✅ MongoDB connected! ✅ Server running on port 5000

# Terminal 2 — Frontend
cd finflow-client
npm start
# Opens http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register + send OTP email |
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/verify-otp` | Verify email with OTP |
| POST | `/api/auth/resend-otp` | Resend OTP to email |

### Transactions (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all user transactions |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Profile (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update name / avatar |
| PUT | `/api/profile/change-password` | Change password |

---

## 📋 Changelog

### v1.1.0 — Improved UI
- ✨ Premium fintech-inspired landing page with hero, features, about & CTA sections
- ✨ Emoji avatar picker with 20 themed avatars and colored backgrounds
- ✨ Redesigned profile page with inline name editing and stats cards
- 🎨 Improved overall UI polish — animations, spacing, and micro-interactions
- 🎨 Sticky navbar with glassmorphism on scroll
- 🐛 Various bug fixes and responsive layout improvements

### v1.0.0 — Initial Release
- Full authentication flow with OTP email verification
- Dashboard, transactions, budget planner, analytics
- Dark mode, CSV export, PDF reports
- User profile with password management

---

## 🗺 Roadmap (v2.0)

- [ ] Forgot password via OTP
- [ ] Recurring transaction automation (auto-create on due date)
- [ ] Financial goals tracker
- [ ] Bill reminders via email (node-cron)
- [ ] Multi-wallet support (cash, bank, credit card)
- [ ] Shared budgets (family/couple mode)
- [ ] Toast notifications (replace browser alerts)
- [ ] Receipt image upload (Cloudinary)

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (12 salt rounds)
- OTPs are hashed before storing (10 salt rounds)
- OTPs expire after **10 minutes**
- JWT tokens expire after **7 days**
- All transaction routes verify ownership (`user: req.userId`)
- `.env` file is gitignored — never commit secrets

---

## 📝 License

MIT — free to use, modify, and distribute.

---

Built with ❤️ using React + Node.js + MongoDB