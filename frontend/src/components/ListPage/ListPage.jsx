import "./ListPage.css";

import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

import EmojiPicker from "emoji-picker-react";

import { useParams, useLocation } from "react-router-dom";
// import { useModal } from "../../context/Modal";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchAllStocks } from "../../../store/stocks";
import { fetchLists } from "../../../store/lists";

import LoadingSpinner from "../LoadingSpinner";

import ListContainer from "../List/ListContainer";

import { editList } from "../../../store/lists";
import { MdClose } from "react-icons/md";

import { deleteList } from "../../../store/lists";

import { editListStocks } from "../../../store/stocks";

function ListPage() {
  const { listId } = useParams();
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stocks = useSelector((state) => state.stocks.allStocks);
  const lists = useSelector((state) => state.lists);

  const list = lists[listId];
  console.log("list:", list);

  // const { setModalContent, setModalClass } = useModal();
  const [selectedEmoji, setSelectedEmoji] = useState(list?.type || "");
  const [showPicker, setShowPicker] = useState(false);

  const [listName, setListName] = useState("");

  const [sortedStocks, setSortedStocks] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const popoverRef = useRef(null);
  const [deletePopover, setDeletePopover] = useState(false);

  const handleEmojiClick = async (emojiData) => {
    const newEmoji = emojiData.emoji;
    setSelectedEmoji(newEmoji);
    const editedList = {
      stockListId: list.id,
      name: listName,
      type: newEmoji,
    };

    await dispatch(editList(editedList));

    setShowPicker(false);
  };
  useEffect(() => {
    if (list) {
      setSelectedEmoji(list.type);
      setListName(list.name);
    }
  }, [list]);

  const handleListName = async (e) => {
    const newName = e.target.value;
    setListName(newName);

    const editedList = {
      stockListId: list.id,
      name: newName,
      type: selectedEmoji,
    };
    console.log(editedList);
    await dispatch(editList(editedList));
  };

  const handleDelete = async () => {
    await dispatch(deleteList(listId));
    if (location.pathname.includes(listId)) {
      navigate("/");
    }
  };

  const handleSort = (criteria) => {
    let sortedData = [...list.Stocks];

    const newDirection =
      criteria === sortCriteria && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    if (criteria === "name") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.stockName.localeCompare(b.stockName)
          : b.stockName.localeCompare(a.stockName)
      );
    } else if (criteria === "symbol") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.stockSymbol.localeCompare(b.stockSymbol)
          : b.stockSymbol.localeCompare(a.stockSymbol)
      );
    } else if (criteria === "current_price") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.current_price - b.current_price
          : b.current_price - a.current_price
      );
    } else if (criteria === "market_cap") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.market_cap - b.market_cap
          : b.market_cap - a.market_cap
      );
    } else if (criteria === "todays_change_percent") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.todays_change_percent - b.todays_change_percent
          : b.todays_change_percent - a.todays_change_percent
      );
    }

    setSortedStocks(sortedData);
    setSortCriteria(criteria);
  };

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

  useEffect(() => {
    console.log("fetching stocks... stocks page");
    dispatch(fetchLists());
    dispatch(fetchAllStocks());
  }, [dispatch]);

  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  useEffect(() => {
    if (list?.Stocks && list?.Stocks?.length > 0) {
      setSortedStocks(list.Stocks);
    } else {
      setSortedStocks([]);
    }
  }, [list, listId]);

  if (!stocks) return <h1>Loading</h1>;

  return (
    <div className="ListPage">
      <div className="ListPage__body">
        <div className="ListPage__body-left">
          <div className="ListPage__section">
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
                  <span className="ListPage__delete-text">
                    Delete {list?.name}
                  </span>
                </div>
              )}
            </div>
            <span className="ListPage__subtitle">
              {list?.Stocks?.length} items
            </span>
          </div>

          <div className="stocks__table-container">
            {sortedStocks.length === 0 ? (
              <div className="ListPage__no-stocks">
                <span className="ListPage__no-stocks-text">
                  Feels a little empty in here...
                </span>
                <span className="ListPage__no-stocks-subtext">
                  Search for companies to add and stay up to date.
                </span>
              </div>
            ) : (
              <table className="stocks__table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>Name</th>
                    <th onClick={() => handleSort("symbol")}>Symbol</th>
                    <th onClick={() => handleSort("current_price")}>Price</th>
                    <th onClick={() => handleSort("todays_change_percent")}>
                      Today
                    </th>
                    <th onClick={() => handleSort("market_cap")}>Market Cap</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="stocks__table-body">
                  {sortedStocks ? (
                    sortedStocks?.map((stock) => {
                      console.log(stock);
                      return (
                        <tr
                          key={stock?.id}
                          className="stock-row"
                          onClick={() =>
                            navigate(`/stocks/${stock?.stockSymbol}`)
                          }
                        >
                          <td>{stock?.stockName}</td>
                          <td>{stock?.stockSymbol}</td>
                          <td>
                            ${stocks?.[stock.id]?.current_price?.toFixed(2)}
                          </td>
                          <td>
                            <span className="stocks-table-arrow-container">
                              {stocks?.[stock.id]?.todays_change_percent > 0 ? (
                                <GoTriangleUp className="triangleIconUp" />
                              ) : (
                                <GoTriangleDown className="triangleIconDown" />
                              )}
                              {stocks?.[
                                stock.id
                              ]?.todays_change_percent?.toFixed(2)}
                              %
                            </span>
                          </td>
                          <td>
                            {formatNumber(stocks?.[stock.id]?.market_cap)}
                          </td>
                          <td>
                            <MdClose
                              className="ListPage__delete"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("clicked");
                                const id = Number(listId);
                                await dispatch(
                                  editListStocks({ [id]: false }, stock)
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="Stocks-loading-spinner">
                      <LoadingSpinner />
                    </div>
                  )}

                  <tr className="stock-row"></tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <ListContainer
          className="WatchList-HomePage-container"
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default ListPage;
