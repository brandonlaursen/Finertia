import "./ListEditor.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { LuInfo } from "react-icons/lu";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import EmojiPicker from "emoji-picker-react";

import { editList, deleteList } from "../../../../store/lists";

function ListEditor({ list, listId, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const menuRef = useRef(null);
  const errorRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState("");

  const [updatedListName, setUpdatedListName] = useState("");
  const [selectedUpdatedEmoji, setSelectedUpdatedEmoji] = useState(
    list?.emoji || ""
  );

  useEffect(() => {
    if (list) {
      setSelectedUpdatedEmoji(list.emoji);
      setUpdatedListName(list.name);
    }
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (errorRef.current && !errorRef.current.contains(e.target)) {
        setError("");
        setUpdatedListName(list.name);
      }
    };

    if (error) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [error, list.name]);

  const handleListNameChange = (e) => {
    const newListName = e.target.value;
    setUpdatedListName(newListName);
    setError("");
  };

  const handleListEmojiChange = async (emojiData) => {
    const newListEmoji = emojiData.emoji;
    setSelectedUpdatedEmoji(newListEmoji);
    const editedList = {
      stockListId: list.id,
      name: updatedListName,
      emoji: newListEmoji,
    };

    await dispatch(editList(editedList));
    setShowEmojiPicker(false);
  };

  const handleDeleteList = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
  };

  function handleBlur(e) {
    e.stopPropagation();

    if (updatedListName.trim() === "") {
      setError("Please enter a valid name");
      return;
    }

    if (updatedListName.trim() !== list.name) {
      const editedList = {
        stockListId: list.id,
        name: updatedListName.trim(),
        emoji: selectedUpdatedEmoji,
      };
      dispatch(editList(editedList));
    }
  }

  return (
    <div className="ListEditor">
      <section>
        <button
          className="ListEditor__emoji-button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          {selectedUpdatedEmoji}
        </button>
        {showEmojiPicker && (
          <div className="ListEditor__emoji-picker-wrapper">
            <EmojiPicker
              onEmojiClick={handleListEmojiChange}
              style={{ width: "400px" }}
            />
          </div>
        )}
      </section>

      <section className="ListEditor__name">
        <input
          value={updatedListName}
          className="ListEditor__name-input"
          onChange={handleListNameChange}
          onBlur={handleBlur}
          placeholder="Edit List Name"
        />
        {error && (
          <div className="ListEditor__error" ref={errorRef}>
            <LuInfo className="ListEditor__error-icon" />
            {error}
          </div>
        )}
        <IoEllipsisHorizontalSharp
          className="ListEditor__menu-button"
          onClick={(e) => {
            e.stopPropagation(), setShowMenu(!showMenu);
          }}
        />
        {showMenu && (
          <div
            className="ListEditor__delete-popover"
            ref={menuRef}
            onClick={handleDeleteList}
          >
            <TiDeleteOutline className="ListEditor__delete-icon" />
            <span className="ListEditor__delete-text">Delete {list?.name}</span>
          </div>
        )}
      </section>

      <span className="ListEditor__subtitle">{list?.Stocks?.length} items</span>
    </div>
  );
}

export default ListEditor;
