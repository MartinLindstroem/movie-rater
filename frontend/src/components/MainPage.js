import { useState, useEffect } from "react";
import "../App.css";
import MovieTable from "./MovieTable";
import AddMovie from "./AddMovie";
import Button from "@mui/material/Button";
import { helperFunctions } from "../helpers/functions";

function MainPage({ incrementPageViews }) {
  const [movies, setMovies] = useState([]);
  const [showAddMovie, setShowAddMovie] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      const moviesFromDb = await helperFunctions.fetchMovies();
      setMovies(moviesFromDb);
    };

    getMovies();
  }, []);

  // Update the page views everytime the component renders
  useEffect(() => {
    incrementPageViews();
  }, []);

  const toggleForm = () => {
    setShowAddMovie(!showAddMovie);
  };

  // Add movie to the database
  const addMovie = async (movie) => {
    await helperFunctions.addMovie(movie);

    const MovieTable = await helperFunctions.fetchMovies();
    setMovies(MovieTable);
  };

  // Update the rating of a movie
  const rateMovie = async (id, rating) => {
    if (id !== null && rating > 0) {
      const data = {
        id: id,
        rating: rating,
      };

      await helperFunctions.rateMovie(data);

      setTimeout(async () => {
        const MovieTable = await helperFunctions.fetchMovies();
        setMovies(MovieTable);
      }, 300);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <Button onClick={toggleForm} variant="contained">
          Add movie{" "}
        </Button>
        {showAddMovie && <AddMovie onAdd={addMovie} toggleForm={toggleForm} />}
        <MovieTable movies={movies} onUpdate={rateMovie} />
      </div>
    </div>
  );
}

export default MainPage;
