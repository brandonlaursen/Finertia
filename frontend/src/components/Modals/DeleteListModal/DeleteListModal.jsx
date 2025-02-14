import "./DeleteListModal.css";
import { MdClose } from "react-icons/md";

import { useDispatch } from "react-redux";

import { useModal } from "../../../context/Modal";

import { deleteList } from "../../../../store/lists";

function DeleteListModal({ listId, listName, navigate }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();

    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
    closeModal();
  }

  return (
    <div className="DeleteListModal">
      <div className="DeleteListModal__background" onClick={closeModal} />

      <div className="DeleteListModal__container">
        <div className="DeleteListModal__contents">
          <div className="DeleteListModal__header">
            <span className="DeleteListModal__title">
              Are you sure you want to delete
              <span>{`"${listName}"?`}</span>
            </span>
            <span className="DeleteListModal__close-button-span">
              <MdClose
                className="DeleteListModal__close-button"
                onClick={closeModal}
              />
            </span>
          </div>
        </div>

        <div>
          <div className="DeleteListModal__section">
            If you delete this list and its 0 items, it’ll be gone forever!
          </div>
          <div className="DeleteListModal__section__buttons">
            <button
              className="DeleteListModal__section__button
              DeleteListModal__delete-button
              "
              onClick={handleSubmit}
            >
              Delete {listName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteListModal;
