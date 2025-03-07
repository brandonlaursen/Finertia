import "./TransferModalDropdown.css";
import { GrFormCheckmark } from "react-icons/gr";

function TransferModalDropdown({
  showFrom,
  setFrom,
  setTo,
  from,
  sessionUser,
}) {
  if (!showFrom) return null;

  return (
    <div className="TransferModalDropdown">
      <section className="TransferModalDropdown__section">
        <header className="TransferModalDropdown__header">
          Fintertia accounts
        </header>

        <main
          onClick={() => {
            setFrom("Individual"), setTo("Bank");
          }}
          className={`TransferModalDropdown__main ${
            from === "Individual" ? "TransferModalDropdown__main--selected" : ""
          }`}
        >
          {from === "Individual" && (
            <GrFormCheckmark className="TransferModalDropdown__check-mark" />
          )}

          <div className="TransferModalDropdown__text-container">
            <span className="TransferModalDropdown__text">Individual</span>
            <span className="TransferModalDropdown__sub-text">
              Withdrawable cash · ${sessionUser.balance}
            </span>
          </div>
        </main>
      </section>

      <section className="TransferModalDropdown__section">
        <header className="TransferModalDropdown__header">
          External accounts
        </header>
        <main
          onClick={() => {
            setFrom("Bank"), setTo("Individual");
          }}
          className={`TransferModalDropdown__main ${
            from === "Bank" ? "TransferModalDropdown__main--selected" : ""
          }`}
        >
          {from === "Bank" && (
            <GrFormCheckmark className="TransferModalDropdown__check-mark" />
          )}

          <div className="TransferModalDropdown__text-container">
            <span className="TransferModalDropdown__text">Finertia Bank</span>
            <span className="TransferModalDropdown__sub-text">
              Typically 1-2 seconds
            </span>
          </div>
        </main>
      </section>
    </div>
  );
}

export default TransferModalDropdown;
