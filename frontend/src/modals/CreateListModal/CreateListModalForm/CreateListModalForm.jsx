import "./CreateListModalForm.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import EmojiPicker from "emoji-picker-react";
import ModalHeader from "../../../components/ModalHeader/ModalHeader";

import { selectUser } from "../../../../store/session";
import { createList } from "../../../../store/lists";

function CreateListModalForm({
  closeModal,
  setNotifications,
  setNotificationMessage,
}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [selectedEmoji, setSelectedEmoji] = useState("💡");
  const [listName, setListName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    const newList = {
      userId: sessionUser.id,
      name: listName,
      emoji: selectedEmoji,
      stockIds: [],
    };

    await dispatch(createList(newList));
    closeModal();

    setNotificationMessage([`Successfully created list ${listName}`]);
    setNotifications(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 10000);
    });

    setNotificationMessage([]);
  }

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <form className="CreateListModalForm" onSubmit={handleSubmit}>
      <ModalHeader closeModal={closeModal}>Create list</ModalHeader>

      <section className="CreateListModalForm__inputs">
        <button
          className="CreateListModalForm__emoji-button"
          onClick={(e) => {
            e.preventDefault();
            setShowPicker(!showPicker);
          }}
        >
          {selectedEmoji}
        </button>
        {showPicker && (
          <div className="CreateListModalForm__emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <input
          className="CreateListModalForm__name-input"
          type="text"
          placeholder="List Name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          required
        />
      </section>

      <section className="CreateListModalForm__buttons">
        <button
          className="CreateListModalForm__button
    CreateListModalForm__cancel-button"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="CreateListModalForm__button
    CreateListModalForm__create-button
    "
          type="submit"
        >
          {isLoading ? (
            <span className="StockTransaction__spinner"></span>
          ) : (
            "Create List"
          )}
        </button>
      </section>
    </form>
  );
}

export default CreateListModalForm;
