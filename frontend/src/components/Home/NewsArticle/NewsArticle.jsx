import "./NewsArticle.css";

function NewsArticle({ news }) {
  function timeAgo(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

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
    <a href={news.url && news.url} className="NewsArticle-anchor">
      <div className="NewsArticle">
        <div className="NewsArticle__main">
          <span className="NewsArticle__source">
            {news.source && news.source}
            <span className="NewsArticle__time">{timeAgo(news.datetime)}</span>
          </span>
          <span className="NewsArticle__headline">
            {news.headline && news.headline}
          </span>
          <span className="NewsArticle__category">
            {news.category && news.category}
          </span>
        </div>

        <div className="NewsArticle__image">
          <img src={news.image && news.image} />
        </div>
      </div>
    </a>
  );
}

export default NewsArticle;
