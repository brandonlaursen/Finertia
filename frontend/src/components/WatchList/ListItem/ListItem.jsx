import "./ListItem.css";
import { Link } from "react-router-dom";
import { useState } from "react";

import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

function ListItem() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPopoverOpen((prev) => !prev);
  };

  return (
    <Link to="/list1" className="ListItem">
      <div className="ListItem__container">
        <div>
          <span className="ListItem__icon">💡</span>
          <span className="ListItem__title">My First List</span>
        </div>

        <span className="ListItem__ellipsis" onClick={togglePopover}>
          <IoEllipsisHorizontalSharp />
        </span>
        {isPopoverOpen && (
          <div className="ListItem__popover">
            <span className="ListItem__button">
            <IoSettings  className="ListItem__button-icon"/>
              Edit</span>
            <span className="ListItem__button">
            <MdOutlineDragIndicator  className="ListItem__button-icon"/>
              Rearrange</span>
            <span className="ListItem__button">
            <TiDeleteOutline  className="ListItem__button-icon"/>
              Delete</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default ListItem;
