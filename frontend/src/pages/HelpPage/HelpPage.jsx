import "./HelpPage.css";
import { IoIosInformationCircle } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

function HelpPage() {
  return (
    <div className="HelpPage">
      <main className="HelpPage__main">
        <div className="HelpPage__title">Support Tools</div>
        <div className="HelpPage__links">
          <span className="HelpPage__link">
            <IoMdHelpCircle className="HelpPage__icon" />
            Help Center
          </span>
          <span className="HelpPage__link">
            <IoChatboxEllipsesSharp className="HelpPage__icon" />
            Your Support chats
          </span>
          <span className="HelpPage__link">
            <IoIosInformationCircle className="HelpPage__icon" />
            Disclosures
          </span>
        </div>
        <button className="HelpPage__button">Contact Support</button>
      </main>
    </div>
  );
}

export default HelpPage;
