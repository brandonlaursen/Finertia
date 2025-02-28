import "./ListPage.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ListContainer from "../List/ListContainer";
import ListEdit from "./ListEdit";
import ListPageStockTable from "./ListPageStockTable/ListPageStockTable";

import { fetchAllStocks } from "../../../store/stocks";
import { fetchLists } from "../../../store/lists";

import { selectListById } from "../../../store/lists";

function ListPage() {
  const { listId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stocks = useSelector((state) => state.stocks.allStocks);
  const list = useSelector((state) => selectListById(state, listId));

  useEffect(() => {
    dispatch(fetchLists());
    dispatch(fetchAllStocks());
  }, [dispatch]);

  if (!stocks || !list) return <h1>Loading</h1>;

  return (
    <div className="ListPage">
      <div className="ListPage__container">
        <main className="ListPage__main">
          <section className="ListPage__section">
            <ListEdit list={list} listId={listId} navigate={navigate} />
          </section>

          <ListPageStockTable list={list} listId={listId} stocks={stocks} navigate={navigate}/>
        </main>

        <ListContainer
          className="WatchList-HomePage-container"
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default ListPage;
