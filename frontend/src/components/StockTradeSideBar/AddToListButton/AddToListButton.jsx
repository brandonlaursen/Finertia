import "./AddToListButton.css";
import { IoIosCheckmark } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

import { useMemo } from "react";
import { useModal } from "../../../context/Modal";
import AddToListModal from "../../../modals/AddToListModal/AddToListModal";

import { useSelector } from "react-redux";

import { selectListsArray } from "../../../../store/lists";
function AddToListButton({ stock, setNotifications, setNotificationMessage }) {
  const { setModalContent, setModalClass } = useModal();
  const lists = useSelector(selectListsArray);

  const stockExists = useMemo(() =>
    Object.values(lists).some(list =>
      list.Stocks.some(listStock => listStock.id === stock.id)
    ),
    [lists, stock.id]
  );
  return (
    <button
      className="AddToListButton"
      onClick={(e) => {
        e.stopPropagation();
        setModalContent(
          <AddToListModal
            stock={stock}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
          />
        );
        setModalClass({
          modal: "AddToListModal",
          modalBackground: "AddToListModal__background",
          modalContainer: "AddToListModal__container",
        });
      }}
    >
      {stockExists ? (
        <IoIosCheckmark className="AddToListButton__check-mark-icon" />
      ) : (
        <FaPlus className="AddToListButton__plus-icon" />
      )}
      Add to Lists
    </button>
  );
}

export default AddToListButton;
