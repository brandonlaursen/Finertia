import "./ListItem.css";

import ListItemActions from "./ListItemActions";

function ListItem({
  list,
  className,
  container,
  emoji,
  name,
  showActions,
  showHover,
  expandedListIds,
  setExpandedListIds,
  activeListId,
  setActiveListId,
  navigate,
  setNotifications,
  setNotificationMessage,
}) {
  const isCurrentList = activeListId === list.id;

  return (
    <article
      onClick={() => navigate(`/lists/${list.id}`)}
      className={`ListItem ${className}`}
    >
      <div className={container}>
        <header
          className={`ListItem__header ${
            showHover && `ListItem__header-hover`
          }`}
        >
          <span className={emoji}>{list?.emoji}</span>
          <div className="ListItem__name-container">
            <span className={name}>{list?.name}</span>
            <span className="ListItem__item-count">
              {list?.Stocks?.length || 0} items
            </span>
          </div>
        </header>

        {showActions && (
          <ListItemActions
            list={list}
            isCurrentList={isCurrentList}
            setActiveListId={setActiveListId}
            showActions={showActions}
            expandedListIds={expandedListIds}
            setExpandedListIds={setExpandedListIds}
            navigate={navigate}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
          />
        )}
      </div>
    </article>
  );
}

export default ListItem;
