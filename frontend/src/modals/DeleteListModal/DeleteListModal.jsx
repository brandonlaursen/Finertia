import "./DeleteListModal.css";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { deleteList } from "../../../store/lists";

import ModalHeader from "../../components/ModalHeader/ModalHeader";
import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";

function DeleteListModal({
  listId,
  listName,
  navigate,
  setNotifications,
  setNotificationMessage,
}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    setSlideUp(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
    closeModal();

    setNotificationMessage([`Successfully deleted list ${listName}`]);
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
    <div className="DeleteListModal">
      <ModalOverlay closeModal={closeModal} />

      <div className={`DeleteListModal__container ${slideUp ? "open" : ""}`}>
        <ModalHeader closeModal={closeModal}>
          Are you sure you want to delete<span>{` "${listName}"?`}</span>
        </ModalHeader>

        <span className="DeleteListModal__section">
          If you delete this list and its 0 items, it’ll be gone forever!
        </span>
        <div className="DeleteListModal__section__buttons">
          <button
            className="DeleteListModal__section__button
              DeleteListModal__delete-button
              "
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              ` Delete ${listName}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteListModal;
