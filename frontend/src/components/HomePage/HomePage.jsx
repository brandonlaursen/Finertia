import "./HomePage.css";

import NewsFeed from "./News";

function HomePage() {
  return (
    <div className="HomePage">

        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner"></div>
            <div className="HomePage__main__subtitle">Welcome to Finertia</div>
          </div>

          <NewsFeed />
        </div>

        {/* Stock lists */}
        <div className="HomePage__aside"> </div>

    </div>
  );
}

export default HomePage;
