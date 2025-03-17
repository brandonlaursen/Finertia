import "./AddToListModalFooter.css";

function AddToListModalFooter({
  handleSubmit,
  checkedItems,
  isVisible,
  listName,
  isLoading,
}) {
  return (
    <footer className="AddToListModalFooter">
      <button
        className="AddToListModalFooter__button"
        onClick={handleSubmit}
        disabled={
          !Object.keys(checkedItems).length || (isVisible && !listName.trim())
        }
      >
        {isLoading ? (
          <span className="StockTransaction__spinner"></span>
        ) : (
          "Save Changes"
        )}
      </button>
    </footer>
  );
}

export default AddToListModalFooter;
