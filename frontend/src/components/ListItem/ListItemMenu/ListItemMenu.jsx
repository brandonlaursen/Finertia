import "./ListItemMenu.css";
import { IoSettings } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

import { useRef, useEffect } from "react";

import { useModal } from "../../../context/Modal";

import DeleteListModal from "../../../modals/DeleteListModal";
import EditListModal from "../../../modals/EditListModal";

function ListItemMenu({
  list,
  isCurrentList,
  setActiveListId,
  listMenuButtonRef,
  navigate,
  setNotifications,
  setNotificationMessage,
}) {
  const { setModalContent, setModalClass } = useModal();

  const listItemMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        listItemMenuRef.current &&
        !listItemMenuRef.current.contains(e.target) &&
        listMenuButtonRef.current &&
        !listMenuButtonRef.current.contains(e.target)
      ) {
        setActiveListId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setActiveListId, listMenuButtonRef]);

  return (
    <>
      {isCurrentList && (
        <div className="ListItemMenu" ref={listItemMenuRef}>
          <button
            className="ListItemMenu__button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveListId(null);
              setModalContent(
                <EditListModal
                  list={list}
                  setNotifications={setNotifications}
                  setNotificationMessage={setNotificationMessage}
                />
              );
              setModalClass({
                modal: "EditListModal",
                modalBackground: "EditListModal__background",
                modalContainer: "EditListModal__container",
              });
            }}
          >
            <IoSettings className="ListItemMenu__edit-icon" />
            Edit list
          </button>

          <button className="ListItemMenu__button">
            <MdOutlineDragIndicator className="ListItemMenu__rearrange-icon" />
            Rearrange
          </button>

          <button
            className="ListItemMenu__button"
            onClick={(e) => {
              e.stopPropagation();
              setModalContent(
                <DeleteListModal
                  listId={list.id}
                  listName={list.name}
                  navigate={navigate}
                  setNotifications={setNotifications}
                  setNotificationMessage={setNotificationMessage}
                />
              );
              setModalClass({
                modal: "DeleteListModal",
                modalBackground: "DeleteListModal__background",
                modalContainer: "DeleteListModal__container",
              });
            }}
          >
            <TiDeleteOutline className="ListItemMenu__delete-icon" />
            Delete
          </button>
        </div>
      )}
    </>
  );
}

export default ListItemMenu;
