import "./CreateListModal.css";
import { MdClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../context/Modal";
import { createList } from "../../../store/lists";
import { selectUser } from "../../../store/session";

function CreateListModal({ setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectUser);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💡");
  const [listName, setListName] = useState("");

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

  if (isOpen) {
    return (
      <div className="CreateList">
        <div className="CreateList__overlay" onClick={closeModal} />

        <main className="CreateList__container">
          <header className="CreateList__header">
            <span className="CreateList__header__title">Create list</span>
            <button className="CreateList__close-button">
              <MdClose
                className="CreateList__close-button-icon"
                onClick={closeModal}
              />
            </button>
          </header>

          <section className="CreateList__section__inputs">
            <div>
              <button
                className="CreateList__section__emoji-button"
                onClick={() => setShowPicker(!showPicker)}
              >
                {selectedEmoji}
              </button>
              {showPicker && (
                <div className="CreateList__emoji-picker-wrapper">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <input
              className="CreateList__name-input"
              type="text"
              placeholder="List Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </section>

          <div className="CreateList__section__buttons">
            <button
              className="CreateList__section__button
            CreateList__cancel-button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="CreateList__section__button
            CreateList__create-button
            "
              onClick={handleSubmit}
            >
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Create List"
              )}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ChooseListType">
      <div className="ChooseListType__overlay" onClick={closeModal} />

      <div className="ChooseListType__wrapper">
        <main className="ChooseListType__container">
          <header className="ChooseListType__header">
            <h1 className="ChooseListType__title">Choose a list type</h1>
            <button className="ChooseListType__close-button">
              <MdClose
                className="ChooseListType__close-button-icon"
                onClick={closeModal}
              />
            </button>
          </header>

          <section className="ChooseListType__options">
            <div
              className="ChooseListType__option"
              onClick={() => setIsOpen(true)}
            >
              <div className="ChooseListType__option__image ChooseListType__image-one" />

              <div className="ChooseListType__option__text">
                <span className="ChooseListType__text__title">
                  Create Watch List
                </span>
                <span className="ChooseListType__text__sub-text">
                  Keep an on investments youre interested in
                </span>
              </div>
            </div>

            <div className="ChooseListType__option">
              <div className="ChooseListType__option__image ChooseListType__image-two" />

              <div className="ChooseListType__option__text">
                <span className="ChooseListType__text__title">
                  Create Screener
                </span>
                <span className="ChooseListType__text__sub-text">
                  Find your next trade with filters for price, volume, and other
                  indicators
                </span>
              </div>
            </div>
          </section>

          <button className="ChooseListType__back-button" onClick={closeModal}>
            Go back
          </button>
        </main>
      </div>
    </div>
  );
}

export default CreateListModal;
