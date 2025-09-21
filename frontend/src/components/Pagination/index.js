import React from "react";
import "./index.css";

function Pagination({ page, setPage, total, limit }) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pagination">
      <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
    </div>
  );
}

export default Pagination;
