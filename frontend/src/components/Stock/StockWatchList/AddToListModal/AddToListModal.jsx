import "./AddToListModal.css";
import { MdClose } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { IoIosCheckmark } from "react-icons/io";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useModal } from "../../../../context/Modal";

import { fetchUsersLists, selectListsArray } from "../../../../../store/lists";
import { updateStockLists } from "../../../../../store/lists";

import ListItem from "../../../WatchList/ListItem";

function AddToListModal({ stockId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const lists = useSelector(selectListsArray);
  const [checkedItems, setCheckedItems] = useState({});
  // console.log("checkedItems:", lists);
  const listObj = Object.values

  useEffect(() => {
    dispatch(fetchUsersLists());
  }, [dispatch]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      if (updatedItems[id]) updatedItems[id] = false;
      else updatedItems[id] = true;

      return updatedItems;
    });
  };

  async function handleSubmit() {
    console.log(checkedItems, stockId);

    console.log("in handle submit");
     await dispatch(updateStockLists(checkedItems, 1));

    // console.log(messages);
    closeModal();
  }

  return (
    <div className="AddToListModal">
      <div className="AddToListModal__background" onClick={closeModal} />

      <div className="AddToListModal__container">
        <div className="AddToListModal__contents">
          <div className="AddToListModal__header">
            <span className="AddToListModal__title">Add to List</span>
            <span className="AddToListModal__close-button-span">
              <MdClose
                className="AddToListModal__close-button"
                onClick={closeModal}
              />
            </span>
          </div>
        </div>

        {/*  */}
        <div>
          <div className="AddToListModal__section">
            <div className="AddToListModal__section__create-container">
              <span className="AddToListModal__section__create-icon">
                <FiPlus className="AddToListModal__plus-icon" />
              </span>
              <span className="AddToListModal__section__create-title">
                Create New List
              </span>
            </div>

            {lists &&
              lists.slice(0, 10).map((list) => {
                return (
                  <div
                    key={list.id}
                    className="AddToListModal__checkbox-container"
                  >
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        id={list.id}
                        checked={!!checkedItems[list.id]}
                        onChange={() => handleCheckboxChange(list.id)}
                        className={checkedItems[list.id] ? "checked" : ""}
                      />
                      {checkedItems[list.id] && (
                        <IoIosCheckmark className="checkbox-icon" />
                      )}
                    </div>

                    <ListItem
                      list={list}
                      className="AddToListModal__list__ListItem"
                      container="AddToListModal__item__container"
                      icon="AddToListModal__item__icon"
                      title="AddToListModal__item__title"
                      popover={false}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="AddToListModal__section__buttons">
          <button
            className="AddToListModal__section__button
                AddToListModal__create-button
                "
            onClick={handleSubmit}
            disabled={!Object.keys(checkedItems).length}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToListModal;
