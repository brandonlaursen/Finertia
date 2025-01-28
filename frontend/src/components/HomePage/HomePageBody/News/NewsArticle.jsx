function NewsArticle({ news }) {
  function timeAgo(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp; 

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / (3600 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `Just now`;
    }
  }

  return (
    <a href={news.url && news.url} className="news-anchor">
      <div className="news-link-container">
        <div className="news-text-container">
          <span>
            {news.source && news.source}
            <span className="time-ago">{timeAgo(news.datetime)}</span>
          </span>
          <span>{news.headline && news.headline}</span>
          <span>{news.category && news.category}</span>
        </div>

        <div className="news-image-container">
          <img src={news.image && news.image} />
        </div>
      </div>
    </a>
  );
}

export default NewsArticle;
