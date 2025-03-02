import "./StockNews.css";

function StockNews({ stockNews }) {
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

  return (
    <>
      <header className="StockNews__header">News</header>
      <section className="StockNews__articles">
        {stockNews &&
          stockNews.map((news) => {
            return (
              <a href={news.article_url} key={news.id}>
                <div className="StockNews__article">
                  <div className="StockNews__article-main">
                    <section className="StockNews__article-author">
                      <span>
                        {news.author}
                        <span className="StockNews__article-time">
                          {timeAgo(news.published_utc)}
                        </span>
                      </span>
                    </section>
                    <section className="StockNews__article-title">
                      {news.title}
                    </section>
                    <section className="StockNews__article-contents">
                      {news.description}
                    </section>
                  </div>
                  <section className="StockNews__article-image">
                    {news.image_url && <img src={news.image_url} />}
                  </section>
                </div>
              </a>
            );
          })}
      </section>
    </>
  );
}

export default StockNews;
