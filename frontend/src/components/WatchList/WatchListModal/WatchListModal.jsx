import "./WatchListModal.css";
import { MdClose } from "react-icons/md";

import EmojiPicker from "emoji-picker-react";
import { useModal } from "../../../context/Modal";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createList } from "../../../../store/lists";

import { selectUser } from "../../../../store/session";



function WatchListModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectUser);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💡");
  const [listName, setListName] = useState('');

  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const newList = {
      userId: sessionUser.id,
      name: listName,
      type: selectedEmoji,
      stockIds: []
    }

    await dispatch(createList(newList));
    closeModal();
  }

  if (isOpen) {
    return (
      <div className="CreateList__modal">
        <div className="CreateList__modal__background" onClick={closeModal} />

        <div className="CreateList__modal__container">
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
              Create List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="WatchList__modal">
      <div className="WatchList__modal__background" onClick={closeModal} />
      <div className="WatchList__modal__container">
        <div className="WatchListModal__contents">
          <div className="WatchListModal__header">
            <h1 className="WatchListModal__title">Choose a list type</h1>
            <span className="WatchListModal__close-button-span">
              <MdClose
                className="WatchListModal__close-button"
                onClick={closeModal}
              />
            </span>
          </div>

          <div className="WatchListModal__section">
            <div
              className="WatchListModal__option"
              onClick={() => setIsOpen(true)}
            >
              <div className="WatchListModal__option__image WatchListModal__image-one"></div>
              <div className="WatchListModal__option__text">
                <span className="WatchListModal__text__title">
                  Create Watchlist
                </span>

                <span>Keep an on investments youre interested in</span>
              </div>
            </div>
            <div className="WatchListModal__option">
              <div className="WatchListModal__option__image WatchListModal__image-two"></div>
              <div className="WatchListModal__option__text">
                <span className="WatchListModal__text__title">
                  Create Screener
                </span>
                <span>
                  Find your next trade with filters for price, volume, and other
                  indicators
                </span>
              </div>
            </div>
          </div>
          <button className="WatchListModal__back-button" onClick={closeModal}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );

}

export default WatchListModal;
