## 🗳️ QuickVote

**QuickVote** is a lightweight, real-time poll platform built for teams that need to make fast, structured decisions. It enables users to create polls, vote live, and view instant results — all with optional anonymity and public access.

---

### 🚀 Features

* ✅ Create and share polls
* 📊 Live result updates with progress bars or charts
* 🔒 Authenticated and anonymous voting
* 🔍 Search polls by title
* 🧑‍💻 Supabase Auth (Email/Password)
* 🌐 Public landing page (no login required)
* 🎨 Responsive UI (React + Tailwind CSS)

---

### 🧱 Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Frontend     | React, Vite, Tailwind CSS        |
| Backend (DB) | Supabase (PostgreSQL + Realtime) |
| Auth         | Supabase Auth                    |
| Deployment   | Vercel                           |

---

### 🛠️ Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/Morg3an/quick-vote.git
cd quickvote
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Supabase

* Create a Supabase project at [https://supabase.com](https://supabase.com)
* Get your **Project URL** and **anon/public key**
* Set up the environment variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Start the Dev Server

```bash
npm run dev
```

---

### ⚙️ Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### 🔐 Supabase Setup Checklist

* ✅ Create `polls` and `votes` tables
* ✅ Add RLS policies:

  * Only one vote per poll per user
  * Allow public read access for `polls` and `votes`
  * Auth required for creating polls
* ✅ Enable Supabase Auth (Email/Password)

---

### 🌍 Deployment (Vercel)

Once ready to deploy, we’ll:

1. Push the code to GitHub.
2. Connect the GitHub repo to [Vercel](https://vercel.com).
3. Add the `.env` variables in Vercel’s project settings.
4. Deploy and test production!

---


### 🙌 Contributing

Contributions, ideas, and feedback are welcome! Just open an issue or submit a pull request.

---

### 📄 License

MIT © 2025 Morgan