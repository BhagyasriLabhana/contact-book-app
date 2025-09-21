import React, { useState, useEffect, useCallback } from "react";
import ContactFormModal from "./components/ContactForm";
import ContactList from "./components/ContactList";
import Pagination from "./components/Pagination";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false); // modal state
  const limit = 5;

  const fetchContacts = useCallback(async (pageNumber = page) => {
    try {
      const res = await fetch(`http://localhost:5000/contacts?page=${pageNumber}&limit=${limit}`);
      const data = await res.json();
      setContacts(data.contactsArray);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchContacts(page);
  }, [page, fetchContacts]);

  return (
    <div className="App">
      <h1>📖 Contact Book</h1>

      <button className="add-btn" onClick={() => setShowModal(true)}>
        Add Contact
      </button>

      {showModal && (
        <ContactFormModal
          closeModal={() => setShowModal(false)}
          fetchContacts={fetchContacts}
        />
      )}

      <ContactList contacts={contacts} fetchContacts={fetchContacts} />
      <Pagination page={page} setPage={setPage} total={total} limit={limit} />
    </div>
  );
}

export default App;
