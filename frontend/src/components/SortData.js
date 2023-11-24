import React, { useEffect } from "react";
import { useState, useMemo } from "react";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState({});
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const sortedItems = useMemo(() => {
    if (sortConfig !== null) {
      return filteredItems.slice().sort((a, b) => {
        if (typeof a[sortConfig.key] === "string") {
          if (
            a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (
            a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    } else {
      return filteredItems;
    }
  }, [filteredItems, sortConfig, config]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const filteredRatings = (rating) => {
    if (rating === "All") {
      setFilteredItems(items);
    } else {
      let filter = items.filter((item) => {
        return Math.floor(item.avg_rating) == rating;
      });
      setFilteredItems(filter);
    }
  };
  return {
    items: sortedItems,
    requestSort,
    filteredRatings,
    sortConfig,
  };
};

export default useSortableData;
