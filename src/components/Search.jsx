import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // 👈 useNavigate instead of history

import "./styles.css";

const Search = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState(query || "");
  const navigate = useNavigate(); // 👈 new

  useEffect(() => {
    // Debounce route changes
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        navigate(`/${searchQuery}`);
      } else {
        navigate(`/`);
      }
    }, 300);

    return () => clearTimeout(delayDebounce); // Clear on re-render
  }, [searchQuery, navigate]);

  return (
    <div className="container-search mb-4">
      <Form.Label>Name or number</Form.Label>
      <div className="container-input-btn">
        <input
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          value={searchQuery}
          placeholder="Ex. Bulbasaur"
        />
        {searchQuery !== "" && (
          <button onClick={() => setSearchQuery("")} className="btn-clear">
            <FontAwesomeIcon icon={faTimes} color={"white"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
