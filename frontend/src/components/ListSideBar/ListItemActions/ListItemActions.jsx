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
  expandedListIds,
  setExpandedListIds,
  navigate
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
      <div className="ListItem__actions">
        <button
          className="ListItem__menu-button"
          onClick={toggleMenu}
          ref={listMenuButtonRef}
        >
          <IoEllipsisHorizontalSharp className="ListItem__menu-icon" />
        </button>
        <IoIosArrowDown
          onClick={expandList}
          className={`ListItem__arrow-icon ${isListOpen && "open"}`}
        />
      </div>

      <ListItemMenu
        isCurrentList={isCurrentList}
        setActiveListId={setActiveListId}
        list={list}
        navigate={navigate}
        listMenuButtonRef={listMenuButtonRef}
      />
    </>
  );
}

export default ListItemActions;
