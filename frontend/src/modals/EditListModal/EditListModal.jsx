import "./EditListModal.css";

import { MdClose } from "react-icons/md";

import EmojiPicker from "emoji-picker-react";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { editList } from "../../../store/lists";

function EditListModal({ list, setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(list.emoji);
  const [listName, setListName] = useState(list.name);

  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    const editedList = {
      stockListId: list.id,
      name: listName,
      emoji: selectedEmoji,
    };

    await dispatch(editList(editedList));
    closeModal();

    setNotificationMessage([`Successfully edited list ${listName}`]);
    setNotifications(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 10000);
    });

    setNotificationMessage([]);
  }

  return (
    <div className="EditListModal">
      <div className="EditListModal__background" onClick={closeModal} />

      <div className="EditListModal__container">
        <div className="EditListModal__contents">
          <div className="EditListModal__header">
            <span className="EditListModal__title">Edit List</span>
            <button className="EditListModal__close-button-span">
              <MdClose
                className="EditListModal__close-button"
                onClick={closeModal}
              />
            </button>
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
                <div className="EditListModal__emoji-picker-wrapper">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    // style={{ width: "500px" }}
                  />
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
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditListModal;
