import "./AddToListModal.css";
import { MdClose } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { IoIosCheckmark } from "react-icons/io";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import ListItem from "../../components/ListSideBar/ListItem";

import { fetchLists, selectListsArray, createList } from "../../../store/lists";
import { selectUser } from "../../../store/session";
import { editListStocks } from "../../../store/stocks";

import { useModal } from "../../context/Modal";

function AddToListModal({ stock, setNotifications, setNotificationMessage }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const lists = useSelector(selectListsArray);
  const listObj = useSelector((state) => state.lists);

  const sessionUser = useSelector(selectUser);

  let checkedList = {};
  for (let listId of stock.listIds) {
    checkedList[listId] = true;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const [checkedItems, setCheckedItems] = useState(checkedList);
  const [isVisible, setIsVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [listName, setListName] = useState("");
  const [newListId, setNewListId] = useState(null);

  const [selectedEmoji, setSelectedEmoji] = useState("💡");

  console.log(isVisible, showPicker);
  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      if (updatedItems[id]) updatedItems[id] = false;
      else updatedItems[id] = true;

      return updatedItems;
    });
  };

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    const { removedFromIds } = await dispatch(
      editListStocks(checkedItems, stock)
    );

    const addedListIds = [];
    for (let key in checkedItems) {
      if (checkedItems[key] && !stock.listIds.includes(Number(key))) {
        addedListIds.push(key);
      }
    }

    let newMessage = "";
    if (addedListIds.length > 1) {
      newMessage += `Added ${stock.symbol} to ${addedListIds.length} lists.`;
    }
    if (addedListIds.length === 1) {
      newMessage += `Added ${stock.symbol} to ${
        listObj[addedListIds[0]].name
      }.`;
    }

    if (removedFromIds.length > 1) {
      newMessage += ` Removed ${stock.symbol} from ${removedFromIds.length} lists.`;
    }
    if (removedFromIds.length === 1) {
      newMessage += ` Removed ${stock.symbol} from ${
        listObj[removedFromIds[0]].name
      }.`;
    }

    closeModal();

    setNotificationMessage([newMessage]);
    if (newMessage.length <= 0) {
      return;
    }

    setNotifications(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 10000);
    });
    setNotifications(false);
    setNotificationMessage([]);
  }

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (listName === "") return;

    setIsLoadingCreate(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoadingCreate(false);

    const newList = {
      userId: sessionUser.id,
      name: listName,
      emoji: selectedEmoji,
      stockIds: [],
    };

    const newListId = await dispatch(createList(newList));

    setIsVisible(false);
    setListName("");
    setSelectedEmoji("💡");
    setNewListId(newListId);
  };

  useEffect(() => {
    if (newListId) {
      setCheckedItems((prev) => ({ ...prev, [newListId]: true }));
    }
  }, [newListId]);

  return (
    <>
      <div className="AddToListModal">
        {showPicker && (
          <div className="AddToListModal__emoji-wrapper">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              style={{ width: "500px" }}
            />
          </div>
        )}
        <div className="AddToListModal__overlay" onClick={closeModal} />

        <div className="AddToListModal__container">
          <header className="AddToListModal__header">
            <span className="AddToListModal__title">Add to List</span>
            <button className="AddToListModal__close-button">
              <MdClose
                className="AddToListModal__close-button-icon"
                onClick={closeModal}
              />
            </button>
          </header>

          <div>
            <div className="AddToListModal__create-section">
              <div
                className={`AddToListModal__create-container
              `}
              >
                {isVisible ? (
                  <div className="AddToListModal__create-form">
                    <section className="AddToListModal__create-form__input-section">
                      <button
                        className="AddToListModal__create-form__emoji-button"
                        onClick={() => setShowPicker(!showPicker)}
                      >
                        {selectedEmoji}
                      </button>

                      <input
                        className="AddToListModal__create-form__input"
                        type="text"
                        placeholder="List Name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        required
                      />
                    </section>

                    <section className="AddToListModal__create-form__buttons">
                      <button
                        className="AddToListModal__create-form__button
                  AddToListModal__cancel-button"
                        onClick={() => {
                          setIsVisible(false),
                            setListName(""),
                            setSelectedEmoji("💡");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="AddToListModal__create-form__button
               AddToListModal__create-button"
                        onClick={handleCreateList}
                      >
                        {isLoadingCreate ? (
                          <span className="StockTransaction__spinner"></span>
                        ) : (
                          "Create List"
                        )}
                      </button>
                    </section>
                  </div>
                ) : (
                  <>
                    <span className="AddToListModal__create-list-toggle">
                      <FiPlus className="AddToListModal__create-list-toggle__icon" />
                    </span>
                    <span
                      className="AddToListModal__create-list-toggle__title"
                      onClick={() => setIsVisible(true)}
                    >
                      Create New List
                    </span>
                  </>
                )}
              </div>

              {lists &&
                lists.slice(0, 10).map((list) => {
                  return (
                    <div key={list.id} className="AddToListModal__list">
                      <div className="AddToListModal__list-wrapper">
                        <input
                          type="checkbox"
                          id={list.id}
                          checked={!!checkedItems[list.id]}
                          onChange={() => handleCheckboxChange(list.id)}
                          className={checkedItems[list.id] ? "checked" : ""}
                        />
                        {checkedItems[list.id] && (
                          <IoIosCheckmark className="AddToListModal__checkbox-icon" />
                        )}
                      </div>

                      <ListItem
                        list={list}
                        className="AddToListModal__ListItem"
                        container="AddToListModal__item__container"
                        name="AddToListModal__item__name"
                        emoji="AddToListModal__item__emoji"
                        showActions={false}
                        showHover={false}
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <footer className="AddToListModal__footer">
            <button
              className="AddToListModal__footer__button
                AddToListModal__create-button
                "
              onClick={handleSubmit}
              disabled={!Object.keys(checkedItems).length}
            >
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}

export default AddToListModal;
