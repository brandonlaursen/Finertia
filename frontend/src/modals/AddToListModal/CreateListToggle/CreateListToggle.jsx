import "./CreateListToggle.css";

import { FiPlus } from "react-icons/fi";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { createList } from "../../../../store/lists";
import EmojiPicker from "emoji-picker-react";

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
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      setListName("");
      setSelectedEmoji("💡");
    }, 300);
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (listName === "") return;

    setIsLoadingCreate(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoadingCreate(false);

    const newList = {
      userId: sessionUser.id,
      name: listName,
      emoji: selectedEmoji,
      stockIds: [],
    };

    const newListId = await dispatch(createList(newList));

    setIsVisible(false);
    setListName("");
    setSelectedEmoji("💡");
    setNewListId(newListId);
  };

  return (
    <div
      className={`CreateListToggle__container
`}
    >
      {isVisible ? (
        <div className="CreateListToggle__form-container">
          <div
            className={`CreateListToggle__form ${isExiting ? "exit" : ""}`}
          >
            <section className="CreateListToggle__form-input-container">
              <button
                className="CreateListToggle__emoji-button"
                onClick={() => setShowPicker(!showPicker)}
              >
                {selectedEmoji}
              </button>
              {showPicker && (
                <div className="CreateListToggle__emoji-wrapper">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    style={{ width: "500px"}}

                  />
                </div>
              )}
              <input
                className="CreateListToggle__form-input"
                type="text"
                placeholder="List Name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                required
              />
            </section>

            <section className="CreateListToggle__form-buttons">
              <button
                className="CreateListToggle__form-button
              CreateListToggle__cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="CreateListToggle__form-button
              CreateListToggle__create-button"
                onClick={handleCreateList}
                disabled={!listName.trim()}
              >
                {isLoadingCreate ? (
                  <span className="StockTransaction__spinner"></span>
                ) : (
                  "Create List"
                )}
              </button>
            </section>
          </div>
        </div>
      ) : (
        <div className="CreateListToggle__toggle">
          <span className="CreateListToggle__toggle-container">
            <FiPlus className="CreateListToggle__toggle-icon" />
          </span>
          <span
            className="CreateListToggle__toggle-title"
            onClick={() => setIsVisible(true)}
          >
            Create New List
          </span>
        </div>
      )}
    </div>
  );
}

export default CreateListToggle;
