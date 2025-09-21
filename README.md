
# Contact Book App

A modern, full-stack web application to manage and organize your contacts. Users can add, view, delete contacts, and browse through them with pagination. The UI is responsive and works smoothly on both desktop and mobile devices.

## 🧰 Tech Stack

* **Frontend**: React.js, CSS
* **Backend**: Node.js with Express
* **Database**: SQLite3

## 🚀 Key Features

* Add new contacts via a form with validation
* View a paginated list of contacts
* Delete existing contacts
* Responsive UI for mobile and desktop
* Client-side and server-side input validation

## 📂 Repository Structure

```
contact-book-app/
├── backend/          # Node.js server and API routes and Sqlite3 database
├── frontend/         # React.js frontend code
├── .gitignore        # Files to ignore in Git
└── README.md         # Project documentation
```

## 💻 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BhagyasriLabhana/contact-book-app.git
cd contact-book-app
```

Create `.gitignore` in root to ignore `node_modules`, `.env`, etc.

---

### 2. Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Initialize npm and install dependencies:

```bash
npm init -y
npm install express sqlite3 cors dotenv
npm install nodemon --save-dev  # optional for auto-reload
```

3. Setup Express server (`index.js` or `server.js`):

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

4. Database setup (SQLite3 example):

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/contacts.db');

db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT
)`);
```

---

### 3. Backend API Endpoints

| Method | Endpoint        | Description                                         |
| ------ | --------------- | --------------------------------------------------- |
| POST   | `/contacts`     | Add a new contact                                   |
| GET    | `/contacts`     | Fetch contacts with pagination (`?page=1&limit=10`) |
| DELETE | `/contacts/:id` | Delete a contact by ID                              |

* Use **Postman** or **curl** to test endpoints
* Validate inputs on server-side to prevent invalid data

---

### 4. Frontend Setup (React)

1. Navigate to frontend folder:

```bash
cd ../frontend
```

2. Create React app (if not already):

```bash
npx create-react-app .
npm install axios
```

3. Run the frontend:

```bash
npm start
```

The app runs on `http://localhost:3000`. Backend API runs on port `5000`.

---

### 5. Frontend Components

* **App Component**: Main container, handles state for contacts, form, and pagination
* **Form Component**: Add new contacts with validation (email regex, 10-digit phone)
* **Contact List Component**: Display contacts with delete button
* **Pagination Component**: Navigate through pages of contacts

---

### 6. Input Validation

* **Client-side**:

  * Email format: `/^\S+@\S+\.\S+$/`
  * Phone: 10 digits, numeric only `/^\d{10}$/`
  * Display error messages below inputs

* **Server-side**: Re-validate all inputs before saving to DB

---

### 7. Integration & Testing

* Start both backend and frontend servers
* Test adding, viewing, deleting contacts
* Ensure pagination works correctly


---

### 8. Deployment

* Push code to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

* Deploy frontend to **Vercel** and backend to **Render** or **Heroku**
* Ensure API URLs are correctly configured in frontend for production

---


