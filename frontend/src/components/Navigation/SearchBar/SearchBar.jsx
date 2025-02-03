import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";

import { useState } from "react";

function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="search-bar-container">
      <IoSearch id="search-icon" />
      <input
        className="search-bar"
        placeholder="Search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      ></input>
      {isFocused && (
        <ul className="search-results">
          <li>Stocks</li>
          <li>Search Result 1</li>
          <li>Search Result 2</li>
          <li>Search Result 3</li>
          <li>Search Result 4</li>
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
