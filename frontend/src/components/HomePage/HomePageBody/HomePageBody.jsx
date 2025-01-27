import "./HomePageBody.css";
import { MdInfoOutline } from "react-icons/md";

function HomePageBody() {
  return (
    <div className="home-page-body-container">
      <div className="left-container">
        <div className="left-container-top">
          <div className="left-header-1">Investing</div>
          <div className="left-banner"></div>
          <div className="left-header-2">Welcome to Finertia</div>
        </div>

        <div className="left-container-news">
          <span>
            Read Market News
            <MdInfoOutline id='news-info'/>

          </span>
        </div>
      </div>

      {/* Stock lists */}
      <div className="right-container"> </div>
    </div>
  );
}

export default HomePageBody;
