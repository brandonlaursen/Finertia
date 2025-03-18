import "./EditListModal.css";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import EmojiPicker from "emoji-picker-react";

import ModalHeader from "../../components/ModalHeader/ModalHeader";
import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";
import { useModal } from "../../context/Modal";
import { editList } from "../../../store/lists";

function EditListModal({ list, setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(list.emoji);
  const [listName, setListName] = useState(list.name);

  const [showPicker, setShowPicker] = useState(false);

  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    setSlideUp(true);
  }, []);

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
    <form className="EditListModal" onSubmit={handleSubmit}>
      <ModalOverlay closeModal={closeModal} />

      <div className={`EditListModal__container ${slideUp ? "open" : ""}`}>
        <ModalHeader closeModal={closeModal}>Edit List</ModalHeader>

        <div className="EditListModal__section">
          <button
            className="EditListModal__section__emoji"
            onClick={(e) => {
              e.preventDefault();
              setShowPicker(!showPicker);
            }}
          >
            {selectedEmoji}
          </button>
          {showPicker && (
            <div className="EditListModal__emoji-picker-wrapper">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                style={{ width: "clamp(350px, 100vw, 500px)" }}
              />
            </div>
          )}

          <input
            className="EditListModal__section__input"
            type="text"
            placeholder="List Name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />
        </div>
        <div className="EditListModal__section__buttons">
          <button
            className="EditListModal__section__button
                EditListModal__create-button
                "
            type="submit"
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditListModal;
