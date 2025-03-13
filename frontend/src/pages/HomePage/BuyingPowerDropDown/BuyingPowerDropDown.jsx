import "./BuyingPowerDropdown.css";

import { useModal } from "../../../context/Modal";

import TransferModal from "../../../modals/TransferModal";

function BuyingPowerDropdown({
  balance,
  setNotifications,
  setNotificationMessage,
  notifications,
  notificationMessage,
}) {
  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="BuyingPowerDropDown">
      <main className="BuyingPowerDropDown__main">
        <section className="BuyingPowerDropDown__details">
          <div className="BuyingPowerDropDown__label">
            <span>Individual Cash</span>
            <span className="BuyingPowerDropDown__value">
              ${balance ? balance.toFixed(2) : 0}
            </span>
          </div>
          <div className="BuyingPowerDropDown__label">
            <span>Total</span>
            <span className="BuyingPowerDropDown__value">
              ${balance ? balance.toFixed(2) : 0}
            </span>
          </div>
        </section>

        <section className="BuyingPowerDropDown__buttons">
          <button
            className="BuyingPowerDropDown__button"
            onClick={(e) => {
              e.stopPropagation();
              setModalContent(
                <TransferModal
                  setNotifications={setNotifications}
                  setNotificationMessage={setNotificationMessage}
                  notifications={notifications}
                  notificationMessage={notificationMessage}
                />
              );
              setModalClass({
                modal: "TransferModal",
                modalBackground: "TransferModal__background",
                modalContainer: "TransferModal__container",
              });
            }}
          >
            Deposit Funds
          </button>
        </section>
      </main>
    </div>
  );
}

export default BuyingPowerDropdown;
