const express = require("express");
const path = require("path");
const cors =  require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json()); 
app.use(cors());

const dbPath = path.join(__dirname, "contacts.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT
      )
    `);

    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// API Endpoints

//Creating Contacts API

app.post("/contacts", async (request, response) => {
  try {
    const { name, email, phone } = request.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return response.status(400).json({ error: "Name, email, and phone are required" });
    }

    // Check if email already exists
    const existingContact = await db.get(
      `SELECT * FROM contacts WHERE email = ?`,
      [email]
    );

    if (existingContact) {
      return response.status(400).json({ error: "Email already exists" });
    }

    const insertQuery = `
      INSERT INTO contacts (name, email, phone)
      VALUES (?, ?, ?)
    `;
    const dbResponse = await db.run(insertQuery, [name, email, phone]);

    const contactId = dbResponse.lastID;

    response.status(201).json({
      id: contactId,
      name,
      email,
      phone,
    });
  } catch (e) {
    response.status(500).json({ error: e.message });
  }
});


// Get Contact API

app.get("/contacts",async(request,response)=>{
  try{
  let {page=1,limit=10} = request.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = (page-1)*limit;

  const getContactsQuery = `
    SELECT * FROM contacts
    LIMIT ${limit} OFFSET ${offset};
  `;

  const contactsArray = await db.all(getContactsQuery);
  const totalQuery = `SELECT COUNT(*) AS total FROM contacts;`;
  const totalResult = await db.get(totalQuery);
  const {total} = totalResult;
  response.json({total,contactsArray});
  }
  catch(e){
    response.status(500).send(e.message);
  }
})

app.delete("/contacts/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const deleteContactQuery = `
      DELETE FROM contacts WHERE id = ${id};
    `;

    const dbResponse = await db.run(deleteContactQuery);

    if (dbResponse.changes === 0) {
      return response.status(404).send(`Contact with id ${id} not found`);
    }

    response.send(`Contact ${id} deleted successfully`);
  } catch (e) {
    response.status(500).send(e.message);
  }
});

