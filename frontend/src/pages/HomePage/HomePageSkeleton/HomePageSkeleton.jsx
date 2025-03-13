import "./HomePageSkeleton.css";

import Skeleton from "../../../components/Skeleton";

function HomePageSkeleton() {
  return (
    <>
      <div className="HomePage__skeleton-overview">
        <Skeleton height="100px" />
      </div>
      <div className="HomePage__skeleton-chart">
        <Skeleton height="350px" />
      </div>
      <div className="HomePage__skeleton-buying-power">
        <Skeleton height="80px" />
      </div>
      <div className="HomePage__skeleton-news">
        <Skeleton height="400px" />
      </div>
    </>
  );
}

export default HomePageSkeleton;
