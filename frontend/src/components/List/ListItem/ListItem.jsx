import "./ListItem.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";

import { useRef, useEffect } from "react";

import EditListModal from "../../Modals/EditListModal";
import DeleteListModal from "../../Modals/DeleteListModal";

import { useModal } from "../../../context/Modal";

function ListItem({
  list,
  selectedPopoverId,
  setSelectedPopoverId,
  className,
  container,
  icon,
  title,
  popover,
  setToggleListIds,
  toggleListIds,
  navigate,
  hover
}) {
  const { setModalContent, setModalClass } = useModal();

  const popoverRef = useRef(null);
  const ellipsisRef = useRef(null);

  let isListOpen;
  if (popover) {
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
        ellipsisRef.current &&
        !ellipsisRef.current.contains(e.target)
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
    <div onClick={() => navigate(`/lists/${list.id}`)} className={`ListItem ${className}`}>
      <div className={container}>
        <div className={`ListItem__header ${hover && `ListItem__header-hover`}`}>
          <span className={icon}>{list?.emoji}</span>
          <span className={title}>{list?.name}</span>
        </div>

        {popover && (
          <>
            <span className="arrow-container">
              <span
                className="ListItem__ellipsis"
                onClick={togglePopover}
                ref={ellipsisRef}
              >
                <IoEllipsisHorizontalSharp className="ListItem__ellipsis-icon" />
              </span>
              <IoIosArrowDown
                onClick={toggleList}
                className={`ListItem__arrow-icon ${isListOpen && "open"}`}
              />
            </span>

            {isPopoverOpen && (
              <div className="ListItem__popover" ref={popoverRef}>
                <span
                  className="ListItem__button"
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
                  <IoSettings className="ListItem__button-icon" />
                  Edit
                </span>

                <span className="ListItem__button">
                  <MdOutlineDragIndicator className="ListItem__button-icon" />
                  Rearrange
                </span>

                <span
                  className="ListItem__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalContent(
                      <DeleteListModal listId={list.id} listName={list.name} navigate={navigate}/>
                    );
                    setModalClass({
                      modal: "DeleteListModal",
                      modalBackground: "DeleteListModal__background",
                      modalContainer: "DeleteListModal__container",
                    });
                  }}
                >
                  <TiDeleteOutline className="ListItem__button-icon" />
                  Delete
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ListItem;
