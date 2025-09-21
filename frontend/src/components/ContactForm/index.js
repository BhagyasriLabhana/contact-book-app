import React, { useState, useCallback } from "react";
import "./index.css";

function ContactFormModal({ closeModal, fetchContacts }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^\d{10}$/;

      if (!formData.name || !formData.email || !formData.phone) {
        alert("All fields are required");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        alert("Invalid email format");
        return;
      }
      if (!phoneRegex.test(formData.phone)) {
        alert("Phone must be 10 digits");
        return;
      }

      try {
        const res = await fetch("https://contact-book-syl9.onrender.com/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setFormData({ name: "", email: "", phone: "" });
        fetchContacts(1); // refresh contacts
        closeModal(); // close modal after adding
      } catch (err) {
        console.error("Error adding contact:", err);
      }
    },
    [formData, fetchContacts, closeModal]
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Contact</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={closeModal} className="close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactFormModal;
