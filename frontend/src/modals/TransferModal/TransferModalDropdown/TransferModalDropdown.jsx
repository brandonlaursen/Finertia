import "./TransferModalDropdown.css";
import { GrFormCheckmark } from "react-icons/gr";

function TransferModalDropdown({
  showFrom,
  from,
  setFrom,
  setTo,
  sessionUser,
}) {
  if (!showFrom) return null;

  const options = [
    {
      category: "Fintertia accounts",
      label: "Individual",
      subText: `Withdrawable cash · $${sessionUser.balance}`,
      value: "Individual",
    },
    {
      category: "External accounts",
      label: "Finertia Bank",
      subText: "Typically 1-2 seconds",
      value: "Bank",
    },
  ];

  const handleSelection = (selectedFrom) => {
    setFrom(selectedFrom);
    setTo(selectedFrom === "Individual" ? "Bank" : "Individual");
  };

  return (
    <div className="TransferModalDropdown">
      {options.map(({ category, label, subText, value }) => (
        <section key={value} className="TransferModalDropdown__section">
          <header className="TransferModalDropdown__header">{category}</header>
          <main
            onClick={() => handleSelection(value)}
            className={`TransferModalDropdown__main ${
              from === value ? "TransferModalDropdown__main--selected" : ""
            }`}
          >
            {from === value && (
              <GrFormCheckmark className="TransferModalDropdown__check-mark" />
            )}
            <div className="TransferModalDropdown__text-container">
              <span className="TransferModalDropdown__text">{label}</span>
              <span className="TransferModalDropdown__sub-text">{subText}</span>
            </div>
          </main>
        </section>
      ))}
    </div>
  );
}

export default TransferModalDropdown;
