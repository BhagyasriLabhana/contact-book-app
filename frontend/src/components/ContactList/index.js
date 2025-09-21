import React, { useCallback } from "react";
import "./index.css";

function ContactList({ contacts, fetchContacts }) {
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this contact?")) return;

      try {
        await fetch(`http://localhost:5000/contacts/${id}`, { method: "DELETE" });
        fetchContacts(); // refresh contacts
      } catch (err) {
        console.error("Error deleting contact:", err);
      }
    },
    [fetchContacts]
  );

  return (
    <div>
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="contact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td data-label="ID">{c.id}</td>
                  <td data-label="Name">{c.name}</td>
                  <td data-label="Email">{c.email}</td>
                  <td data-label="Phone">{c.phone}</td>
                  <td data-label="Action">
                    <button onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContactList;
