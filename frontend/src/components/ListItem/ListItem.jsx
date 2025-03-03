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
          <span className={name}>{list?.name}</span>
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
          />
        )}
      </div>
    </article>
  );
}

export default ListItem;
