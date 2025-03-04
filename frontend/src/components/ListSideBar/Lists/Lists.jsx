import "./Lists.css";
import { FaPlus } from "react-icons/fa6";

import { useState } from "react";

import ListItem from "../../ListItem";
import ListStocks from "../ListStocks/ListStocks";

import OpenModalButton from "../../OpenModalButton";
import CreateListModal from "../../../modals/CreateListModal";

function Lists({
  navigate,
  sessionUser,
  stocks,
  lists,
  setNotifications,
  setNotificationMessage,
  showDropdown
}) {
  const [activeListId, setActiveListId] = useState(null);
  const [expandedListIds, setExpandedListIds] = useState([]);

  return (
    <div className="Lists">
      <header className="Lists__header">
        <span>Lists</span>
        <button className="Lists__create-button">
          <OpenModalButton
            modalComponent={
              <CreateListModal
                setNotifications={setNotifications}
                setNotificationMessage={setNotificationMessage}
              />
            }
            className="Lists__create-button-icon"
            Element={FaPlus}
            modalClass={{
              modal: "CreateListModal__step-one",
              modalBackground: "CreateListModal__step-one__overlay",
              modalContainer: "CreateListModal__one__container",
            }}
          />
        </button>
      </header>

      <section className="Lists__container">
        {lists &&
          lists.slice(0, 10).map((list) => (
            <div key={list.id}>
              <ListItem
                list={list}
                className="Lists__ListItem"
                container="ListItem__container"
                emoji="ListItem__emoji"
                name="ListItem__name"
                showActions={true}
                showHover={true}
                navigate={navigate}
                expandedListIds={expandedListIds}
                setExpandedListIds={setExpandedListIds}
                activeListId={activeListId}
                setActiveListId={setActiveListId}
                setNotifications={setNotifications}
                setNotificationMessage={setNotificationMessage}
                showDropdown={showDropdown}
              />
              <ListStocks
                expandedListIds={expandedListIds}
                setExpandedListIds={setExpandedListIds}
                list={list}
                stocks={stocks}
                sessionUser={sessionUser}
              />
            </div>
          ))}
      </section>
    </div>
  );
}

export default Lists;
