import "./TransferModalDropdownSection.css";

import TransferModalDropdown from "../TransferModalDropdown/TransferModalDropdown";

function TransferModalDropdownSection({
  from,
  to,
  setFrom,
  setTo,
  sessionUser,
  showFrom,
  showTo,
  setShowFrom,
  setShowTo,
  fromRef,
  toRef,
  toggleDropdown,
  showConfirmation,
}) {
  const transferModalDropdownSectionProps = {
    from,
    to,
    setFrom,
    setTo,
    sessionUser,
    showFrom,
    showTo,
    setShowFrom,
    setShowTo,
    fromRef,
    toRef,
    toggleDropdown,
  };

  return (
    <>
      <div className="TransferModalDropdownSection">
        <span className="TransferModalDropdownSection__title">From</span>
        <div
          className={`TransferModalDropdownSection__button ${
            showFrom && "TransferModalDropdown--button-active"
          }
${showConfirmation && "TransferModalDropdownSection__button--disabled"}
          `}
          onClick={() => toggleDropdown("from")}
          ref={fromRef}
          disabled={showConfirmation}
        >
          {from} {from === "Individual" && `· $${sessionUser.balance}`}
        </div>
        {showFrom && (
          <TransferModalDropdown {...transferModalDropdownSectionProps} />
        )}
      </div>

      <div className="TransferModalDropdownSection">
        <span className="TransferModalDropdownSection__title">To</span>
        <div
          className={`TransferModalDropdownSection__button
            ${
              showConfirmation &&
              "TransferModalDropdownSection__button--disabled"
            }
            `}
          onClick={() => toggleDropdown("to")}
          ref={toRef}
        >
          {from === "Bank" ? "Individual" : "Bank"}
        </div>
        {showTo && (
          <TransferModalDropdown {...transferModalDropdownSectionProps} />
        )}
      </div>
    </>
  );
}

export default TransferModalDropdownSection;
