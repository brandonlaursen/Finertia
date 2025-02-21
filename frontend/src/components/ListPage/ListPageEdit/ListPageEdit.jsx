import "./ListPageEdit.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import EmojiPicker from "emoji-picker-react";

import { editList, deleteList } from "../../../../store/lists";

function ListPageEdit({ list, listId, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const popoverRef = useRef(null);

  const [selectedEmoji, setSelectedEmoji] = useState(list?.emoji || "");
  const [showPicker, setShowPicker] = useState(false);
  const [listName, setListName] = useState("");
  const [deletePopover, setDeletePopover] = useState(false);

  useEffect(() => {
    if (list) {
      setSelectedEmoji(list.emoji);
      setListName(list.name);
    }
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setDeletePopover(false);
      }
    };

    if (deletePopover) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [deletePopover]);

  const handleListName = async (e) => {
    const newName = e.target.value;
    setListName(newName);

    const editedList = {
      stockListId: list.id,
      name: newName,
      emoji: selectedEmoji,
    };

    await dispatch(editList(editedList));
  };

  const handleEmojiClick = async (emojiData) => {
    const newEmoji = emojiData.emoji;
    setSelectedEmoji(newEmoji);
    const editedList = {
      stockListId: list.id,
      name: listName,
      emoji: newEmoji,
    };

    await dispatch(editList(editedList));

    setShowPicker(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <button
          className="ListPage__section__emoji"
          onClick={() => {
            setShowPicker(!showPicker);
          }}
        >
          {selectedEmoji}
        </button>
        {showPicker && (
          <div className="ListPage__emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <div className="ListPage__list-edit">
        <input
          value={listName}
          className="ListPage__list-name-input"
          onChange={handleListName}
        />
        <IoEllipsisHorizontalSharp
          className="ListPage__list-name-ellipsis"
          onClick={(e) => {
            e.stopPropagation(), setDeletePopover(!deletePopover);
          }}
        />
        {deletePopover && (
          <div
            className="ListPage_delete-popover"
            ref={popoverRef}
            onClick={handleDelete}
          >
            <TiDeleteOutline className="ListPage__delete-icon" />
            <span className="ListPage__delete-text">Delete {list?.name}</span>
          </div>
        )}
      </div>
      <span className="ListPage__subtitle">{list?.Stocks?.length} items</span>
    </>
  );
}

export default ListPageEdit;
