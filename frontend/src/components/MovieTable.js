import { useState, useEffect } from "react";
import useSortableData from "./SortData";
import Rating from "@mui/material/Rating";
import Popover from "@mui/material/Popover";

const MovieTable = ({ movies, onUpdate }) => {
  const { items, requestSort, filteredRatings, sortConfig } =
    useSortableData(movies);
  const ratingOptions = ["All", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showRating, setShowRating] = useState(false);
  const [movieRating, setMovieRating] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [movieId, setMovieId] = useState(null);

  useEffect(() => {
    onUpdate(movieId, movieRating);
  }, [movieRating]);

  const handleRatingClick = (event, id) => {
    setAnchorEl(event.currentTarget);

    setMovieId(id);
  };

  const handleClose = (event) => {
    setMovieRating(parseInt(event.currentTarget.value));

    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : "default";
  };

  return (
    <div className="tableContainer">
      <table className="movieTable">
        <thead>
          <tr>
            <th
              className={getClassNamesFor("title")}
              onClick={() => requestSort("title")}
            >
              Title
            </th>
            <th className="hide">IMDB</th>
            <th className={getClassNamesFor("rating")}>
              <div className="th-container">
                <div
                  className={getClassNamesFor("rating")}
                  onClick={() => requestSort("avg_rating")}
                >
                  Rating{" "}
                </div>
              </div>
            </th>
            <th
              className={getClassNamesFor("created")}
              onClick={() => requestSort("created")}
            >
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td className="hide"></td>
            <td className="td-center">
              <div className="rating-filter-container">
                <select
                  className="rating-filter"
                  onChange={(e) => filteredRatings(e.target.value)}
                >
                  {ratingOptions.map((ratingOption) => {
                    return (
                      <option key={ratingOption} value={ratingOption}>
                        {ratingOption}
                      </option>
                    );
                  })}
                </select>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="title-container">
                    <img src={item.image} alt={item.title + " poster"} />
                    {window.innerWidth > 600 ? (
                      item.title
                    ) : (
                      <a href={item.imdb} target="_blank">
                        {item.title}{" "}
                      </a>
                    )}
                  </div>
                </td>
                <td className="imdb-link hide">
                  <a href={item.imdb} target="_blank">
                    {item.imdb}
                  </a>
                </td>
                <td>
                  <div className="rating-container">
                    {
                      <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Rating
                          className="ratinghover"
                          max={10}
                          onChange={(e) => handleClose(e)}
                        />
                      </Popover>
                    }
                    <div className="rating-container-inner">
                      <img
                        src="icons8-star-96.png"
                        alt="rating-star"
                        onClick={(e) => handleRatingClick(e, item.id)}
                      />
                      {item.avg_rating}
                      <p>{item.count} ratings</p>
                    </div>
                  </div>
                </td>
                <td className="td-center td-created">
                  {/* {new Date(item.created * 1000).toISOString().slice(0, 10)} */}
                  {item.created.slice(0, 10)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="hid">
              <td></td>
              <td>No results</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
