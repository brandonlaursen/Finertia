import "./CreateListModal.css";
import { MdClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../context/Modal";

import { createList } from "../../../../store/lists";
import { selectUser } from "../../../../store/session";

function CreateListModal() {
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
  }

  if (isOpen) {
    return (
      <div className="CreateListModal__two">
        <div
          className="CreateListModal__two__background"
          onClick={closeModal}
        />

        <div className="CreateListModal__two__container">
          <div className="CreateList__header">
            <span className="CreateList__header__title">Create list</span>
            <span className="WatchListModal__close-button-span">
              <MdClose
                className="WatchListModal__close-button"
                onClick={closeModal}
              />
            </span>
          </div>

          <div className="CreateList__section">
            <div>
              <button
                className="CreateList__section__emoji"
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
              className="CreateList__section__input"
              type="text"
              placeholder="List Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>

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
        </div>
      </div>
    );
  }

  return (
    <div className="CreateListModal__one">
      <div className="CreateListModal__one__background" onClick={closeModal} />
      <div className="CreateListModal__one__container">
        <div className="CreateListModal__one__contents">
          <div className="CreateListModal__one__header">
            <h1 className="CreateListModal__one__title">Choose a list type</h1>
            <span className="CreateListModal__one__close-button-span">
              <MdClose
                className="CreateListModal__one__close-button"
                onClick={closeModal}
              />
            </span>
          </div>

          <div className="CreateListModal__one__section">
            <div
              className="CreateListModal__one__option"
              onClick={() => setIsOpen(true)}
            >
              <div className="CreateListModal__one__option__image CreateListModal__one__image-one"></div>
              <div className="CreateListModal__one__option__text">
                <span className="CreateListModal__one__text__title">
                  Create Watch list
                </span>

                <span>Keep an on investments youre interested in</span>
              </div>
            </div>
            <div className="CreateListModal__one__option">
              <div className="CreateListModal__one__option__image CreateListModal__one__image-two"></div>
              <div className="CreateListModal__one__option__text">
                <span className="CreateListModal__one__text__title">
                  Create Screener
                </span>
                <span>
                  Find your next trade with filters for price, volume, and other
                  indicators
                </span>
              </div>
            </div>
          </div>
          <button
            className="CreateListModal__one__back-button"
            onClick={closeModal}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateListModal;
