import "./HelpPage.css";

import { IoIosInformationCircle } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

function HelpPage() {
  return (
    <div className="HelpPage">
      <div className="HelpPage__section">
        <span className="HelpPage__section__text">
          <IoIosInformationCircle className="HelpPage__info-icon" />
          🔔 Ready for tax season? Most tax forms will be available by Tuesday,
          February 18th. Tax Center
        </span>
      </div>

      <div>
        <div className="HelpPage__support-section">
          <div className="HelpPage__support-section__title">Support Tools</div>
          <div className="HelpPage__support-section__links">
            <span className="HelpPage__support-section__link">
              <IoMdHelpCircle className="HelpPage__icon"/>
              Help Center
            </span>
            <span className="HelpPage__support-section__link">
              <IoChatboxEllipsesSharp className="HelpPage__icon"/>
              Your Support chats
            </span>
            <span className="HelpPage__support-section__link">
              <IoIosInformationCircle className="HelpPage__icon"/>
              Disclosures
            </span>
          </div>
          <button className="HelpPage__button">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
