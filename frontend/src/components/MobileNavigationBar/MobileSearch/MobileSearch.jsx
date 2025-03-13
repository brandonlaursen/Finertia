import "./MobileSearch.css";
import { IoSearch } from "react-icons/io5";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchSearchResults } from "../../../../store/search";

function MobileSearch({ setShowSearch }) {
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

  async function handleMouseDown(result) {
    setShowSearch(false);
    navigate(`/stocks/${result.stockSymbol}`);
  }

  return (
    <div className="MobileSearch">
      <div className="MobileSearch__bar">
        <IoSearch className="MobileSearch-icon" />
        <input
          className="MobileSearch-input"
          placeholder="Search"
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>

        <button
          className={`MobileSearch-cancel-btn ${search && "MobileSearch-cancel-btn--active"}`}
          onClick={() => setShowSearch(false)}
        >
          Cancel
        </button>
      </div>

      {isFocused && search.length > 0 && searchResults.length > 0 && (
        <ul className="MobileSearch-results" ref={searchResultsRef}>
          <span className="MobileSearch-results-header">Stocks</span>
          {searchResults.map((result) => {
            return (
              <li key={result.id} onMouseDown={() => handleMouseDown(result)}>
                <span className="MobileSearch-results__stock-symbol">
                  {highlightMatch(result.stockSymbol, search)}
                </span>
                <span className="MobileSearch-results__stock-name">
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

export default MobileSearch;
