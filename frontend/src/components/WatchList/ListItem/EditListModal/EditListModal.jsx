import { useModal } from "../../../../context/Modal";
import "./EditListModal.css";

import { MdClose } from "react-icons/md";

import EmojiPicker from "emoji-picker-react";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { editList } from "../../../../../store/lists";

function EditListModal({ listId }) {
  const { closeModal } = useModal();

  const dispatch = useDispatch();

  const [selectedEmoji, setSelectedEmoji] = useState("💡");
  const [listName, setListName] = useState("");

  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const editedList = {
      stockListId: listId,
      name: listName,
      type: selectedEmoji,
    };

    await dispatch(editList(editedList));
    closeModal();
  }

  return (
    <div className="EditListModal">
      <div className="EditListModal__background" onClick={closeModal} />

      <div className="EditListModal__container">
        <div className="EditListModal__contents">
          <div className="EditListModal__header">
            <span className="EditListModal__title">Choose a list type</span>
            <span className="EditListModal__close-button-span">
              <MdClose
                className="EditListModal__close-button"
                onClick={closeModal}
              />
            </span>
          </div>
        </div>

        <div>
          <div className="EditListModal__section">
            <div>
              <button
                className="EditListModal__section__emoji"
                onClick={() => setShowPicker(!showPicker)}
              >
                {selectedEmoji}
              </button>
              {showPicker && (
                <div className="emoji-picker-wrapper">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <input
              className="EditListModal__section__input"
              type="text"
              placeholder="List Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
          <div className="EditListModal__section__buttons">
            <button
              className="EditListModal__section__button
            EditListModal__create-button
            "
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditListModal;
