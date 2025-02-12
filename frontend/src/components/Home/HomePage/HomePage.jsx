import "./HomePage.css";

import NewsFeed from "../NewsFeed";
import WatchListContainer from "../../List/ListContainer";

function HomePage() {
  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner"></div>
            <div className="HomePage__main__subtitle">Welcome to Finertia</div>
          </div>

          <NewsFeed />
        </div>

        <WatchListContainer className="WatchList-HomePage-container" />
      </div>
    </div>
  );
}

export default HomePage;
