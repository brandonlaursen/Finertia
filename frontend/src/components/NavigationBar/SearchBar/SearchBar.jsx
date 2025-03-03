import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchSearchResults } from "../../../../store/search";

function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchResults = useSelector((state) => state.search);

  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  const searchResultsRef = useRef(null);

  useEffect(() => {
    if (search.length > 0) {
      dispatch(fetchSearchResults(search));
    }
  }, [search, dispatch]);

  const handleBlur = (e) => {
    if (
      searchResultsRef.current &&
      !searchResultsRef.current.contains(e.relatedTarget)
    ) {
      setIsFocused(false);
    }
  };

  function highlightMatch(text, search) {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  return (
    <div className="SearchBar">
      <IoSearch id="SearchBar-icon" />
      <input
        className="SearchBar-input"
        placeholder="Search"
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      {isFocused && search.length > 0 && searchResults.length > 0 && (
        <ul className="SearchBar-results" ref={searchResultsRef}>
          <span className="SearchBar-results-header">Stocks</span>
          {searchResults.map((result) => {
            return (
              <li
                key={result.id}
                onMouseDown={(e) => {
                  e.stopPropagation(),
                    navigate(`/stocks/${result.stockSymbol}`);
                }}
              >
                <span className="SearchBar-results__stock-symbol">
                  {highlightMatch(result.stockSymbol, search)}
                </span>
                <span className="SearchBar-results__stock-name">
                  {highlightMatch(result.stockName, search)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
