import "./ListEdit.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import EmojiPicker from "emoji-picker-react";

import { editList, deleteList } from "../../../../store/lists";

function ListEdit({ list, listId, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const popoverRef = useRef(null);

  const [selectedUpdatedEmoji, setSelectedUpdatedEmoji] = useState(
    list?.emoji || ""
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [updatedListName, setUpdatedListName] = useState("");
  const [showDeletePopover, setShowDeletePopover] = useState(false);

  useEffect(() => {
    if (list) {
      setSelectedUpdatedEmoji(list.emoji);
      setUpdatedListName(list.name);
    }
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowDeletePopover(false);
      }
    };

    if (showDeletePopover) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDeletePopover]);

  const handleListNameChange = async (e) => {
    const newName = e.target.value;
    setUpdatedListName(newName);

    const editedList = {
      stockListId: list.id,
      name: newName,
      emoji: selectedUpdatedEmoji,
    };

    await dispatch(editList(editedList));
  };

  const handleListEmojiChange = async (emojiData) => {
    const newEmoji = emojiData.emoji;
    setSelectedUpdatedEmoji(newEmoji);
    const editedList = {
      stockListId: list.id,
      name: updatedListName,
      emoji: newEmoji,
    };

    await dispatch(editList(editedList));

    setShowEmojiPicker(false);
  };

  const handleDeleteList = async () => {
    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
  };

  return (
    <div className="ListEdit">
      <section>
        <button
          className="ListEdit__emoji-button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          {selectedUpdatedEmoji}
        </button>
        {showEmojiPicker && (
          <div className="ListEdit__emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={handleListEmojiChange} />
          </div>
        )}
      </section>
      <section className="ListEdit__name">
        <input
          value={updatedListName}
          className="ListEdit__name-input"
          onChange={handleListNameChange}
        />
        <IoEllipsisHorizontalSharp
          className="ListEdit__menu-button"
          onClick={(e) => {
            e.stopPropagation(), setShowDeletePopover(!showDeletePopover);
          }}
        />
        {showDeletePopover && (
          <div
            className="ListEdit__delete-popover"
            ref={popoverRef}
            onClick={handleDeleteList}
          >
            <TiDeleteOutline className="ListEdit__delete-icon" />
            <span className="ListEdit__delete-text">
              Delete {list?.name}
            </span>
          </div>
        )}
      </section>
      <span className="ListEdit__subtitle">
        {list?.Stocks?.length} items
      </span>
    </div>
  );
}

export default ListEdit;
