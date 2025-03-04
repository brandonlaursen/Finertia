import "./HomePageNewsFeed.css";
import { MdInfoOutline } from "react-icons/md";
import { FaBitcoin } from "react-icons/fa";
import { TbPlaneTilt } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { TbArrowMergeRight } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import HomePageNewsArticle from "./HomePageNewsArticle";

import {
  fetchStockNews,
  fetchStockNewsByCategory,
} from "../../../../store/stocks";

import Skeleton from "../../../components/Skeleton";

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
    setCurrentPage(1); // Reset to first page when changing category
    await dispatch(fetchStockNewsByCategory(e.target.value));
  };

  if (!stockNews) {
    return (
      <div className="HomePage__skeleton-news">
        <Skeleton height="400px" />
      </div>
    );
  }

  // Calculate pagination
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

      {totalPages > 1 && (
        <div className="HomePageNewsFeed__pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="HomePageNewsFeed__pagination-button"
          >
            Previous
          </button>
          <span className="HomePageNewsFeed__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="HomePageNewsFeed__pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePageNewsFeed;
