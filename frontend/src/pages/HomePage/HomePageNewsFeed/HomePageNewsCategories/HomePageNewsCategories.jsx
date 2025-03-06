import "./HomePageNewsCategories.css";

import { FaBitcoin } from "react-icons/fa";
import { TbPlaneTilt } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { TbArrowMergeRight } from "react-icons/tb";

function HomePageNewsCategories({ chooseCategory }) {
  const categories = [
    { label: "general", icon: <FaRegListAlt /> },
    { label: "forex", icon: <TbPlaneTilt /> },
    { label: "merger", icon: <TbArrowMergeRight /> },
    { label: "crypto", icon: <FaBitcoin /> },
  ];

  return (
    <div className="HomePageNewsCategories">
      {categories.map(({ label, icon }) => (
        <button key={label} onClick={chooseCategory} value={label}>
          {icon} {label}
        </button>
      ))}
    </div>
  );
}

export default HomePageNewsCategories;
