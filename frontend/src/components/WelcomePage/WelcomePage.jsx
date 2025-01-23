import "./WelcomePage.css";
import WelcomePageNav from "./WelcomePageNav/WelcomePageNav";

function WelcomePage({isLoaded}) {
  // console.log(sessionUser)
  return (
    <div className="welcome-page-container">
      <WelcomePageNav isLoaded={isLoaded}/>
      <div className="welcome-page-1">Section 1</div>
      <div className="welcome-page-2">Section 2</div>
      <div className="welcome-page-3">Section 3</div>
      <div className="welcome-page-footer">Footer</div>
    </div>
  );
}

export default WelcomePage;
