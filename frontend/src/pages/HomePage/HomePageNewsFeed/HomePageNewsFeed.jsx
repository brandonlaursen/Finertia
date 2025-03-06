import "./HomePageNewsFeed.css";
import { MdInfoOutline } from "react-icons/md";
import { FaBitcoin } from "react-icons/fa";
import { TbPlaneTilt } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { TbArrowMergeRight } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import HomePageNewsArticle from "./HomePageNewsArticle";
import Skeleton from "../../../components/Skeleton";

import {
  fetchStockNews,
  fetchStockNewsByCategory,
} from "../../../../store/stocks";
import Pagination from "../../../components/Pagination";

function HomePageNewsFeed() {
  const dispatch = useDispatch();
  const stockNews = useSelector((state) => state.stocks.news);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchStockNews());
  }, [dispatch]);

  const chooseCategory = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await dispatch(fetchStockNewsByCategory(e.target.value));
  };

  if (!stockNews) {
    return (
      <div className="HomePage__skeleton-news">
        <Skeleton height="400px" />
      </div>
    );
  }

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = stockNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(stockNews.length / newsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

      <div className="HomePageNewsFeed__articles">
        {currentNews &&
          currentNews.map((article, i) => (
            <HomePageNewsArticle key={i} article={article} />
          ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

export default HomePageNewsFeed;
