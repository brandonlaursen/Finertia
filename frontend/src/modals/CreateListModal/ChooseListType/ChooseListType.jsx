import "./ChooseListType.css";

import ModalHeader from "../../../components/ModalHeader/ModalHeader";
import ModalOverlay from "../../../components/ModalOverlay/ModalOverlay";

function ChooseListType({ closeModal, setIsOpen }) {
  return (
    <div className="ChooseListType">
      <ModalOverlay closeModal={closeModal} />

      <div className="ChooseListType__wrapper">
        <main className="ChooseListType__container">
          <ModalHeader closeModal={closeModal}>Choose a list type</ModalHeader>

          <section className="ChooseListType__options">
            <div
              className="ChooseListType__option"
              onClick={() => setIsOpen(true)}
            >
              <div className="ChooseListType__option__image ChooseListType__image-one" />

              <div className="ChooseListType__option__text">
                <span className="ChooseListType__text__title">
                  Create watchlist
                </span>
                <span className="ChooseListType__text__sub-text">
                  Keep an on investments youre interested in
                </span>
              </div>
            </div>

            <div className="ChooseListType__option">
              <div className="ChooseListType__option__image ChooseListType__image-two" />

              <div className="ChooseListType__option__text">
                <span className="ChooseListType__text__title">
                  Create Screener
                </span>
                <span className="ChooseListType__text__sub-text">
                  Find your next trade with filters for price, volume, and other
                  indicators
                </span>
              </div>
            </div>
          </section>

          <button className="ChooseListType__back-button" onClick={closeModal}>
            Go back
          </button>
        </main>
      </div>
    </div>
  );
}

export default ChooseListType;
