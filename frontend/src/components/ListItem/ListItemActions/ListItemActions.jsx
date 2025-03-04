import "./ListItemActions.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

import { useRef } from "react";
import ListItemMenu from "../ListItemMenu";

function ListItemActions({
  list,
  isCurrentList,
  setActiveListId,
  showActions,
  showDropdown,
  expandedListIds,
  setExpandedListIds,
  navigate,
  setNotifications,
  setNotificationMessage,
}) {
  const listMenuButtonRef = useRef(null);

  let isListOpen;
  if (showActions) {
    isListOpen = expandedListIds.includes(list.id);
  }

  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCurrentList) {
      setActiveListId(null);
    } else {
      setActiveListId(list.id);
    }
  };

  const expandList = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isListOpen) {
      const newListIds = [...expandedListIds];
      const index = newListIds.indexOf(list.id);
      newListIds.splice(index, 1);
      setExpandedListIds(newListIds);
    } else {
      const newListIds = [...expandedListIds];
      newListIds.push(list.id);
      setExpandedListIds(newListIds);
    }
  };

  return (
    <>
      <div className="ListItemActions">
        <button
          className="ListItemActions__menu-button"
          onClick={toggleMenu}
          ref={listMenuButtonRef}
        >
          <IoEllipsisHorizontalSharp className="ListItemActions__menu-icon" />
        </button>
        {showDropdown && (
          <IoIosArrowDown
            onClick={expandList}
            className={`ListItemActions__arrow-icon ${isListOpen && "open"}`}
          />
        )}
      </div>

      <ListItemMenu
        list={list}
        isCurrentList={isCurrentList}
        setActiveListId={setActiveListId}
        listMenuButtonRef={listMenuButtonRef}
        navigate={navigate}
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
      />
    </>
  );
}

export default ListItemActions;
