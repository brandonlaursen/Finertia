import "./AddToListModal.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ModalHeader from "../../components/ModalHeader/ModalHeader";
import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";
import CreateListToggle from "./CreateListToggle";
import AddToListModalLists from "./AddToListModalLists";

import { fetchLists, selectListsArray } from "../../../store/lists";
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
  const [checkedItems, setCheckedItems] = useState(checkedList);
  const [isVisible, setIsVisible] = useState(false);

  const [newListId, setNewListId] = useState(null);
  const [listName, setListName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💡");

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

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

  useEffect(() => {
    if (newListId) {
      setCheckedItems((prev) => ({ ...prev, [newListId]: true }));
    }
  }, [newListId]);

  return (
    <div className="AddToListModal">
      <ModalOverlay closeModal={closeModal} />

      <main className="AddToListModal__main">
        <ModalHeader
          closeModal={closeModal}
        >{`Add ${stock.symbol} to List`}</ModalHeader>

        <section className="AddToListModal__section">
          {isVisible && <div className="AddToListModal__list-overlay active" />}
          <CreateListToggle
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            sessionUser={sessionUser}
            setNewListId={setNewListId}
            listName={listName}
            setListName={setListName}
          />

          <AddToListModalLists
            lists={lists}
            checkedItems={checkedItems}
            isVisible={isVisible}
            setCheckedItems={setCheckedItems}
          />
        </section>

        <footer className="AddToListModal__footer">
          <button
            className="AddToListModal__footer__button
                AddToListModal__save-button
                "
            onClick={handleSubmit}
            disabled={
              !Object.keys(checkedItems).length ||
              (isVisible && !listName.trim())
            }
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              "Save Changes"
            )}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default AddToListModal;
