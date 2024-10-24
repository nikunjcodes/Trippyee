import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className="search-results">
      <h1>Search Results</h1>
      {searchResults.length > 0 ? (
        searchResults.map((property) => (
          <div key={property.id} className="property-card">
            <h2>{property.name}</h2>
            <p>Location: {property.location}</p>
            <p>Avg Price/day: Rs {property.price}</p>
            <p>Generating results.....</p>
          </div>
        ))
      ) : (
        <p>No properties found</p>
      )}
    </div>
  );
};

export default SearchResults;
