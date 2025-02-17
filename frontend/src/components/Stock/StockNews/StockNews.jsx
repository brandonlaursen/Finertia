import "./StockNews.css";

function StockNews({ stockNews }) {
  return (
    <>
      <span className="news-title">News</span>
      <div className="stock-news-container">
        {stockNews &&
          stockNews.map((news) => {
            return (
              <a href={news.url} key={news.id}>
                <div className="news-container">
                  <div className="news-text">
                    <span className="news-header">
                      <span>{news.author}</span>
                      <span>{news.published_utc?.split("T")[0]}</span>
                    </span>
                    <span className="news-main-text">{news.title}</span>
                    <span className="news-sub-text">{news.description}</span>
                  </div>
                  <div className="news-image">
                    {news.image_url && <img src={news.image_url} />}
                  </div>
                </div>
              </a>
            );
          })}
      </div>
    </>
  );
}

export default StockNews;
