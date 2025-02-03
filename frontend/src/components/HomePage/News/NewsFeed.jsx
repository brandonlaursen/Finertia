import "./NewsFeed.css";
import { MdInfoOutline } from "react-icons/md";
import { FaBitcoin } from "react-icons/fa";
import { TbPlaneTilt } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { TbArrowMergeRight } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import NewsArticle from "./NewsArticle";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

import { fetchStockNews, fetchStockNewsByCategory } from "../../../../store/stocks";

function NewsFeed() {
  const dispatch = useDispatch();
  const stockNews = useSelector((state) => state.stock.news);

  useEffect(() => {
    async function getNews() {
      dispatch(fetchStockNews());
    }

    getNews();
  }, [dispatch]);

  if (!stockNews) {
    return <LoadingSpinner />;
  }

  const chooseCategory = async (e) => {
    e.preventDefault();

    await dispatch(fetchStockNewsByCategory(e.target.value));
  };

  return (
    <div className="NewsFeed">

      <span>
        Read Market News
        <MdInfoOutline id="NewsFeed__info-icon" />
      </span>

      <div className="NewsFeed__categories">
        <button onClick={chooseCategory} value="General">
          <FaRegListAlt />
          General
        </button>
        <button onClick={chooseCategory} value="forex">
          {" "}
          <TbPlaneTilt />
          Forex
        </button>
        <button onClick={chooseCategory} value="merger">
          <TbArrowMergeRight />
          Merger
        </button>
        <button onClick={chooseCategory} value="crypto">
          <FaBitcoin />
          Crypto
        </button>
      </div>

      {stockNews &&
        stockNews.map((news) => {
          return <NewsArticle news={news} key={news.id} />;
        })}

    </div>
  );
}

export default NewsFeed;
