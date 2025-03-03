import "./ListItem.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";

import { useRef, useEffect } from "react";

// import EditListModal from "../../modals/EditListModal";
// import DeleteListModal from "../../modals/DeleteListModal";
// import EditListModal from '../../modals/EditListModal';
import DeleteListModal from '../../../modals/DeleteListModal';
import EditListModal from "../../../modals/EditListModal";

import { useModal } from "../../../context/Modal";

function ListItem({
  className,
  container,
  emoji,
  name,
  showActions,
  showHover,
  navigate,
  list,
  toggleListIds,
  setToggleListIds,
  selectedPopoverId,
  setSelectedPopoverId,
}) {
  const { setModalContent, setModalClass } = useModal();

  const popoverRef = useRef(null);
  const menuButtonRef = useRef(null);

  let isListOpen;
  if (showActions) {
    isListOpen = toggleListIds.includes(list.id);
  }

  const isPopoverOpen = selectedPopoverId === list.id;

  const togglePopover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPopoverOpen) {
      setSelectedPopoverId(null);
    } else {
      setSelectedPopoverId(list.id);
    }
  };

  const toggleList = (e) => {
    e.stopPropagation();

    e.preventDefault();
    if (isListOpen) {
      const newListIds = [...toggleListIds];
      const index = newListIds.indexOf(list.id);
      newListIds.splice(index, 1);
      setToggleListIds(newListIds);
    } else {
      const newListIds = [...toggleListIds];
      newListIds.push(list.id);
      setToggleListIds(newListIds);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setSelectedPopoverId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setSelectedPopoverId]);

  return (
    <article
      onClick={() => navigate(`/lists/${list.id}`)}
      className={`ListItem ${className}`}
    >
      <div className={container}>
        <header
          className={`ListItem__header ${
            showHover && `ListItem__header-hover`
          }`}
        >
          <span className={emoji}>{list?.emoji}</span>
          <span className={name}>{list?.name}</span>
        </header>

        {showActions && (
          <>
            <div className="ListItem__actions">
              <button
                className="ListItem__menu-button"
                onClick={togglePopover}
                ref={menuButtonRef}
              >
                <IoEllipsisHorizontalSharp className="ListItem__menu-icon" />
              </button>
              <IoIosArrowDown
                onClick={toggleList}
                className={`ListItem__arrow-icon ${isListOpen && "open"}`}
              />
            </div>

            {isPopoverOpen && (
              <div className="ListItem__popover" ref={popoverRef}>
                <button
                  className="ListItem__popover__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPopoverId(null);
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
        )}
      </div>
    </article>
  );
}

export default ListItem;
