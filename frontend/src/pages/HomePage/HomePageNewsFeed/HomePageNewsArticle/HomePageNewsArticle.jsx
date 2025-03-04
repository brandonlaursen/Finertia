import "./HomePageNewsArticle.css";

function HomePageNewsArticle({ article }) {
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
    <a
      href={article.url && article.url}
      className="HomePageNewsArticle__anchor"
    >
      <article className="HomePageNewsArticle">
        <section className="HomePageNewsArticle__main">
          <span className="HomePageNewsArticle__source">
            {article.source && article.source}
            <time className="HomePageNewsArticle__time">
              {timeAgo(article.datetime)}
            </time>
          </span>
          <h2 className="HomePageNewsArticle__headline">
            {article.headline && article.headline}
          </h2>
          <small className="HomePageNewsArticle__category">
            {article.category && article.category}
          </small>
        </section>

        <figure className="HomePageNewsArticle__image">
          <img src={article.image && article.image} />
        </figure>
      </article>
    </a>
  );
}

export default HomePageNewsArticle;
