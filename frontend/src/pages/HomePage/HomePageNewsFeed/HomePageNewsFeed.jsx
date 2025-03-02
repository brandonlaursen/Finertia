import "./HomePageNewsFeed.css";
import { MdInfoOutline } from "react-icons/md";
import { FaBitcoin } from "react-icons/fa";
import { TbPlaneTilt } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { TbArrowMergeRight } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import HomePageNewsArticle from "../HomePageNewsArticle";
import LoadingSpinner from "../../../components/LoadingSpinner";

import {
  fetchStockNews,
  fetchStockNewsByCategory,
} from "../../../../store/stocks";

function HomePageNewsFeed() {
  const dispatch = useDispatch();
  const stockNews = useSelector((state) => state.stocks.news);

  useEffect(() => {
    dispatch(fetchStockNews());
  }, [dispatch]);

  const chooseCategory = async (e) => {
    e.preventDefault();

    await dispatch(fetchStockNewsByCategory(e.target.value));
  };

  if (!stockNews) {
    return <LoadingSpinner />;
  }

  return (
    <div className="HomePageNewsFeed">
      <h2>
        News
        <MdInfoOutline className="HomePageNewsFeed__info-icon" />
      </h2>

      <div className="HomePageNewsFeed__categories">
        <button onClick={chooseCategory} value="General">
          <FaRegListAlt />
          General
        </button>
        <button onClick={chooseCategory} value="forex">
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
          return <HomePageNewsArticle news={news} key={news.id} />;
        })}
    </div>
  );
}

export default HomePageNewsFeed;
