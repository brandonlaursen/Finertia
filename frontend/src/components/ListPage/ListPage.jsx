import "./ListPage.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ListContainer from "../List/ListContainer";
import ListEdit from "./ListEdit";

import { fetchAllStocks } from "../../../store/stocks";
import { fetchLists } from "../../../store/lists";

import { selectListById } from "../../../store/lists";

import StocksTable from "../Stocks/StocksTable/StocksTable";

function ListPage() {
  const { listId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stocks = useSelector((state) => state.stocks.allStocks);

  const list = useSelector((state) => selectListById(state, listId));

  const [isLoading, setIsLoading] = useState(true);

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      await dispatch(fetchLists());
      await dispatch(fetchAllStocks());
      if (isMounted) {
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isLoading) return <h1>Loading</h1>;

  return (
    <div className="ListPage">
      <div className="ListPage__container">
        <main className="ListPage__main">
          <section className="ListPage__section">
            <ListEdit list={list} listId={listId} navigate={navigate} />
          </section>

          {list.Stocks.length > 0 ? (
            <div className="Stocks__table-container">
              <StocksTable
                stocks={stocks}
                // handleSort={handleSort}
                // sortedStocks={sortedStocks}
                listStocks={list.Stocks}
                navigate={navigate}
                list={list}
                listId={listId}
                setNotifications={setNotifications}
                setNotificationMessage={setNotificationMessage}
                notifications={notifications}
                notificationMessage={notificationMessage}
              />
            </div>
          ) : (
            <div className="ListPage__no-stocks">
              <span className="ListPage__no-stocks-text">
                Feels a little empty in here...
              </span>
              <span className="ListPage__no-stocks-subtext">
                Search for companies to add and stay up to date.
              </span>
            </div>
          )}
        </main>

        <ListContainer className="List_home-container" navigate={navigate} />
      </div>
    </div>
  );
}

export default ListPage;
