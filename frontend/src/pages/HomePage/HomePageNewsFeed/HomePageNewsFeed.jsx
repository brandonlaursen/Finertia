import "./HomePageNewsFeed.css";
import { MdInfoOutline } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Skeleton from "../../../components/Skeleton";
import HomePageNewsCategories from "./HomePageNewsCategories/HomePageNewsCategories";
import HomePageNewsArticles from "./HomePageNewsArticles/HomePageNewsArticles";
import Pagination from "../../../components/Pagination";

import {
  fetchStockNews,
  fetchStockNewsByCategory,
} from "../../../../store/stocks";

function HomePageNewsFeed() {
  const dispatch = useDispatch();
  const stockNews = useSelector((state) => state.stocks.news);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchStockNews());
  }, [dispatch]);

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

  const chooseCategory = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await dispatch(fetchStockNewsByCategory(e.target.value));
  };

  return (
    <div className="HomePageNewsFeed">
      <h2>
        News
        <MdInfoOutline className="HomePageNewsFeed__info-icon" />
      </h2>
      <HomePageNewsCategories chooseCategory={chooseCategory} />
      <HomePageNewsArticles currentNews={currentNews} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

export default HomePageNewsFeed;
