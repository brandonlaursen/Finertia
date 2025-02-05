import "./ListItem.css";
import { Link } from "react-router-dom";

import { useState, useRef, useEffect } from "react";

import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

function ListItem({ list }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const ellipsisRef = useRef(null);

  const togglePopover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPopoverOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        ellipsisRef.current &&
        !ellipsisRef.current.contains(e.target)
      ) {
        setIsPopoverOpen(false); // Close the popover if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Link to="/list1" className="ListItem">
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
            <span className="ListItem__button">
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
    </Link>
  );
}

export default ListItem;
