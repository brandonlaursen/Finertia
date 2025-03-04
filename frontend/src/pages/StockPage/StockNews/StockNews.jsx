import "./StockNews.css";
import { useState } from "react";

function StockNews({ stockNews }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(5);

  function timeAgo(timestamp) {
    const unixTimestamp = Math.floor(new Date(timestamp).getTime() / 1000);
    const now = Date.now() / 1000;
    const diff = now - unixTimestamp;

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / (3600 * 24));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `Just now`;
    }
  }

  // Calculate pagination
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = stockNews?.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil((stockNews?.length || 0) / newsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="StockNews">
      <h2 className="StockNews__header">News</h2>
      <section className="StockNews__articles">
        {currentNews &&
          currentNews.map((news) => {
            return (
              <a href={news.article_url} key={news.id}>
                <article className="StockNews__article">
                  <div className="StockNews__article-main">
                    <header className="StockNews__article-author">
                      <span>
                        {news.author}
                        <span className="StockNews__article-time">
                          {timeAgo(news.published_utc)}
                        </span>
                      </span>
                    </header>
                    <h2 className="StockNews__article-title">{news.title}</h2>
                    <span className="StockNews__article-contents">
                      {news.description}
                    </span>
                  </div>
                  <figure className="StockNews__article-image">
                    {news.image_url && <img src={news.image_url} />}
                  </figure>
                </article>
              </a>
            );
          })}
      </section>

      {totalPages > 1 && (
        <div className="StockNews__pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="StockNews__pagination-button"
          >
            Previous
          </button>
          <span className="StockNews__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="StockNews__pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StockNews;
