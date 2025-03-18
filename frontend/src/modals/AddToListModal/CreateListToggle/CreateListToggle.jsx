import "./CreateListToggle.css";
import { FiPlus } from "react-icons/fi";

import CreateListToggleForm from "../CreateListToggleForm";

function CreateListToggle({
  setIsVisible,
  isVisible,
  selectedEmoji,
  setSelectedEmoji,
  sessionUser,
  setNewListId,
  listName,
  setListName,
}) {
  const createListToggleProps = {
    sessionUser,
    setNewListId,
    isVisible,
    setIsVisible,
    selectedEmoji,
    setSelectedEmoji,
    listName,
    setListName,
  };

  return (
    <div className="CreateListToggle">
      {!isVisible ? (
        <>
          <div className="CreateListToggle__placeholder" />

          <div className="CreateListToggle__toggle">
            <span className="CreateListToggle__toggle-icon-container">
              <FiPlus className="CreateListToggle__icon" />
            </span>
            <span
              className="CreateListToggle__title"
              onClick={() => setIsVisible(true)}
            >
              Create New List
            </span>
          </div>
        </>
      ) : (
        <CreateListToggleForm {...createListToggleProps} />
      )}
    </div>
  );
}

export default CreateListToggle;
