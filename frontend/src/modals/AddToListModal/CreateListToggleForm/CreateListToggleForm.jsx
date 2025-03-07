import "./CreateListToggleForm.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import { createList } from "../../../../store/lists";

function CreateListToggleForm({
  sessionUser,
  setNewListId,
  setIsVisible,
  selectedEmoji,
  setSelectedEmoji,
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
    <div className="CreateListToggleForm">
      <main className={`CreateListToggleForm__main ${isExiting ? "exit" : ""}`}>
        <section className="CreateListToggleForm__input">
          <button
            className="CreateListToggleForm__emoji-button"
            onClick={() => setShowPicker(!showPicker)}
          >
            {selectedEmoji}
          </button>
          {showPicker && (
            <div className="CreateListToggleForm__emoji-wrapper">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                style={{ width: "500px" }}
              />
            </div>
          )}
          <input
            className="CreateListToggleForm__name-input"
            type="text"
            placeholder="List Name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />
        </section>
        <section className="CreateListToggleForm__buttons">
          <button
            className="CreateListToggleForm__button
 CreateListToggleForm__cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="CreateListToggleForm__button
 CreateListToggleForm__create-button"
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
      </main>
    </div>
  );
}

export default CreateListToggleForm;
