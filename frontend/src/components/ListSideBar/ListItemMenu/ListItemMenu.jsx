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
}) {
  const { setModalContent, setModalClass } = useModal();

  const listMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        listMenuRef.current &&
        !listMenuRef.current.contains(e.target) &&
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
        <div className="ListItem__popover" ref={listMenuRef}>
          <button
            className="ListItem__popover__button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveListId(null);
              setModalContent(<EditListModal list={list} />);
              setModalClass({
                modal: "EditListModal",
                modalBackground: "EditListModal__background",
                modalContainer: "EditListModal__container",
              });
            }}
          >
            <IoSettings className="ListItem__edit-icon" />
            Edit
          </button>

          <button className="ListItem__popover__button">
            <MdOutlineDragIndicator className="ListItem__rearrange-icon" />
            Rearrange
          </button>

          <button
            className="ListItem__popover__button"
            onClick={(e) => {
              e.stopPropagation();
              setModalContent(
                <DeleteListModal
                  listId={list.id}
                  listName={list.name}
                  navigate={navigate}
                />
              );
              setModalClass({
                modal: "DeleteListModal",
                modalBackground: "DeleteListModal__background",
                modalContainer: "DeleteListModal__container",
              });
            }}
          >
            <TiDeleteOutline className="ListItem__delete-icon" />
            Delete
          </button>
        </div>
      )}
    </>
  );
}

export default ListItemMenu;
