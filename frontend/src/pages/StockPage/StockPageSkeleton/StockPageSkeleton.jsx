import "./StockPageSkeleton.css";

import Skeleton from "../../../components/Skeleton/Skeleton";

function StockPageSkeleton() {
  return (
    <>
      <div className="StockPage__skeleton-overview">
        <Skeleton height="100px" />
      </div>
      <div className="StockPage__skeleton-chart">
        <Skeleton height="350px" />
      </div>
      <div className="StockPage__skeleton-details">
        <Skeleton height="200px" />
      </div>
      <div className="StockPage__skeleton-news">
        <Skeleton height="400px" />
      </div>
    </>
  );
}

export default StockPageSkeleton;
