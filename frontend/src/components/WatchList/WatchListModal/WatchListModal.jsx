import "./WatchListModal.css";
import { MdClose } from "react-icons/md";

import { useModal } from "../../../context/Modal";

function WatchListModal() {
  const { closeModal } = useModal();

  return (
    <div className="WatchListModal__contents">
      <div className="WatchListModal__header">
        <h1 className="WatchListModal__title">Choose a list type</h1>
        <MdClose
          className="WatchListModal__close-button"
          onClick={closeModal}
        />
      </div>

      <div className="WatchListModal__section">
        <div className="WatchListModal__option">
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
            <span className="WatchListModal__text__title">Create Screener</span>
            <span>
              Find your next trade with filters for price, volume, and other
              indicators
            </span>
          </div>
        </div>
      </div>
      <button
        className="WatchListModal__back-button"
         onClick={closeModal}
      >
        Go back
      </button>
    </div>
  );
}

export default WatchListModal;
