import "./ListItem.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

import { useRef, useEffect } from "react";

// import { Link } from "react-router-dom";

import EditListModal from "./EditListModal";

import { useModal } from "../../../context/Modal";

function ListItem({ list, selectedPopoverId, setSelectedPopoverId }) {
  const { setModalContent, setModalClass } = useModal();

  const popoverRef = useRef(null);
  const ellipsisRef = useRef(null);

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
    <div to="/list1" className="ListItem">
      <div className="ListItem__container">
        <div>
          <span className="ListItem__icon">{list?.type}</span>
          <span className="ListItem__title">{list?.name}</span>
        </div>

        <span
          className="ListItem__ellipsis"
          onClick={togglePopover}
          ref={ellipsisRef}
        >
          <IoEllipsisHorizontalSharp className="ListItem__ellipsis-icon" />
        </span>
        {isPopoverOpen && (
          <div className="ListItem__popover" ref={popoverRef}>
            <span
              className="ListItem__button"
              onClick={(e) => {
                e.stopPropagation();
                setModalContent(<EditListModal listId={list.id} />);
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
            <span className="ListItem__button">
              <TiDeleteOutline className="ListItem__button-icon" />
              Delete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListItem;
