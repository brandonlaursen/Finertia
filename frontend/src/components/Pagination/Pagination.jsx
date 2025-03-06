import "./Pagination.css";

function Pagination({ currentPage, totalPages, handlePageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="Pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="Pagination__button"
      >
        Previous
      </button>
      <span className="Pagination__info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="Pagination__button"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
