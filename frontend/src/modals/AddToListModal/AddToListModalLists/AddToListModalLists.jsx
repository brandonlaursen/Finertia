import "./AddToListModalLists.css";

import { IoIosCheckmark } from "react-icons/io";

import ListItem from "../../../components/ListItem";

function AddToListModalLists({
  lists,
  checkedItems,
  isVisible,
  setCheckedItems,
}) {
  function handleCheckboxChange(id) {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      if (updatedItems[id]) updatedItems[id] = false;
      else updatedItems[id] = true;

      return updatedItems;
    });
  }

  return (
    lists &&
    lists.slice(0, 10).map((list) => {
      return (

        <article
          key={list.id}
          className={`AddToListModalLists ${isVisible ? "disabled" : ""}`}
        >
          {isVisible && <div className="AddToListModal__list-overlay active" />}
          <div className="AddToListModalLists__checkbox-container">
            <input
              type="checkbox"
              id={list.id}
              checked={!!checkedItems[list.id]}
              onChange={() => handleCheckboxChange(list.id)}
              className={checkedItems[list.id] ? "checked" : ""}
              disabled={isVisible}
            />
            {checkedItems[list.id] && (
              <IoIosCheckmark className="AddToListModalLists__checkbox-icon" />
            )}
          </div>

          <ListItem
            list={list}


            name="AddToListModalLists__item-name"
            emoji="AddToListModalLists__item-emoji"


            showActions={false}
            showHover={false}
            showItems={true}
          />
        </article>
      );
    })
  );
}

export default AddToListModalLists;
