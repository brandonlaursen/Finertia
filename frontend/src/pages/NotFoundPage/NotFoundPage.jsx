import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <div className="NotFoundPage__container">
        <div className="NotFoundPage__content">
          <h1>404</h1>
          <h2>Oops! Page Not Found</h2>
          <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

          <div className="NotFoundPage__actions">
            <Link to="/" className="NotFoundPage__button">
              Return to Home
            </Link>
            <Link to="/stocks" className="NotFoundPage__button secondary">
              Browse Stocks
            </Link>
          </div>
        </div>
        <div className="NotFoundPage__illustration">
        
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
