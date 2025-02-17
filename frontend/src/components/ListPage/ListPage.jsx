import "./ListPage.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ListContainer from "../List/ListContainer";
import ListPageEdit from "./ListPageEdit";
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
      <div className="ListPage__body">
        <div className="ListPage__body-left">
          <div className="ListPage__section">
            <ListPageEdit list={list} listId={listId} navigate={navigate} />
          </div>

          <ListPageStockTable list={list} listId={listId} stocks={stocks} navigate={navigate}/>
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
