# Medblock Assignment

A modern in-browser patient management dashboard built with React, PGlite (browser Postgres), and Tailwind CSS.

---

## 🚀 Setup

1. **Clone the repository**
   ```sh
   git clone 
   cd 
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🩺 Features

- **Doctor Authentication:** Register and log in as a doctor.
- **Register Patient:** Fill out the form to add new patients.
- **Query Patients:** Use the SQL editor to run custom queries on your patient database.
- **Live Patient List:** See all your registered patients in real time.
- **Multi-tab Sync:** Data updates instantly across all open tabs.
- **Data Persistence:** Patient and doctor data are stored in your browser (IndexedDB) and persist across refreshes.

---

## 🖥️ Dashboard UI

![Dashboard Screenshot](https://github.com/user-attachments/assets/292f63ec-6fdd-4fa1-bb93-9957c6c6296c)
- **Left** Register Patient form.
- **Right:** Query Patients section with a SQL editor and patient results table.
- **Header:** App title, user info, and logout button.
- **Blue gradient background** for a modern, clean look.

---

## 🛠️ Tech Stack

- **React** (with hooks)
- **PGlite** (PostgreSQL in the browser)
- **IndexedDB** (for persistent storage)
- **Tailwind CSS** (for styling)
- **React Toastify** (for notifications)

---

## 📚 References

- [PGlite Documentation](https://pglite.dev/docs/)
- [PGlite Multi-worker](https://pglite.dev/docs/multi-tab-worker)
- [PGlite React Hooks](https://pglite.dev/docs/framework-hooks/react)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Enjoy using your in-browser patient management dashboard!**
