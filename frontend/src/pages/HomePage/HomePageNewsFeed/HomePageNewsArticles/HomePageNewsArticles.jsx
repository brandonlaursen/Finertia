import "./HomePageNewsArticles.css";

import HomePageNewsArticle from "../HomePageNewsArticle/HomePageNewsArticle";

function HomePageNewsArticles({ currentNews }) {
  return (
    <div className="HomePageNewsArticles">
      {currentNews.map((article, i) => (
        <HomePageNewsArticle key={i} article={article} />
      ))}
    </div>
  );
}

export default HomePageNewsArticles;
