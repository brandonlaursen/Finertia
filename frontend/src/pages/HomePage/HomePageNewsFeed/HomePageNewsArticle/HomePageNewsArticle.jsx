import "./HomePageNewsArticle.css";

import findTimeAgo from "../findTimeAgo.js";

function HomePageNewsArticle({ article }) {
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
              {findTimeAgo(article.datetime)}
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
