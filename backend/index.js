const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

// Middleware
app.use(express.json());

// Allow CORS from your frontend domain
app.use(
  cors({
    origin: "https://contact-book-app-xi.vercel.app", // replace with your frontend URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const dbPath = path.join(__dirname, "contacts.db");
let db = null;

// Initialize database and server
const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT
      )
    `);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running at https://contact-book-syl9.onrender.com`);
    });
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// POST /contacts - Add a contact
app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }

    const existingContact = await db.get(`SELECT * FROM contacts WHERE email = ?`, [email]);
    if (existingContact) return res.status(400).json({ error: "Email already exists" });

    const dbResponse = await db.run(
      `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`,
      [name, email, phone]
    );

    res.status(201).json({ id: dbResponse.lastID, name, email, phone });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /contacts - Get contacts with pagination
app.get("/contacts", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const contactsArray = await db.all(`SELECT * FROM contacts LIMIT ? OFFSET ?`, [limit, offset]);
    const totalResult = await db.get(`SELECT COUNT(*) AS total FROM contacts`);
    res.json({ total: totalResult.total, contactsArray });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /contacts/:id - Delete a contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dbResponse = await db.run(`DELETE FROM contacts WHERE id = ?`, [id]);
    if (dbResponse.changes === 0) return res.status(404).json({ error: `Contact with id ${id} not found` });
    res.json({ message: `Contact ${id} deleted successfully` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
